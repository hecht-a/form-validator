export class Error {
    constructor(private _field: string, private _error: string) {
    }

    public get field() {
        return this._field
    }

    public get error() {
        return this._error
    }

    public toString() {
        return `${this.error.replace('{champ}', this.field)}`
    }

}