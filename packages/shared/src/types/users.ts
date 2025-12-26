import { z } from "zod";

export const zUser = z.object({
  deviceId: z.uuid(), // Device local storage ID to identify returning users
  isConnected: z.boolean().default(true),
  socketId: z.string(), // Ephemeral socket.io value, could change!
});
export type User = z.infer<typeof zUser>;

export const zPlayer = zUser.extend({
  name: z.string(),
  score: z.number().default(0),
});
export type Player = z.infer<typeof zPlayer>;

export const zSpectator = zUser.extend({
  name: z.string(),
});
export type Spectator = z.infer<typeof zSpectator>;

export const zHost = zUser.extend({
  email: z.email(),
});
export type Host = z.infer<typeof zHost>;
