var system = require("system");
var {Parser} = require("ringo/args");
var {canonical, exists, directory, path, relative} = require("fs");
var {Collector} = require("./collector");
var {middleware} = require("./middleware");

export("main", "middleware");

function main(args) {
    var p = new Parser();
    p.addOption("o", "output", "FILE", "Write the output to FILE. Defaults to stdout.");
    p.addOption("r", "root", "DIR", "Set DIR as root directory. Defaults to the directory containing FILE.");
    p.addOption("h", "help", null, "Show this message.");
    args.shift();
    try {
        var options = p.parse(args);
    } catch (e) {
        usage(e.message, p.help());
    }
    if (options.help || !args[0]) {
        usage("Usage: ringo-modulr [OPTIONS] FILE", p.help());
    }
    var file = args[0];
    if (!exists(file))
        error("File not found: " + file);
    var root = options.root || directory(file);
    if (!exists(root))
        error("Root directory not found: " + root);
    file = canonical(file);
    root = canonical(root);
    var repo = getRepository(root);
    var relpath = relative(root + "/", file);
    var c = new Collector(repo);
    c.add(relpath);
    c.render(options.output);
}

function usage(message, help) {
    system.stderr.print(message);
    system.stderr.print(help);
    system.exit();
}

function error(message) {
    system.stderr.print(message);
    system.exit(1);
}

if (require.main == module) {
    main(system.args);
}

