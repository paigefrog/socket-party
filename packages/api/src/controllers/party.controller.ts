import { servicesPlugin } from "@services";
import Elysia from "elysia";

export const partyController = new Elysia({ prefix: "/party" })
  .use(servicesPlugin)
  .post("/", async (ctx) => {
    const { partyService } = ctx.services;

    try {
      await partyService.create();
    } catch (error) {
      console.error("Error creating party:", error);
      throw new Error("Failed to create party");
    }
  });
