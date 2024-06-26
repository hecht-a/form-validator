type CallableRule = ((data: string, ...args: unknown[]) => boolean | Promise<boolean>);

type Rule = {
	cb: CallableRule,
	optionalParams?: unknown[]
};

type Rules = Record<string, Rule>;

class Error {
	constructor(private _field: string, private _error: string) {
	}

	public get field(): string {
		return this._field;
	}

	public get error(): string {
		return this._error;
	}

	public toString(): string {
		if (!this.error.includes("{champ}")) {
			return this.error;
		}

		return `${this.error.replace("{champ}", this.field)}`;
	}
}

export class Validator {
	private _rules: Rules = {};

	private _rulesMapping: Record<string, string[]> = {};

	private _errors: Record<string, string[]> = {};

	private _errorMessages: Record<string, string> = {};

	constructor(private form: FormData) {
	}

	/**
     * Return the rules
     */
	get rules(): Rules {
		return this._rules;
	}

	/**
     * Return the errors
     */
	public get errors(): Record<string, string[]> {
		return this._errors;
	}

	public get errorMessage(): Record<string, string> {
		return this._errorMessages;
	}

	/**
     * Init error messages with an object
     * The key is the form field, the value is the message
     * @param {Record<string, string>} errorMessages
     */
	public initErrorMessages(errorMessages: Record<string, string>): void {
		this._errorMessages = errorMessages;
	}

	/**
     * Add a custom rule to the validator
     * @param {string} name
     * @param {CallableRule} rule
     * @param {unknown[]} optionalParams
     */
	public addRule(name: string, rule: CallableRule, ...optionalParams: unknown[]): Validator {
		this._rules[name] = { cb: rule, optionalParams };

		return this;
	}

	/**
     * Add an error for the specified field
     * @param {string} field
     * @param {string} errorMessage
     */
	public addError(field: string, errorMessage: string): void {
		if (!this._errors[field] || this._errors[field].length < 0) {
			this._errors[field] = [];
		}
		this._errors[field].push(new Error(field, errorMessage).toString());
	}

	/**
     * @param {string} cbName
     * @param {string} field
     * @param {string} fieldValue
     * @private
     */
	private async runValidator(cbName: string, field: string, fieldValue: string): Promise<void> {
		const rule = this.rules[cbName];

		if (await rule.cb(fieldValue, ...rule.optionalParams ?? [])) {
			this.addError(field, this._errorMessages[cbName]);
		}
	}

	/**
     * Check the form validity
     */
	public async validate(): Promise<void> {
		for (const field in this._rulesMapping) {
			for (const cbName of this._rulesMapping[field]) {
				const fieldValue = this.form.get(field);

				await this.runValidator(cbName, field, fieldValue
					? fieldValue.toString()
					: "");
			}
		}
	}

	/**
     * Set rule for a form field
     * @param {string} input
     * @param {string|string[]} rule
     */
	public setRules(input: string, rule: string | string[]): void {
		if (Array.isArray(rule)) {
			return rule.forEach((r) => {
				this.setRules(input, r);
			});
		}

		const rulesField = this._rulesMapping[input];

		if (rulesField) {
			rulesField.push(rule);
			return;
		}

		this._rulesMapping[input] = [rule];
	}
}

export default Validator;
