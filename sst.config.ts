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
    const staticSite = new sst.aws.StaticSite("SocketPartySite", {
      build: {
        command: `bun run build`,
        output: "packages/ui/dist",
      },
    });

    const vpc = new sst.aws.Vpc("SocketPartyVpc");

    const xstateEventQueue = new sst.aws.Queue("XstateEventQueue", {
      fifo: true,
    });

    const socketIoRedis = new sst.aws.Redis("SocketIoRedis", {
      cluster: false,
      engine: "valkey",
      instance: "cache.t4g.micro",
      vpc,
    });

    const apiCluster = new sst.aws.Cluster("ApiCluster", { vpc });
    const apiService = new sst.aws.Service("ApiService", {
      cluster: apiCluster,
      cpu: "0.25 vCPU",
      image: {
        context: "packages/api",
        dockerfile: "Dockerfile",
      },
      memory: "0.5 GB",
      link: [xstateEventQueue, socketIoRedis],
      loadBalancer: {
        domain: `api.${staticSite.url}`,
      },
      scaling: { min: 1, max: 4 },
    });

    return { staticSiteUrl: staticSite.url };
  },
});
