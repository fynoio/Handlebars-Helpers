const Handlebars = require('./index');

const template = Handlebars.compile('{{#ifEquals name "handlebars"}} - {{name}} {{else}} Hello {{/ifEquals}}');
const result = template({ name: 'handlebars' });

console.log(result);