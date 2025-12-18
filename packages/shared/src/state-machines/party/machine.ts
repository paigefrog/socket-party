import { setup } from "xstate";

export type States = "a" | "b";

export type Context = {};

export type Input = {
  partyCode: string;
  partyId: string;
};

export type Events = { type: "a"; message: string } | { type: "b" };

export const machine = setup({
  types: {
    context: {} as Context,
    input: {} as Input,
    events: {} as Events,
  },
  actions: {},
  guards: {},
});
