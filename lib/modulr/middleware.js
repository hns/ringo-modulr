var {Collector} = require("./collector");
var strings = require("ringo/utils/strings");

export("middleware");

function middleware(root, mountpoint) {
    mountpoint = mountpoint || "/scripts/";
    if (!strings.endsWith(mountpoint, "/"))
        mountpoint += "/";
    var length = mountpoint.length;
    var repo = getRepository(root);
    if (!repo.exists()) {
        throw new Error("Root directory not found: " + root);
    }

    return function(app) {
        return function(req) {
            var path = req.pathInfo;
            if (strings.endsWith(path, ".js") && strings.startsWith(path, mountpoint)) {
                var main = path.substring(length);
                if (repo.getResource(main).exists()) {
                    var coll = new Collector(repo);
                    coll.add(main);
                    return {
                        status: 200,
                        headers: {"Content-Type": "text/javascript"},
                        body: coll // Collector implements forEach(fn)
                    };
                }
            }
            return app(req);
        };
    };
}
