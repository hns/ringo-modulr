// Demo Stick app showing use of ringo-modulr middleware.
// Run with ringo-web.

var {Application, helpers} = require("stick");

var app = exports.app = Application(function(req) {
    return helpers.redirectTo("/example.html");
});

app.configure("ringo-modulr", "static");
// mount modulr middleware on website root.
// this will map URL /program.js to modulrized file ../example/program.js
app.modulr(module.resolve("../example"), "/");
app.static(module.directory);

