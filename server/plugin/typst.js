import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

class Compiler {
    static compiler;
    // https://myriad-dreamin.github.io/typst.ts/cookery/guide/all-in-one-node.html
    static svg(code) {
        if (!Compiler.compiler) {
            Compiler.compiler = NodeCompiler.create();
        } else {
            Compiler.compiler.evictCache(10);
        }

        return Compiler.compiler.svg({ mainFileContent: code });
    }
}
function typstWrapper(code) {
    return "#set page(width: auto, height: auto, margin: 5pt)\n" + "#set text(size: 18pt)\n" + code;
}
function svgWrapper(svg) {
    return '<div class="typst">\n' + svg + "\n</div>";
}

function markdownitTypst(md) {
    md.core.ruler.after("block", "typst", (state) => {
        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];

            if (token.type !== "fence") {
                continue;
            }

            const isTypst = token.info === "typst";

            if (!isTypst) {
                continue;
            }

            token.type = "typst";
        }
    });

    md.renderer.rules.typst = (tokens, idx, opts, env, self) => {
        debugger;
        const code = typstWrapper(tokens[idx].content);
        const svg = Compiler.svg(code);
        const result = svgWrapper(svg) + "\n";
        return result;
    };
}
export { markdownitTypst };
