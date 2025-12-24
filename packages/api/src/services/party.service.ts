import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import type { DdbService } from "./ddb.service";
import { randomUUID } from "node:crypto";
import { Resource } from "sst";
import { hoursToSeconds } from "date-fns";

import { TableSchemas } from "@socket-party/shared/src/types";
import { getExpiresAt } from "@socket-party/shared/src/utils";

export type PartyServiceDeps = {
  ddbService: DdbService;
};

export const initPartyService = (deps: PartyServiceDeps) => {
  const { ddbService } = deps;

  const PARTY_TTL = hoursToSeconds(3);
  const tableName = Resource.PartyTable.name;

  async function create() {
    const partyId = randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = getExpiresAt(PARTY_TTL);

    const command = new PutItemCommand({
      TableName: tableName,
      Item: {
        partyId: { S: partyId },
        createdAt: { S: createdAt },
        expiresAt: { N: expiresAt.toString() },
      },
    });

    await ddbService.client.send(command);

    return TableSchemas.zParty.parse({
      partyId,
      createdAt,
      expiresAt,
      actorSnapshot: {},
    });
  }

  async function getByPartyId(
    partyId: string
  ): Promise<TableSchemas.Party | null> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: { partyId: { S: partyId } },
    });

    const result = await ddbService.client.send(command);
    if (!result.Item) return null;

    return TableSchemas.zParty.parse(result.Item);
  }

  return {
    create,
    getByPartyId,
  };
};

export type PartyService = ReturnType<typeof initPartyService>;
