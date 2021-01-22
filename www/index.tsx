import * as React from "react";
import * as ReactDOM from "react-dom";
import { Scene } from "../src/render";
import { Surface } from "../src/render/surface";
import { scenes, loadScene } from "../src/scene";
import { Size } from "../src/hook/useWindowSize";
import { useMemo, useState, useEffect } from "react";
import clamp from "../src/util/clamp";

const parseQuery = (key: string): string | undefined => {
    let kv = window.location.search
        .substr(1)
        .split("&")
        .map(v => v.split("="))
        .find(([k, _]) => k === key);
    return kv ? kv[1] : undefined;
};

const getInitialSceneIndex = (): number => {
    const initialSceneName = parseQuery("s") || scenes[0].name;
    for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].name === initialSceneName) {
            return i;
        }
    }
    return 0;
};

const getSurfaceSize = (): Size | undefined => {
    const rawWidth = parseQuery("w");
    const rawHeight = parseQuery("h");
    if (rawWidth && rawHeight) {
        const width = clamp(parseInt(rawWidth) || 0, 0, 10000);
        const height = clamp(parseInt(rawHeight) || 0, 0, 10000);
        return { width, height };
    }
    return;
};

const App = () => {
    const sceneSize = useMemo(() => getSurfaceSize(), []);
    const [sceneIndex, setSceneIndex] = useState(getInitialSceneIndex());
    const scene = scenes[sceneIndex];

    useEffect(() => {
        let nextSceneIndex = sceneIndex;

        const nextScene = (right: boolean) => {
            do {
                nextSceneIndex =
                    (nextSceneIndex + (right ? 1 : -1) + scenes.length) %
                    scenes.length;
            } while (scenes[nextSceneIndex].expensive);
            setSceneIndex(nextSceneIndex);
        };

        const handler = (evt: KeyboardEvent) => {
            switch (evt.key) {
                case "ArrowLeft":
                    evt.preventDefault();
                    nextScene(false);
                    break;
                case "ArrowRight":
                    evt.preventDefault();
                    nextScene(true);
                    break;
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    return <Surface scene={scene} size={sceneSize} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
