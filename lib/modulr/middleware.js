var {Collector} = require("./collector");
var strings = require("ringo/utils/strings");

export("middleware");

function middleware(next, app) {

    var _base = getRepository("public/scripts"),
        _mountpoint = "/";

    app.modulr = function(base, mountpoint) {
        if (typeof base === "string") {
            _base = getRepository(base);
        } else if (base instanceof org.ringojs.repository.Repository) {
            _base = base;
        } else {
            throw new Error("base must be string or repository");
        }
        if (mountpoint) {
            _mountpoint = String(mountpoint);
            if (!strings.endsWith(_mountpoint, "/")) {
                _mountpoint += "/";
            }
        }
    };

    return function(req) {
        var path = req.pathInfo;
        if (strings.endsWith(path, ".js") && strings.startsWith(path, _mountpoint)) {
            var main = path.substring(_mountpoint.length);
            if (_base.getResource(main).exists()) {
                var coll = new Collector(_base);
                coll.add(main);
                return {
                    status: 200,
                    headers: {"Content-Type": "text/javascript"},
                    body: coll // Collector implements forEach(fn)
                };
            }
        }
        return next(req);
    };
};
