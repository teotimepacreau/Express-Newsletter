const handlebars = require('handlebars');
// Define a basic "block" helper
handlebars.registerHelper('block', function (name, options) {
    const blocks = this._blocks || (this._blocks = {});
    const block = blocks[name] || (blocks[name] = []);
    block.push(options.fn(this));
  });