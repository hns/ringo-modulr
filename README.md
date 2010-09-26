ringo-modulr
============

Description
-----------

`ringo-modulr`is  a port of [modulr] to [Ringo]. **It is work in progress and
barely functional.**

[modulr]: http://github.com/codespeaks/modulr
[Ringo]: http://ringojs.org/

`ringo-modulr` provides a [CommonJS module] implementation for client-side
JavaScript. It accepts a singular file as input (the _program_) on which is
does static analysis to recursively resolve its dependencies.

[CommonJS module]: (http://commonjs.org/specs/modules/1.0.html)

The program, its dependencies and a small, namespaced JavaScript library are
concatenated into a single `js` file.The bundled JavaScript library provides
each module with the necessary `require` function and `exports` and `module`
free variables.

