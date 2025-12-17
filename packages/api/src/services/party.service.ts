import { DdbService } from "./ddb.service";

export type PartyServiceDeps = {
  ddbService: DdbService;
};

export const initPartyService = (deps: PartyServiceDeps) => {
  const { ddbService } = deps;

  async function create() {
    return { message: "Party created" };
  }

  async function getById(id: string) {
    return { message: "get by id" };
  }

  return {
    create,
    getById,
  };
};

export type PartyService = ReturnType<typeof initPartyService>;
