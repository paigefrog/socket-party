import Elysia from "elysia";

import { servicesPlugin } from "@/services";

export const partyController = new Elysia({ prefix: "/party" })
  .use(servicesPlugin)
  .post("/", async (ctx) => {
    const { partyCodeService } = ctx.services;

    try {
      await partyCodeService.create();
    } catch (error) {
      console.error("Error creating party code:", error);
      throw new Error("Failed to create party code");
    }
  });
