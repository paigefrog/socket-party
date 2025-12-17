import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const initDdbService = () => ({
  client: new DynamoDBClient({ region: "us-east-2" }),
});

export type DdbService = ReturnType<typeof initDdbService>;
