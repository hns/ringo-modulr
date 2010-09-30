var {Collector} = require("./collector");
var strings = require("ringo/utils/strings");

export("middleware");

function middleware(root, mountpoint) {
    if (!strings.endsWith(mountpoint, "/"))
        mountpoint += "/";
    var length = mountpoint.length;
    var repo = getRepository(root);
    if (!repo.exists()) {
        throw new Error("Root directory not found: " + root);
    }

    return function(app) {
        return function(req) {
            if (strings.startsWith(req.pathInfo, mountpoint)) {
                var coll = new Collector(repo);
                var main = req.pathInfo.substring(length);
                coll.add(main);
                return {
                    status: 200,
                    headers: {"Content-Type": "text/javascript"},
                    body: coll
                };
            }
            return app(req);
        };
    };
}
