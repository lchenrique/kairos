import { defineConfig } from "orval";
import { resolve } from "path";

export default defineConfig({
  kairos: {
    input: {
      target: resolve(__dirname, "../backend/swagger.json")
    },
    output: {
      mode: "tags-split",
      target: "./src/lib/api/generated",
      schemas: "./src/lib/api/generated/model",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/lib/api/axios-instance.ts",
          name: "customInstance"
        },
        query: {
          useQuery: true,
          useInfinite: true,
        },
        header: () => [
          'type AxiosResponse<T> = T',
        ],
      }
    }
  }
});
