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
    const vpc = new sst.aws.Vpc("SocketPartyVpc");

    const staticSite = new sst.aws.StaticSite("Ui", {
      build: {
        command: `bun run --filter "ui" build`,
        output: "packages/ui/dist",
      },
      domain: "socketparty.com",
    });

    const xstateQueue = new sst.aws.Queue("XstateQueue", {
      fifo: true,
    });
    const xstateQueueHandler = new sst.aws.Function("XstateQueueHandler", {
      runtime: "nodejs22.x",
      handler: "packages/queue/dist/index.handler",
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

    // const cluster = new sst.aws.Cluster("ApiCluster", { vpc });
    // const service = new sst.aws.Service("ApiService", {
    //   cluster,
    //   cpu: "0.25 vCPU",
    //   image: {
    //     context: "packages/api",
    //     dockerfile: "Dockerfile",
    //   },
    //   memory: "0.5 GB",
    //   link: [xstateQueue, socketIoRedis],
    //   loadBalancer: {
    //     domain: `api.${staticSite.url}`,
    //     ports: [{ listen: "80/http", forward: "3000/http" }],
    //   },
    //   scaling: { min: 0, max: 4 },
    // });

    return {
      staticSiteUrl: staticSite.url,
      socketIoRedis: socketIoRedis.clusterId,
      xstateQueue: xstateQueue.arn,
      xstateQueueHandler: xstateQueueHandler.arn,
    };
  },
});
