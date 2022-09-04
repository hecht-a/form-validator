/**
 * @param {string} data
 * @return {boolean}
 */
export function required(data: string): boolean {
	return data !== "" && data !== null && data !== undefined && data !== " "
}