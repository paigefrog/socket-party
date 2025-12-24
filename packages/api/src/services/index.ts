import { initDdbService } from "./ddb.service";
import { initIoService } from "./io.service";
import { initObscenityService } from "./obscenity.service";
import { initPartyCodeService } from "./party-code.service";
import { initPartyService } from "./party.service";

import Elysia from "elysia";

const ddbService = initDdbService();
const obscenityService = initObscenityService();

export const servicesPlugin = new Elysia().decorate("services", {
  ddbService,
  ioService: initIoService(),
  obscenityService,
  partyCodeService: initPartyCodeService({ ddbService, obscenityService }),
  partyService: initPartyService({ ddbService }),
});
