/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "socket-party",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const staticSite = new sst.aws.StaticSite("SocketPartySite", {
      build: {
        command: `bun run build`,
        output: "packages/ui/dist",
      },
    });

    const queue = new sst.aws.Queue("XstateEventQueue", {
      fifo: true,
    });

    // const vpc = new sst.aws.Vpc("ApiVpc");
    // const cluster = new sst.aws.Cluster("ApiCluster", { vpc });
    // const service = new sst.aws.Service("ApiService", {
    //   cluster,
    //   cpu: "0.25 vCPU",
    //   memory: "0.5 GB",
    //   scaling: { min: 1, max: 4 },
    //   image: {
    //     context: "packages/api",
    //     dockerfile: "Dockerfile",
    //   },
    //   link: [queue],
    // });

    return { staticSiteUrl: staticSite.url };
  },
});
