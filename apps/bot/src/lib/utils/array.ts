export function chunkSafe<T>(arr: T[], step: number): T[][] {
	const res: T[][] = [];
	for (let i = 0; i < arr.length; i += step) {
		res.push(arr.slice(i, i + step));
	}

	return res;
}

export function shuffle<T>(a: T[]): T[] {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}

	return a;
}

export function splitArray<T>(array: T[], size: number) {
	const result = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}

	return result;
}
