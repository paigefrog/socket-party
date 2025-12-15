export function handler(event: any) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  // Process the SQS messages here
}
