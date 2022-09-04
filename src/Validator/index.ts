import {CallableRule, Rules} from "../types"
import {Error} from '../Error'

export class Validator {
    private _rules: Rules = {}
    private _rulesMapping: Record<string, string[]> = {}
    private _errors: Record<string, Error[]>;

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
     * Add a custom rule to the validator
     * @param name
     * @param rule
     * @param optionalParams
     */
    addRule(name: string, rule: CallableRule, ...optionalParams: unknown[]) {
        this._rules[name] = {cb: rule, optionalParams}

        return this
    }

    /**
     * Check the form validity
     */
    validate() {
        for (const field in this._rulesMapping) {
            this._rulesMapping[field].forEach((cbName) => {
                const value = this.form.get(field)
                if (!value) {
                    return
                }

                const rule = this.rules[cbName]
                if (rule.optionalParams && rule.optionalParams.length > 0) {
                    console.log(cbName, rule.cb(value.toString(), ...rule.optionalParams))
                } else {
                    console.log(cbName, rule.cb(value.toString()))
                }
            })
        }
    }

    /**
     * Set rule for a form field
     * @param input
     * @param rule
     */
    setRules(input: string, rule: string | string[]) {
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