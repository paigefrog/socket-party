/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "socket-party",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-2",
        },
      },
    };
  },
  async run() {
    const staticSite = new sst.aws.StaticSite("UiSite", {
      build: {
        command: "bun run --filter '@socket-party/ui' build",
        output: "packages/ui/dist",
      },
      dev: {
        command: "bun run --filter '@socket-party/ui' dev",
        url: "http://localhost:5173",
      },
    });

    const vpc = new sst.aws.Vpc("SocketPartyVpc");

    new sst.aws.Dynamo("GameStateTable", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
      ttl: "expiresAt",
    });

    const xstateQueue = new sst.aws.Queue("XstateQueue", {
      fifo: true,
    });
    const xstateQueueHandler = new sst.aws.Function("XstateQueueHandler", {
      runtime: "nodejs22.x",
      bundle: "packages/queue/dist",
      handler: "index.handler",
      vpc,
      link: [xstateQueue],
    });
    xstateQueue.subscribe(xstateQueueHandler.arn);

    const socketIoRedis = new sst.aws.Redis("SocketIoRedis", {
      cluster: false,
      engine: "valkey",
      instance: "t4g.micro",
      vpc,
    });

    const apiCluster = new sst.aws.Cluster("ApiCluster", { vpc });
    const apiService = new sst.aws.Service("ApiService", {
      cluster: apiCluster,
      cpu: "0.25 vCPU",
      dev: {
        command: "bun run --filter '@socket-party/api' dev",
        url: "http://localhost:3000",
      },
      image: {
        context: "packages/api",
        dockerfile: "Dockerfile",
      },
      memory: "0.5 GB",
      link: [xstateQueue, socketIoRedis],
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      scaling: { min: 0, max: 2 },
    });

    return {
      apiServiceUrl: apiService.url,
      staticSiteUrl: staticSite.url,
      socketIoRedis: socketIoRedis.clusterId,
      xstateQueue: xstateQueue.arn,
      xstateQueueHandler: xstateQueueHandler.arn,
    };
  },
});
