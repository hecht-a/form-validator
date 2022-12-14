import remove from "rollup-plugin-delete";
import {resolve} from "node:path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
    input: resolve("src", "Validator.ts"),
    plugins: [
        remove({targets: resolve("lib", "*")}),
        typescript(),
        terser()
    ],
    output: {
        file: resolve("lib", "Validator.js"),
        format: "cjs"
    }
}