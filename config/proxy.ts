export default {
  dev: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  pre: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
};
