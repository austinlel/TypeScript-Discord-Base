import chalk from 'chalk';

class Logger {
	private getCurrentTime(): string {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	private logMessage(
		color: keyof typeof chalk,
		symbol: string,
		message: string
	): void {
		console.log(
			`${chalk.gray(this.getCurrentTime())} ${(
				chalk[color as keyof typeof chalk] as any
			)(`[${symbol}]`)} ${message}`
		);
	}

	public Success(message: string): void {
		this.logMessage('green', '+', message);
	}

	public Error(message: string): void {
		this.logMessage('red', '-', message);
	}

	public Info(message: string): void {
		this.logMessage('yellow', '!', message);
	}

	public Log(message: string): void {
		this.logMessage('yellow', '*', message);
	}
}

export default new Logger();
