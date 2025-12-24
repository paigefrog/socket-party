import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { hoursToSeconds } from "date-fns";
import { randomUUID } from "node:crypto";
import { Resource } from "sst";

import { TableSchemas } from "@socket-party/shared/src/types";
import { getExpiresAt } from "@socket-party/shared/src/utils";

import type { DdbService } from "./ddb.service";
import type { ObscenityService } from "./obscenity.service";

export type PartyCodeServiceDeps = {
  ddbService: DdbService;
  obscenityService: ObscenityService;
};

export const initPartyCodeService = (deps: PartyCodeServiceDeps) => {
  const { ddbService, obscenityService } = deps;

  const PARTY_CODE_LENGTH = 5;
  const PARTY_CODE_TTL = hoursToSeconds(3);
  const tableName = Resource.PartyCodeTable.name;

  function generatePartyCode(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let partyCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      partyCode += characters[randomIndex];
    }

    // Regenerate if the code contains obscene words
    if (obscenityService.matcher.hasMatch(partyCode)) {
      return generatePartyCode(length);
    }

    return partyCode;
  }

  async function create() {
    const createdAt = new Date().toISOString();
    const expiresAt = getExpiresAt(PARTY_CODE_TTL);
    const partyId = randomUUID();

    let partyCode = generatePartyCode(PARTY_CODE_LENGTH);
    while ((await getByPartyCode(partyCode)) !== null) {
      partyCode = generatePartyCode(PARTY_CODE_LENGTH);
    }

    const command = new PutItemCommand({
      TableName: tableName,
      Item: {
        createdAt: { S: createdAt },
        expiresAt: { N: expiresAt.toString() },
        partyCode: { S: partyCode },
        partyId: { S: partyId },
      },
    });

    await ddbService.client.send(command);

    return TableSchemas.zPartyCode.parse({
      createdAt,
      expiresAt,
      partyCode,
      partyId,
    });
  }

  async function getByPartyCode(
    partyCode: string
  ): Promise<TableSchemas.Party | null> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: { partyCode: { S: partyCode } },
    });

    const result = await ddbService.client.send(command);
    if (!result.Item) return null;

    return TableSchemas.zParty.parse(result.Item);
  }

  return {
    create,
    getByPartyCode,
  };
};

export type PartyCodeService = ReturnType<typeof initPartyCodeService>;
