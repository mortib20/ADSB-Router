export class Logger {
    info(message: string) {
        const currentDate = new Date().toISOString();
        const logMessage = `[${currentDate}] \x1b[32minfo\x1b[0m: ${message}`;
        console.log(logMessage);
    }

    error(message: string) {
        const currentDate = new Date().toISOString();
        const logMessage = `[${currentDate}] \x1b[31merror\x1b[0m: ${message}`;
        console.error(logMessage);
    }
}
