const fetchedGuildsSymbol = Symbol.for('roti-fetchedGuilds');

export const fetchedGuilds = new Set<string>();

Object.defineProperty(globalThis, fetchedGuildsSymbol, {
	value: fetchedGuilds,
	writable: true,
	enumerable: false,
	configurable: false,
});
