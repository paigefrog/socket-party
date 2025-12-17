import Elysia from "elysia";
import { initDdbService } from "./ddb.service";
import { initPartyService } from "./party.service";

const ddbService = initDdbService();

export const servicesPlugin = new Elysia().decorate("services", {
  ddbService,
  partyService: initPartyService({ ddbService }),
});
