import { emit, setup } from "xstate";
import { type Host, type Player, type Spectator } from "@/types";

export type State = "lobby" | "game" | "finished" | "error";

export type Context = {
  maxPlayers: number;
  maxSpectators: number;
  partyId: string;
  host: Host;
  players: Player[];
  spectators: Spectator[];
};

export type Input = {
  host: Host;
  maxPlayers: number;
  maxSpectators: number;
  partyId: string;
};

export type Events =
  | {
      type: "user.join";
      deviceId: string;
      name: string;
      socketId: string;
    }
  | { type: "user.disconnect"; socketId: string }
  | { type: "user.reconnect"; socketId: string }
  | { type: "game.start" }
  | { type: "game.end" };

export type Emitted =
  | { type: "player.joined"; player: Player }
  | { type: "spectator.joined"; spectator: Spectator };

export const machineSetup = setup({
  types: {
    context: {} as Context,
    input: {} as Input,
    events: {} as Events,
    emitted: {} as Emitted,
  },

  actions: {
    addPlayer: ({ context }, params: Player) => {
      context.players.push(params);
      emit({ type: "player.joined", player: params });
    },

    addSpectator: ({ context }, params: Spectator) => {
      context.spectators.push(params);
      emit({ type: "spectator.joined", spectator: params });
    },
  },

  guards: {
    isPlayerLimitReached: ({ context }) => {
      return context.players.length >= context.maxPlayers;
    },
    isSpectatorLimitReached: ({ context }) => {
      return context.spectators.length >= context.maxSpectators;
    },
  },
});
