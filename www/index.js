"use strict";
exports.__esModule = true;
var React = require("react");
var ReactDOM = require("react-dom");
var surface_1 = require("../src/render/surface");
var scene_1 = require("../src/scene");
var react_1 = require("react");
var clamp_1 = require("../src/util/clamp");
var parseQuery = function (key) {
    var kv = window.location.search
        .substr(1)
        .split("&")
        .map(function (v) { return v.split("="); })
        .find(function (_a) {
        var k = _a[0], _ = _a[1];
        return k === key;
    });
    return kv && kv[1];
};
var getInitialScene = function () {
    return scene_1.loadScene(parseQuery("s")) || scene_1.scenes[0];
};
var getSurfaceSize = function () {
    var width = clamp_1["default"](parseInt(parseQuery("w")) || 0, 0, 10000);
    var height = clamp_1["default"](parseInt(parseQuery("h")) || 0, 0, 10000);
    if (width && height) {
        return { width: width, height: height };
    }
};
var App = function () {
    var initialScene = getInitialScene();
    var _a = react_1.useState(initialScene), scene = _a[0], setScene = _a[1];
    var sceneSize = getSurfaceSize();
    react_1.useEffect(function () {
        var i = 0;
        var handler = function (evt) {
            if (evt.button !== 0) {
                return;
            }
            evt.preventDefault();
            var nextScene = scene_1.scenes[0];
            while (true) {
                nextScene = scene_1.scenes[++i % scene_1.scenes.length];
                if (nextScene.name !== "wallpaper") {
                    break;
                }
            }
            setScene(nextScene);
        };
        document.addEventListener("mouseup", handler);
        return function () { return document.removeEventListener("mouseup", handler); };
    }, []);
    return <surface_1.Surface scene={scene} size={sceneSize}/>;
};
ReactDOM.render(<App />, document.getElementById("root"));
