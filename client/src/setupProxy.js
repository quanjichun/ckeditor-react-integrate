const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  const servicePort = 4000;
  app.use(
    "/uploadFile",
    createProxyMiddleware({
      target: `http://localhost:${servicePort}`,
      changeOrigin: true
    })
  );
  app.use(
    "/download/:name",
    createProxyMiddleware({
      target: `http://localhost:${servicePort}`,
      changeOrigin: true
    })
  );
};
