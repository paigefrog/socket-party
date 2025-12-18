import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DdbService } from "./ddb.service";
import { randomUUID } from "node:crypto";
import { Resource } from "sst";
import { hoursToSeconds } from "date-fns";
import { getExpiresAt } from "@/utils/datetime";

export type PartyServiceDeps = {
  ddbService: DdbService;
};

export const initPartyService = (deps: PartyServiceDeps) => {
  const { ddbService } = deps;

  async function create() {
    const id = randomUUID();
    const expiresAt = getExpiresAt(hoursToSeconds(6));

    const command = new PutItemCommand({
      TableName: Resource.GameStateTable.name,
      Item: {
        id: { S: id },
        createdAt: { S: new Date().toISOString() },
        expiresAt: { N: expiresAt.toString() },
      },
    });

    await ddbService.client.send(command);

    return { id };
  }

  async function getById(id: string) {
    return { message: "get by id" };
  }

  return {
    create,
    getById,
  };
};

export type PartyService = ReturnType<typeof initPartyService>;
