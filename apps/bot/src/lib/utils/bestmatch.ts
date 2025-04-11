import { jaroWinkler } from '@skyra/jaro-winkler';

export const sortByDistance = (query: string, targetStrings: string[]): Entry[] => {
	const options = targetStrings.map((target, i) => ({
		target,
		distance: jaroWinkler(query, target),
		index: i,
	}));
	return options.sort((a, b) => b.distance - a.distance);
};

export const findBestMatch = (query: string, targetStrings: string[]) => {
	return sortByDistance(query, targetStrings)[0];
};

export interface Entry {
	distance: number;
	index: number;
	target: string;
}
