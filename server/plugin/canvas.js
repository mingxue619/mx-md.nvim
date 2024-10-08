//import { acorn } from "acorn";
//import { walk } from "acorn-walk";
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

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
            "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        props["id"] = id;
    }
    return id;
}

function getElementName(props) {
    let element = props.element;
    if (!element) {
        element = "element";
    }
    return element;
}

function getFigureName(props) {
    let figure = props.figure;
    if (!figure) {
        figure = "figure";
    }
    return figure;
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
function removeComments(content) {
    return content
        .split("\n")
        .filter((line) => !line.trim().startsWith("//"))
        .join("\n");
}
function parseVariable(content) {
    const ast = acorn.parse(content, { ecmaVersion: 2020, locations: true });
    const variableRanges = new Map();
    // 遍历 AST
    walk.simple(ast, {
        VariableDeclaration(node) {
            node.declarations.forEach((declaration) => {
                if (declaration.id.type === "Identifier") {
                    const variableName = declaration.id.name;
                    const startLine = node.loc.start.line;
                    const endLine = node.loc.end.line;
                    variableRanges.set(variableName, { startLine, endLine });
                }
            });
        },
    });

    return variableRanges;
}
function getContentReturnLine(variableRanges) {
    const names = Array.from(variableRanges.keys()).join(",");
    return `return {${names}};`;
}

function markdownitCanvas(md) {
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

    md.renderer.rules.canvas = function (tokens, idx, options, env, self) {
        let token = tokens[idx];
        let info = token.info;
        let props = parseCanvasProps(info);
        let id = getId(props);
        let errorId = "error-" + id;
        let element = getElementName(props);
        let figure = getFigureName(props);
        let theme = getTheme(props);
        let showAxes = getAxes(props);
        let content = token.content || "";
        content = removeComments(content);
        const variables = parseVariable(content);
        const contentReturnLine = getContentReturnLine(variables);
        content = content + contentReturnLine;
        debugger;
        let canvasProps = Object.entries(props)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");
        const tag = `
                    <canvas class="canvas" ${canvasProps}>
                        browser not support canvas
                    </canvas>
                    <div id="${errorId}" style="display: none"></div>
                    `;
        const script = `
                        <script type="module">
                            import { Figure } from '/app/plugin/canvas/canvas-figure.js';
                            let errorElement = document.getElementById('${errorId}');  
                            let ${element} = document.getElementById("${id}");
                            const ${figure} = new Figure(${element});
                            function drawAxesAndFigure() {
                                try {
                                    if(${showAxes}) {
                                        new Axes(${element}).draw();
                                    }
                                    const func = new Function('${element}', 'Figure', '${figure}', \`${content}\`);
                                    const result = func(${element}, Figure, ${figure});
                                    let canvas = window.canvas || new Map();
                                    canvas.set("${id}", {
                                        id: "${id}",
                                        element: ${element},
                                        map: [${token.map}],
                                        figures: result
                                    });
                                    window.canvas = canvas;
                                } catch (error) {
                                    errorElement.style.display = "block";
                                    let code = document.createElement('code');  
                                    code.style.color = "red";
                                    code.textContent = error.stack;  
                                    let pre = document.createElement('pre');  
                                    pre.appendChild(code);  
                                    document.getElementById('${errorId}').appendChild(pre);
                                };
                            }
                            new Theme(${element}).setTheme("${theme}");
                            drawAxesAndFigure();

                            window.addEventListener("beforeprint", () => {
                                if("${theme}" === "dynamic" && window.theme === "dark") {
                                    new Theme(${element}).setTheme("beforeprint");
                                    drawAxesAndFigure();
                                }
                            });
                            
                            window.addEventListener("afterprint", () => {
                                if("${theme}" === "dynamic" && window.theme === "dark") {
                                    new Theme(${element}).setTheme("afterprint");
                                    drawAxesAndFigure();
                                }
                            });
                        </script>`;
        const html = tag + script;
        return html;
    };
}
export { markdownitCanvas };
