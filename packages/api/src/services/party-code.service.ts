import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { DdbService } from "./ddb.service";
import { randomUUID } from "node:crypto";
import { Resource } from "sst";
import { hoursToSeconds } from "date-fns";

import { TableSchemas } from "@socket-party/shared/src/types";
import { getExpiresAt } from "@socket-party/shared/src/utils";

export type PartyCodeServiceDeps = {
  ddbService: DdbService;
};

export const initPartyCodeService = (deps: PartyCodeServiceDeps) => {
  const { ddbService } = deps;

  async function create() {
    const partyCode = randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = getExpiresAt(hoursToSeconds(6));

    const command = new PutItemCommand({
      TableName: Resource.PartyCodeTable.name,
      Item: {
        partyCode: { S: partyCode },
        createdAt: { S: createdAt },
        expiresAt: { N: expiresAt.toString() },
      },
    });

    await ddbService.client.send(command);

    return TableSchemas.zPartyCode.parse({
      partyCode,
      createdAt,
      expiresAt,
      actorSnapshot: {},
    });
  }

  async function getByPartyCode(
    partyCode: string
  ): Promise<TableSchemas.Party | null> {
    const command = new GetItemCommand({
      TableName: Resource.PartyCodeTable.name,
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
