/**
 * @fileOverview
 */

var {Parser, Token, isName, getName, getTypeName} = require("ringo/parser");
var {resolveId} = require("ringo/utils/files");
var {join, read, open} = require("fs");
var strings = require("ringo/utils/strings");

export("Collector");

/**
 *
 */
function Collector(repository) {

    var dependencies = {};
    var self = this;
    var main;

    this.add = function(id) {
        main = main || id;
        var resource = repository.getResource(id + ".js");
        if (!resource || !resource.exists()) {
            throw new Error("Cannot find resource '" + id + ".js' in " + repository);
        }
        dependencies[id] = resource;
        new Parser().visit(resource, function(node) {
            if (node.type != Token.CALL || !isName(node.target)
                    || getName(node.target) != "require") {
                return true; // not a require() call, but visit child nodes
            }
            var args = ScriptableList(node.arguments);
            if (args.length != 1) {
                throwError("require called with " + args.length + " arguments", resource, node);
            } else if (getTypeName(args[0]) != "STRING") {
                throwError("require called with a non-string argument", resource, node);
            }
            var canonicalId = resolveId(id, args[0].getValue());
            if (!(canonicalId in dependencies)) {
                self.add(canonicalId);
            }
            return false; // skip child nodes, requires don't nest
        });
    };

    this.clear = function() {
        dependencies = {};
    };

    this.render = function(file) {
        if (file) {
            system.stderr.write("Writing to " + file + " ... ");
            var out = open(file, "w");
        } else {
            out = system.stdout;
        }
        var boilerplate = join(module.directory, "../../assets/modulr.js");
        out.writeLine(read(boilerplate))
        .writeLine("(function(require, module) { require.define({");
        for (var [id, resource] in dependencies) {
            out.writeLine("'" + id + "': function(require, exports, module) {");
            out.writeLine(resource.getContent());
            out.writeLine("},");
        }
        out.writeLine("});");
        out.writeLine("require.ensure("
                + JSON.stringify(Object.keys(dependencies))
                + ", function() {");
        out.writeLine("require('" + main + "');");
        out.writeLine("});");
        out.writeLine("})(modulr.require, modulr.require.main);");
        if (file) {
            out.close();
            system.stderr.writeLine("done");
        }
    };

    Object.defineProperty(this, "dependencies", {
        get: function() {
            return dependencies;
        }
    });

}

function throwError(msg, resource, node) {
    throw new Error(msg + "\nin " + resource.getPath() + "#" +  node.getLineno());
}

if (require.main == module) {
    var c = new Collector(getRepository(system.args[1]));
    c.add(system.args[2]);
    c.render();
}

