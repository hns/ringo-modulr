var static = require("ringo/middleware/static");
var modulr = require("modulr/middleware");
var {join} = require("fs");
var {Response} = require("ringo/webapp/response");

exports.app = function(req) {
    return Response.redirect("/example.html");
};

exports.middleware = [
    modulr.middleware(join(module.directory, "../example/"), "/"),
    static.middleware(join(module.directory, "../output/"))
];