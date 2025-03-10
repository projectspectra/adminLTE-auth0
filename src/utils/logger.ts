const log = (message: unknown, level: 'info' | 'warn' | 'table' | 'error', userId?: string) => {
    if (typeof message !== 'string') {
        console[level](`[${level.toUpperCase()}][${userId || 'SYSTEM'}]`, message);
    } else {
        console[level](`[${level.toUpperCase()}][${userId || 'SYSTEM'}] ${message}`);
    }
}

export default {
    log: (message: unknown, userId?: string) => log(message, 'info', userId),
    info: (message: unknown, userId?: string) => log(message, 'info', userId),
    error: (message: unknown, userId?: string) => log(message, 'error', userId),
    warn: (message: unknown, userId?: string) => log(message, 'warn', userId),
    debug: (message: unknown, userId?: string) => log(message, 'table', userId),
}