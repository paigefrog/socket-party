import { z } from "zod";

const zBase = z.object({
  createdAt: z.iso.datetime(),
  expiresAt: z.number(),
});

export const zPartyCode = zBase.extend({
  partyCode: z.string().meta({ description: "Hash key" }),
  partyId: z.string(),
});
export type PartyCode = z.infer<typeof zPartyCode>;

export const zParty = zBase.extend({
  partyId: z.string().meta({ description: "Hash key" }),
  actorSnapshot: z.unknown(), // Using `unknown` to prevent slow parsing on a huge object
});
export type Party = z.infer<typeof zParty>;
