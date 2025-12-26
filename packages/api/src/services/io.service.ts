import { Server as Engine } from "@socket.io/bun-engine";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { Redis } from "ioredis";
import { Server } from "socket.io";
import { Resource } from "sst";

export const initIoService = () => {
  const redisClient = new Redis({
    host: Resource.IoRedis.host,
    port: Resource.IoRedis.port,
    username: Resource.IoRedis.username,
    password: Resource.IoRedis.password,
  });

  const io = new Server({
    adapter: createAdapter(redisClient),
    transports: ["websocket", "polling"], // Order matters, helps prevent sticky session issues
  });

  const ioBunEngine = new Engine({ path: "/socket.io/" });
  io.bind(ioBunEngine);

  function createNamespace(namespace: string) {
    return io.of(namespace);
  }

  return {
    createNamespace,
    io,
    ioBunEngine,
  };
};

export type IoService = ReturnType<typeof initIoService>;
