import { not } from "xstate";
import { machineSetup } from "./machine-setup";
import { zPlayer, zSpectator } from "@/types/users";

export const machine = machineSetup.createMachine({
  initial: "lobby",

  context: ({ input }) => ({
    partyId: input.partyId,
    maxPlayers: input.maxPlayers,
    maxSpectators: input.maxSpectators,
    host: input.host,
    players: [],
    spectators: [],
  }),

  states: {
    lobby: {
      on: {
        "user.join": [
          {
            guard: not("isPlayerLimitReached"),
            actions: {
              type: "addPlayer",
              params: ({ event }) => zPlayer.parse(event),
            },
          },
          {
            guard: not("isSpectatorLimitReached"),
            actions: {
              type: "addSpectator",
              params: ({ event }) => zSpectator.parse(event),
            },
          },
        ],
        "game.start": { target: "game" },
      },
    },

    game: {
      entry: () => console.log("GAME START"),
      on: {
        "game.end": { target: "finished" },
        "user.join": {
          guard: not("isSpectatorLimitReached"),
          actions: {
            type: "addSpectator",
            params: ({ event }) => zSpectator.parse(event),
          },
        },
      },
    },

    finished: {
      type: "final",
    },

    error: {
      type: "final",
    },
  },
});
