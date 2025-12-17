import { initDdbService } from "./ddb.service";
import { initPartyService } from "./party.service";

import Elysia from "elysia";

const ddbService = initDdbService();

export const servicesPlugin = new Elysia().decorate("services", {
  ddbService,
  partyService: initPartyService({ ddbService }),
});
