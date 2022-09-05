import remove from "rollup-plugin-delete";
import {resolve} from "node:path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: resolve("src", "Validator/index.ts"),
        plugins: [
            remove({targets: resolve("lib", "*")}),
            typescript(),
            terser()
        ],
        output: {
            file: resolve("lib", "Validator/index.js"),
            format: "cjs"
        }
    },
    {
        input: resolve("src", "Error/index.ts"),
        plugins: [
            remove({targets: resolve("lib", "*")}),
            typescript(),
            terser()
        ],
        output: {
            file: resolve("lib", "Error/index.js.js"),
            format: "cjs"
        }
    },
    {
        input: resolve("src", "index.ts"),
        plugins: [
            remove({targets: resolve("lib", "*")}),
            typescript(),
            terser()
        ],
        output: {
            file: resolve("lib", "index.js"),
            format: "cjs"
        }
    }
];