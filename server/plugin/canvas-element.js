import * as acorn from "acorn";
//import * as walk from "acorn-walk";

function parseCanvasProps(info) {
    info = info.replace(/^[^(]+\(|\);?$/g, "");
    const params = info.split(", ");

    const props = params.reduce((acc, param) => {
        const [key, value] = param.split("=");
        acc[key.trim()] = value ? value.trim() : key.trim();
        return acc;
    }, {});

    return props;
}

function getId(props) {
    let id = props.id;
    if (!id) {
        id =
            "canvas-uuid-" +
            "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        props["id"] = id;
    }
    return id;
}

function getWidthAndHeight(props) {
    return Object.entries(props)
        .filter(([key, value]) => {
            return key === "width" || key === "height";
        })
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
}

function getElementName(props) {
    let element = props.element;
    if (!element) {
        element = "element";
    }
    return element;
}

function getPaintName(props) {
    let paint = props.paint;
    if (!paint) {
        paint = "paint";
    }
    return paint;
}

function getAxes(props) {
    let axes = props.axes;
    if (!axes) {
        return false;
    }
    axes = axes.toLowerCase();
    if (axes === "false") {
        return false;
    }
    return true;
}
function getTheme(props) {
    return props.dark || props.light || props.theme || "dynamic";
}
function getFocus(props) {
    return props.focus !== undefined ? props.focus : true;
}
// function removeComments(code) {
//     return code
//         .split("\n")
//         .filter((line) => !line.trim().startsWith("//"))
//         .join("\n");
// }
function parseVariable(code) {
    const variableRanges = new Map();
    try {
        const ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });
        // 遍历 AST
        ast.body.forEach((node) => {
            if (node.type === "VariableDeclaration") {
                node.declarations.forEach((declaration) => {
                    if (declaration.id.type === "Identifier") {
                        const variableName = declaration.id.name;
                        const startLine = declaration.loc.start.line;
                        const endLine = declaration.loc.end.line;
                        variableRanges.set(variableName, { startLine, endLine });
                    }
                });
            }
        });
    } catch (e) {
        console.error(e);
    }
    // walk.simple(ast, {
    //     VariableDeclaration(node) {
    //         node.declarations.forEach((declaration) => {
    //             if (declaration.id.type === "Identifier") {
    //                 const variableName = declaration.id.name;
    //                 const startLine = node.loc.start.line;
    //                 const endLine = node.loc.end.line;
    //                 variableRanges.set(variableName, { startLine, endLine });
    //             }
    //         });
    //     },
    // });
    return variableRanges;
}
function getCodeReturnLine(variableRanges) {
    const names = Array.from(variableRanges.keys()).join(",");
    return `return {${names}};`;
}
function getLineMap(variableRanges) {
    const entries = Array.from(variableRanges.entries())
        .map(([variableName, { startLine, endLine }]) => [endLine, variableName])
        .sort((a, b) => a[0] - b[0]);
    const object = Object.fromEntries(entries);
    const jsonString = JSON.stringify(object);
    return jsonString;
}

function markdownItCanvas(md) {
    md.core.ruler.after("block", "canvas", (state) => {
        for (let i = 0; i < state.tokens.length; i++) {
            const token = state.tokens[i];

            if (token.type !== "fence") {
                continue;
            }

            const isCanvas = token.info.startsWith("canvas");

            if (!isCanvas) {
                continue;
            }

            token.type = "canvas";
        }
    });

    const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
    const defaultFenceRenderer = md.renderer.rules.fence || proxy;

    md.renderer.rules.canvas = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = token.info;
        const props = parseCanvasProps(info);
        const id = getId(props);
        const errorId = "error-" + id;
        const widthAndHeight = getWidthAndHeight(props);
        const element = getElementName(props);
        const paint = getPaintName(props);
        const theme = getTheme(props);
        const focus = getFocus(props);
        const axes = getAxes(props);
        let code = token.content || "";
        const variables = parseVariable(code);
        const lineMap = getLineMap(variables);
        const codeReturnLine = getCodeReturnLine(variables);
        // code = removeComments(code);
        code = code + codeReturnLine;
        code = encodeURIComponent(code);
        // let canvasProps = Object.entries(props)
        //     .map(([k, v]) => `${k}="${v}"`)
        //     .join(" ");
        debugger;
        const html = `
                    <canvas class="canvas" id="${id}" ${widthAndHeight} 
                        data-element="${element}" 
                        data-paint="${paint}" 
                        data-theme="${theme}" 
                        data-focus="${focus}" 
                        data-axes="${axes}" 
                        data-line-map="${lineMap}" 
                        data-code="${code}" 
                    >
                        browser not support canvas
                    </canvas>
                    <div id="${errorId}" style="display: none"></div>
                    `;
        return html;
    };
}
export { markdownItCanvas };
