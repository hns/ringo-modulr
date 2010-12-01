// Demo Stick app showing use of ringo-modulr middleware.
// Run with ringo-web.

var {Application} = require("stick");
var {redirectTo} = require("stick/helpers");

export("app");

var app = require("stick").Application(function(req) {
    return redirectTo("/example.html");
});
app.configure("modulr/middleware", "static");
// mount modulr middleware on website root.
// this will map URL /program.js to modulrized file ../example/program.js
app.modulr(module.resolve("../example"), "/");
app.static(module.directory);

