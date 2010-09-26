/**
 * @fileOverview 
 */

var {visitScriptResource, Token, isName, getName, getTypeName} = require("ringo/parser");
var {resolveId} = require("ringo/utils/files");
var {join, read} = require("fs");
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
        visitScriptResource(resource, function(node) {
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

    this.render = function() {
        var boilerplate = join(module.directory, "../../assets/modulr.js");
        print(read(boilerplate));
        print("(function(require, module) { require.define({");
        for (var [id, resource] in dependencies) {
            print("'" + id + "': function(require, exports, module) {");
            print(resource.getContent());
            print("},");
        }
        print("});");
        print("require.ensure(" + JSON.stringify(Object.keys(dependencies)) + ", function() {");
        print("require('" + main + "');")
        print("});");
        print("})(modulr.require, modulr.require.main);")
    };

    Object.defineProperty(this, "dependencies", {
        get: function() {
            return dependencies;
        }
    });

}

function throwError(msg, resource, node) {
    throw new Error("require called with a non-string argument" +
        "\nin " + resource.getPath() + "#" +  node.getLineno());
}

if (require.main == module) {
    var c = new Collector(getRepository(system.args[1]));
    c.add(system.args[2]);
    c.render();
}
