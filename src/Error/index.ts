export class Error {
	constructor(private _field: string, private _error: string) {
	}

	public get field(): string {
		return this._field;
	}

	public get error(): string {
		return this._error;
	}

	public toString(): string {
		return `${this.error.replace("{champ}", this.field)}`;
	}
}
