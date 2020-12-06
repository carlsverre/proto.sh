import * as React from "react";
import * as ReactDOM from "react-dom";
import { Surface } from "../src/render/surface";
import { scenes } from "../src/scene";
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

const getInitialScene = (): number => {
    return clamp(parseInt(parseQuery("s")) || 0, 0, scenes.length - 1);
};

const App = () => {
    const [scene, setScene] = useState(scenes[getInitialScene()]);

    useEffect(() => {
        let i = 0;
        const handler = () => setScene(scenes[++i % scenes.length]);

        document.addEventListener("mouseup", handler);
        return () => document.removeEventListener("mouseup", handler);
    }, []);

    return <Surface scene={scene} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
