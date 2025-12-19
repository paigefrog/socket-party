import { initDdbService } from "./ddb.service";
import { initIoService } from "./io.service";
import { initPartyService } from "./party.service";

import Elysia from "elysia";

const ddbService = initDdbService();

export const servicesPlugin = new Elysia().decorate("services", {
  ddbService,
  ioService: initIoService(),
  partyService: initPartyService({ ddbService }),
});
