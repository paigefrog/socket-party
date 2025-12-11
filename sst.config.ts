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
        command: `bun run build:dev`,
        output: "packages/ui/dist",
      },
    });

    return { staticSiteUrl: staticSite.url };
  },
});
