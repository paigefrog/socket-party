import { Server as Engine } from "@socket.io/bun-engine";
import { Elysia } from "elysia";
import { Server } from "socket.io";

import { partyController } from "@/controllers";

const io = new Server();
const ioBunEngine = new Engine({ path: "/socket.io/" });
io.bind(ioBunEngine);

const app = new Elysia()
  .use(partyController)
  .all("/socket.io/*", ({ request, server }) => {
    if (!server) throw new Error("Server not found");
    return ioBunEngine.handleRequest(request, server);
  })
  .listen(3000);

if (app.server) {
  const { hostname, port } = app.server;
  console.log(`🦊 Elysia is running at ${hostname}:${port}`);
} else {
  console.error("Failed to start Elysia server?");
}
