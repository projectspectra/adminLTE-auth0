const log = (message: string | Error | object, level: 'info' | 'warn' | 'table' | 'error', sessionId?: string) => {
    if (message instanceof Error) {
        message = message.message + '\n' + message.stack;
    }
    if (typeof message === 'object') {
        console[level](`[${level.toUpperCase()}][${sessionId || 'SYSTEM'}]`);
        console[level](message);
    } else {
        console[level](`[${level.toUpperCase()}][${sessionId || 'SYSTEM'}] ` + message);
    }
}
export default {
    log: (message: unknown, sessionId?: string) => log(JSON.stringify(message, null, 2), 'info', sessionId),
    info: (message: unknown, sessionId?: string) => log(JSON.stringify(message, null, 2), 'info', sessionId),
    error: (message: unknown, sessionId?: string) => log(JSON.stringify(message, null, 2), 'error', sessionId),
    warn: (message: unknown, sessionId?: string) => log(JSON.stringify(message, null, 2), 'warn', sessionId),
    debug: (message: unknown, sessionId?: string) => log(JSON.stringify(message, null, 2), 'table', sessionId),
}