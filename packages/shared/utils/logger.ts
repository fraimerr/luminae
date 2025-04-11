export class Logger {
	public static log(...message: any[]) {
		console.log(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			"\x1b[1;34mLOG" + "\x1b[0m",
			...message
		);
	}

	public static info(...message: any[]) {
		console.log(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			"\x1b[1;36mINFO" + "\x1b[0m",
			...message
		);
	}

	public static warn(...message: any[]) {
		console.warn(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			"\x1b[1;33mWARN" + "\x1b[0;35m",
			...message
		);
	}

	public static error(...message: any[]) {
		console.warn(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			"\x1b[1;31mERROR" + "\x1b[0;35m",
			...message
		);
	}

	public static customLog(name: string, ...message: any[]) {
		console.log(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			`\x1b[1;31m${name}` + "\x1b[0m",
			...message
		);
	}

	public static customError(name: string, ...message: any[]) {
		console.warn(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}]`,
			`\x1b[1;31m${name}` + "\x1b[0;91m",
			...message
		);
	}

	public static throwError(...message: (string | number | boolean)[]): any {
		throw new Error(
			`\x1b[90m[${
				new Date().getFullYear() +
				"-" +
				("0" + (new Date().getMonth() + 1)).slice(-2) +
				"-" +
				("0" + new Date().getDate()).slice(-2) +
				" " +
				("0" + new Date().getHours()).slice(-2) +
				":" +
				("0" + new Date().getMinutes()).slice(-2) +
				":" +
				("0" + new Date().getSeconds()).slice(-2)
			}] ` +
				"\x1b[1;31mERROR" +
				"\x1b[0;35m " +
				message.join(" ")
		);
	}
}
