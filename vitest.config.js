import {
  defineConfig
} from "vitest/config";


export default defineConfig({

  test: {

    environment:
      "jsdom",


    environmentOptions: {

      jsdom: {

        url:
          "http://localhost:5500/"

      }

    },

    pool:
      "threads",

    fileParallelism:
      false,


    maxWorkers:
      1,


    isolate:
      true,


    setupFiles: [

      "./tests/setup.js"

    ],


    clearMocks:
      true,


    restoreMocks:
      true,


    testTimeout:
      15000,


    hookTimeout:
      15000,


    coverage: {

      provider:
        "v8",


      reporter: [

        "text",
        "html"

      ],


      include: [

        "js/**/*.js"

      ],


      exclude: [

        "data/**",
        "tests/**"

      ]

    }

  }

});