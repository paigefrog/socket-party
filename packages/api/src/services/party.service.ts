import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DdbService } from "./ddb.service";

export type PartyServiceDeps = {
  ddbService: DdbService;
};

export const initPartyService = (deps: PartyServiceDeps) => {
  const { ddbService } = deps;

  async function create() {
    return { message: "Party created" };
  }

  return {
    create,
  };
};

export type PartyService = ReturnType<typeof initPartyService>;
