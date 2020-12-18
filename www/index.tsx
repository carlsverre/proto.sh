import * as React from "react";
import * as ReactDOM from "react-dom";
import { Surface } from "../src/render/surface";
import { scenes, loadScene, Scene } from "../src/scene";
import { Size } from "../src/hook/useWindowSize";
import { useState, useEffect } from "react";
import clamp from "../src/util/clamp";

const parseQuery = (key: string): string => {
    let kv = window.location.search
        .substr(1)
        .split("&")
        .map(v => v.split("="))
        .find(([k, _]) => k === key);
    return kv && kv[1];
};

const getInitialScene = (): Scene => {
    return loadScene(parseQuery("s")) || scenes[0];
};

const getSurfaceSize = (): Size | undefined => {
    const width = clamp(parseInt(parseQuery("w")) || 0, 0, 10000);
    const height = clamp(parseInt(parseQuery("h")) || 0, 0, 10000);
    if (width && height) {
        return { width, height };
    }
};

const App = () => {
    const initialScene = getInitialScene();
    const [scene, setScene] = useState(initialScene);
    const sceneSize = getSurfaceSize();

    useEffect(() => {
        let i = 0;
        const handler = () => {
            let nextScene = scenes[0];
            while (true) {
                nextScene = scenes[++i % scenes.length];
                if (nextScene.name !== "wallpaper") {
                    break;
                }
            }
            setScene(nextScene);
        };

        document.addEventListener("mouseup", handler);
        return () => document.removeEventListener("mouseup", handler);
    }, []);

    return <Surface scene={scene} size={sceneSize} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
