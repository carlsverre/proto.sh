import seedrandom from "seedrandom";

export const parseQuery = (key: string): string | undefined => {
    let kv = window.location.search
        .substring(1)
        .split("&")
        .map(v => v.split("="))
        .find(([k, _]) => k === key);
    return kv ? kv[1] : undefined;
};

export const setRandom = (): string => {
    const seed = parseQuery("r") || Math.random().toString();
    seedrandom(seed, { global: true });
    return seed;
};
