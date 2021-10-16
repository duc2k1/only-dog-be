const JSDOM = require("jsdom").JSDOM;

module.exports = function configureBrowserPolyFills() {
  global.window = new JSDOM(`
  <body>
    <script>
    document.body.appendChild(document.createElement('hr'));
    </script>
  </body>`).window;
  global.document = window.document;
  global.fetch = require("node-fetch");
  global.HTMLVideoElement = class HTMLVideoElement {};
};
