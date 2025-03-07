const log = (message: string | Error | object | unknown, level: 'info' | 'warn' | 'table' | 'error', userGuid?: string) => {
    if (message instanceof Error) {
        message = message.message + '\n' + message.stack;
    }
    if (typeof message !== 'string') {
        console[level](`[${level.toUpperCase()}][${userGuid || 'SYSTEM'}]`, message);
    } else {
        console[level](`[${level.toUpperCase()}][${userGuid || 'SYSTEM'}] ${message}`);
    }
}

export default {
    log: (message: string | Error | object, userGuid?: string) => log(message, 'info', userGuid),
    info: (message: string | Error | object, userGuid?: string) => log(message, 'info', userGuid),
    error: (message: string | Error | object | unknown, userGuid?: string) => log(message, 'error', userGuid),
    warn: (message: string | Error | object, userGuid?: string) => log(message, 'warn', userGuid),
    debug: (message: string | Error | object, userGuid?: string) => log(message, 'table', userGuid),
}