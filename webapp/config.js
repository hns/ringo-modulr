// Demo webapp showing use of ringo-modulr middleware.
// Run with ringo-web.

var static = require("ringo/middleware/static");
var modulr = require("modulr/middleware");
var {join} = require("fs");
var {Response} = require("ringo/webapp/response");

exports.app = function(req) {
    return Response.redirect("/example.html");
};

exports.middleware = [
    // mount modulr middleware on website root.
    // this will map URL /program.js to modulrized file ../example/program.js
    modulr.middleware(join(module.directory, "../example/"), "/"),
    static.middleware(module.directory)
];
