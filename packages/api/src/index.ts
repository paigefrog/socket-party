import { Server as Engine } from "@socket.io/bun-engine";
import { Elysia } from "elysia";
import { Server } from "socket.io";

const io = new Server();
const ioBunEngine = new Engine({ path: "/socket.io/" });
io.bind(ioBunEngine);

const app = new Elysia()
  .all("/socket.io/*", ({ request, server }) => {
    if (!server) throw new Error("Server not found");
    return ioBunEngine.handleRequest(request, server);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
