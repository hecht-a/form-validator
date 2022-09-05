import {CallableRule, Rules} from "../types"
import {Error} from '../Error'

export class Validator {
    private _rules: Rules = {}
    private _rulesMapping: Record<string, string[]> = {}
    private _errors: Record<string, string[]> = {};
    private _errorMessages: Record<string, string> = {};

    constructor(private form: FormData) {
    }

    /**
     * Return the rules
     */
    get rules() {
        return this._rules
    }

    /**
     * Return the errors
     */
    public get errors() {
        return this._errors
    }

    /**
     * Init error messages with an object
     * The key is the form field, the value is the message
     * @param {Record<string, string>} errorMessages
     */
    public initErrorMessages(errorMessages: Record<string, string>) {
        this._errorMessages = errorMessages
    }

    /**
     * Add a custom rule to the validator
     * @param {string} name
     * @param {CallableRule} rule
     * @param {unknown[]} optionalParams
     */
    public addRule(name: string, rule: CallableRule, ...optionalParams: unknown[]) {
        this._rules[name] = {cb: rule, optionalParams}

        return this
    }

    /**
     * Add an error for the specified field
     * @param {string} field
     * @param {string} errorMessage
     */
    public addError(field: string, errorMessage: string) {
        if(!this._errors[field] || this._errors[field].length < 0) {
            this._errors[field] = []
        }
        this._errors[field].push(new Error(field, errorMessage).toString())
    }

    /**
     * @param {string} cbName
     * @param {string} field
     * @param {string} fieldValue
     * @private
     */
    private runValidator(cbName: string, field: string, fieldValue: any): void {
        const rule = this.rules[cbName]

        if(rule.cb(fieldValue, ...rule.optionalParams ?? [])) {
            this.addError(field, this._errorMessages[cbName])
        }
    }

    /**
     * Check the form validity
     */
    public validate(): void {
        for (const field in this._rulesMapping) {
            this._rulesMapping[field].forEach((cbName) => {
                const fieldValue = this.form.get(field)

                this.runValidator(cbName, field, fieldValue)
            })
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
                this.setRules(input, r)
            })
        }

        const rulesField = this._rulesMapping[input]

        if (rulesField) {
            rulesField.push(rule)
            return
        }

        this._rulesMapping[input] = [rule]
    }
}