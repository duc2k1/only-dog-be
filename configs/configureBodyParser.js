module.exports = function configureBodyParser(app) {
  app.use(require("body-parser").raw({ type: "image/jpeg", limit: "3MB" }));
};
