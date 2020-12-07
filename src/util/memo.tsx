export type Memo<T> = {
    keys: any[];
    lastValue: T | undefined;
};

export function initMemo<T>(): Memo<T> {
    return {
        keys: [],
        lastValue: undefined,
    };
}

export function stepMemo<T>(state: Memo<T>, keys: any[], cb: () => T): T {
    let recompute = keys.length !== state.keys.length;
    for (let i = 0; i < keys.length && !recompute; i++) {
        recompute ||= keys[i] !== state.keys[i];
    }

    if (!state.lastValue || recompute) {
        state.lastValue = cb();
        state.keys = keys;
    }
    return state.lastValue;
}
