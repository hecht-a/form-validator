export type CallableRule = ((data: string, ...args: unknown[]) => boolean)

export type Rule = {
	cb: CallableRule,
	optionalParams?: unknown[]
}

export type Rules = Record<string, Rule>

export type DataToValidate = {
	[field: string]: keyof Rules[]
}