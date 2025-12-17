import Elysia from "elysia";
import { servicesPlugin } from "../services";

export const partyController = new Elysia({ prefix: "/party" })
  .use(servicesPlugin)
  .post("/", async (ctx) => {
    const { partyService } = ctx.services;

    await partyService.create();

    return { message: "Party created" };
  });
