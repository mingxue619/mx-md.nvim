import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

class Typst {
    static compiler;
    // https://myriad-dreamin.github.io/typst.ts/cookery/guide/all-in-one-node.html
    static instance() {
        if (!Typst.compiler) {
            Typst.compiler = NodeCompiler.create();
        } else {
            Typst.compiler.evictCache(10);
        }
    }

    static compile(code) {
        Typst.instance();
        return Typst.compiler.compile({ mainFileContent: code });
    }

    static svg(code) {
        Typst.instance();
        return Typst.compiler.svg({ mainFileContent: code });
    }

    static plainSvg(code) {
        Typst.instance();
        return Typst.compiler.plainSvg({ mainFileContent: code });
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
        const code = typstWrapper(tokens[idx].content);
        try {
            const svg = Typst.svg(code);
            const result = svgWrapper(svg) + "\n";
            return result;
        } catch (error) {
            const errorMessage = JSON.stringify(error);
            const compile = Typst.compile(code);
            const diagnostics = compile.takeDiagnostics();
            if (diagnostics && diagnostics.compilationStatus === "error") {
                const shortDiagnostics = diagnostics.shortDiagnostics;
                const len = shortDiagnostics.length;
                const diagnoseMessage = JSON.stringify(shortDiagnostics);
                const diagnoseResult = `<pre><code style="color: red;">error::<br>${errorMessage} <br><br>diagnose:: ${len} compiler error<br>${diagnoseMessage}</code></pre>`;
                return diagnoseResult;
            } else {
                const errorResult = `<pre><code style="color: red;">error::<br>${errorMessage}</code></pre>`;
                return errorResult;
            }
        }
    };
}
export { markdownitTypst };
