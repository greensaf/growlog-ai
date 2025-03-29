"use strict";
var _a;
exports.__esModule = true;
exports.POST = exports.GET = void 0;
var next_1 = require("uploadthing/next");
var core_1 = require("./core");
exports.GET = (_a = next_1.createRouteHandler({
    router: core_1.ourFileRouter
}), _a.GET), exports.POST = _a.POST;
