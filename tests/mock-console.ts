import { afterEach, vi, type MockInstance } from 'vitest';

export type MockedConsole = {
    error?: MockInstance;
    log?: MockInstance;
    info?: MockInstance;
    group?: MockInstance;
    groupEnd?: MockInstance;
    table?: MockInstance;
    warn?: MockInstance;
    setup: () => void;
    dispose: () => void;
    [Symbol.dispose]: () => void;
};

let lastMockedConsole: MockedConsole | undefined = undefined;

export const hideConsoleOutput = () => {
    if (lastMockedConsole) {
        return lastMockedConsole;
    }
    const ret: MockedConsole = {
        error: undefined,
        log: undefined,
        group: undefined,
        groupEnd: undefined,
        table: undefined,
        info: undefined,
        warn: undefined,
        setup: () => {
            ret.error ??= vi.spyOn(console, 'error').mockImplementation(() => { });
            ret.log ??= vi.spyOn(console, 'log').mockImplementation(() => { });
            ret.group ??= vi.spyOn(console, 'group').mockImplementation(() => { });
            ret.groupEnd ??= vi
                .spyOn(console, 'groupEnd')
                .mockImplementation(() => { });
            ret.table ??= vi.spyOn(console, 'table').mockImplementation(() => { });
            ret.info ??= vi.spyOn(console, 'info').mockImplementation(() => { });
            ret.warn ??= vi.spyOn(console, 'warn').mockImplementation(() => { });
        },
        dispose: () => {
            ret[Symbol.dispose]();
        },
        [Symbol.dispose]: () => {
            ret.error?.mockRestore();
            delete ret.error;
            ret.log?.mockRestore();
            delete ret.log;
            ret.group?.mockRestore();
            delete ret.group;
            ret.groupEnd?.mockRestore();
            delete ret.groupEnd;
            ret.table?.mockRestore();
            delete ret.table;
            ret.info?.mockRestore();
            delete ret.info;
            ret.warn?.mockRestore();
            delete ret.warn;
        },
    };
    lastMockedConsole = ret;
    return ret;
};
afterEach(() => {
    // Automatically clean up any console mocking
    if (lastMockedConsole) {
        lastMockedConsole.dispose();
        lastMockedConsole = undefined;
    }
});
