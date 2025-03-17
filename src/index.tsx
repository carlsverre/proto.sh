import * as React from "react";
import * as ReactDOM from "react-dom";
import { Surface } from "./render/surface";
import { scenes } from "./scene";
import { Size } from "./hook/useWindowSize";
import { useMemo, useState, useEffect } from "react";
import { parseQuery, setRandom } from "./util/query";
import clamp from "./util/clamp";

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
            setRandom();
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

setRandom();
ReactDOM.render(<App />, document.getElementById("root"));
