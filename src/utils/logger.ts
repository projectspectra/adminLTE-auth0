const log = (message: string | Error | Object, level: 'info' | 'warn' | 'table' | 'error', sessionId?: string) => {
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
    log: (message: any, sessionId?: string) => log(JSON.stringify(message, null, 2), 'info', sessionId),
    info: (message: any, sessionId?: string) => log(JSON.stringify(message, null, 2), 'info', sessionId),
    error: (message: any, sessionId?: string) => log(JSON.stringify(message, null, 2), 'error', sessionId),
    warn: (message: any, sessionId?: string) => log(JSON.stringify(message, null, 2), 'warn', sessionId),
    debug: (message: any, sessionId?: string) => log(JSON.stringify(message, null, 2), 'table', sessionId),
}