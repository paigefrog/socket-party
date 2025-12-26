import type { SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event, context) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));
  } catch (error) {
    console.error("Error processing event:", error, context);
  }
};
