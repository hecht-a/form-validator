declare namespace validator {
    export type CallableRule = ((data: string, ...args: unknown[]) => boolean);
    export type Rule = {
        cb: CallableRule;
        optionalParams?: unknown[];
    };
    export type Rules = Record<string, Rule>;
    export type DataToValidate = {
        [field: string]: keyof Rules[];
    };

    export class Validator {
        private form;
        private _rules;
        private _rulesMapping;
        constructor(form: FormData);
        /**
         * Return the rules
         */
        get rules(): Rules;
        /**
         * Add a custom rule to the validator
         * @param name
         * @param rule
         * @param optionalParams
         */
        addRule(name: string, rule: CallableRule, ...optionalParams: unknown[]): this;
        /**
         * Check the form validity
         */
        validate(): void;
        /**
         * Set rule for a form field
         * @param input
         * @param rule
         */
        setRules(input: string, rule: string | string[]): void;
    }
}

declare namespace rules {
    /**
     * @param {string} data
     * @return {boolean}
     */
    export function required(data: string): boolean;
    /**
     * @param {string} data
     * @param {number} length
     */
    export function length(data: string, length: number): boolean;
}