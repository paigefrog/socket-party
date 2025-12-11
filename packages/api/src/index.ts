import { Server as Engine } from "@socket.io/bun-engine";
import { Elysia } from "elysia";
import { Server } from "socket.io";

const io = new Server();
const engine = new Engine({
  path: "/socket.io/",
});
io.bind(engine);

io.on("connection", (socket) => {
  console.log("connection", socket.id);
});

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
