import { defineConfig } from 'orval'

export default defineConfig({
  kairos: {
    input: {
      target: '../backend/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/lib/api/generated',
      schemas: './src/lib/api/generated/model',
      client: 'react-query',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/lib/api/axios-instance.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'page',
        },
        operations: {
          list: {
            query: {
              useInfinite: true,
            },
          },
        },
      },
    },
  },
})
