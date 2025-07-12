console.log('ddd')

module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,gif,text/html}"],
  swDest: "dist/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname === "/options/8537",
      handler: "NetworkFirst",
      options: {
        cacheName: "mainmenu",
        expiration: {
          maxEntries: 50,
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname === "/options/offline/4898",
      handler: "NetworkFirst",
      options: {
        cacheName: "offlinemenu",
        expiration: {
          maxEntries: 50,
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname === "/offline/game/4980",
      handler: "NetworkFirst",
      options: {
        cacheName: "game",
        expiration: {
          maxEntries: 50,
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname === "/offline/game/6058",
      handler: "NetworkFirst",
      options: {
        cacheName: "game2v2",
        expiration: {
          maxEntries: 50,
        },
      },
    },
  ],
};

