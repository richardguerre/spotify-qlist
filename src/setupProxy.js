const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/create", "/party" , "not-found", "/api", '/refresh_token'], { target: "http://qlist.herokuapp.com/" })
  );
};