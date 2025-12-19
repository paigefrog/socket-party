import { Elysia } from "elysia";

import { partyController } from "@/controllers";
import { servicesPlugin } from "@/services";

const app = new Elysia()
  .use(servicesPlugin)
  .use(partyController)
  .all("/socket.io/*", ({ request, server, services }) => {
    if (server === null) throw new Error("Server is null");
    const { ioService } = services;
    return ioService.ioBunEngine.handleRequest(request, server);
  })
  .listen(3000);

if (app.server) {
  const { hostname, port } = app.server;
  console.log(`🦊 Elysia is running at ${hostname}:${port}`);
} else {
  console.error("Failed to start Elysia server?");
}
