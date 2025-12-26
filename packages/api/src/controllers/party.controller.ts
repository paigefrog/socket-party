import Elysia from "elysia";

import { servicesPlugin } from "@/services";

export const partyController = new Elysia({ prefix: "/party" })
  .use(servicesPlugin)
  .post("/", async (ctx) => {
    const { partyService, partyCodeService, ioService } = ctx.services;

    try {
      const { partyId } = await partyService.create();
      const { partyCode } = await partyCodeService.create(partyId);
      ioService.createNamespace(`/party/${partyId}`);

      return { partyId, partyCode };
    } catch (error) {
      console.error("Error creating party:", error);
      throw new Error("Failed to create party");
    }
  });
