import { assign, setup } from "xstate";

export const machine = setup({
  types: {
    context: {} as {},
    input: {} as { partyId: string },
  },
  actions: {},
  guards: {},
});
