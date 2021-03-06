ringo-modulr
============

Description
-----------

`ringo-modulr`is  a port of [modulr] to [Ringo]. It provides a [CommonJS module]
implementation for client-side JavaScript. It accepts a singular file as input
(the _program_) on which is does static analysis to recursively resolve its
dependencies.

[modulr]: http://github.com/codespeaks/modulr
[Ringo]: http://ringojs.org/

[CommonJS module]: (http://commonjs.org/specs/modules/1.0.html)

The program, its dependencies and a small, namespaced JavaScript library are
concatenated into a single `js` file.The bundled JavaScript library provides
each module with the necessary `require` function and `exports` and `module`
free variables.

ringo-modulr currently only provides a subset of modulr functionality.
The `--lazy-eval`, `--minify`, `--global-export`, `--sync`, and
`--dependency-graph` options are not supported.

Install
-------

    $ ringo-admin install hns/ringo-modulr

Usage
-----

`ringo-modulr` provides two interfaces: A command line script and a Stick
middleware module.

To process a JavaScript source file with the command line script, run:

    $ ringo-modulr filename.js > output.js

Options are as follows:

    -o --output FILE  Write the output to FILE. Defaults to stdout.
    -r --root DIR     Set DIR as root directory. Defaults to the directory containing FILE.
    -h --help         Show this message.

The Stick middleware is provided by module `modulr/middleware`. It installs a `modulr`
method in the Stick application that takes two arguments: the base directory of the
JavaScript source code, and an optional URL prefix. Any request whose path matches the
URL prefix and ends with `.js` is looked up in the base JavaScript directory. If the
file is found, it is modulrized and served. Otherwise, the request is passed on through
the JSGI middleware chain.

The `webapp` directory contains a demo for the ringo-modulr middleware. You need to
install Stick in order to run it:

    $ ringo-admin install hns/stick

Then start the application with:

    $ ringo-web webapp

Credits
-------

Thanks to Tobie Langel for creating the original modulr project!

License
-------

ringo-modulr is freely distributable under the terms of the MIT license.
