function parseCanvasProps(info) {  
    info = info.replace(/^[^(]+\(|\);?$/g, '');
    const params = info.split(', ');

    const props = params.reduce((acc, param) => {
        const [key, value] = param.split('=');
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
    if(!element) {
        element = 'element';
    }
    return element;
}

function getAxes(props) {
    let axes = props.axes;
    if(!axes) {
        return false;
    }
    axes = axes.toLowerCase();
    if (axes === "false") {
        return false;
    }
    return true;
}
function getTheme(props) {
    return props.theme;
}
function removeComments(content) {
    return content.split('\n')
                .filter(line => !line.trim().startsWith('//'))
                .join('\n'); 
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
        let theme = getTheme(props);
        let showAxes = getAxes(props);
        let content = token.content || "";
        content = removeComments(content);
        debugger
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
                            (function() {
                                let errorElement = document.getElementById('${errorId}');  
                                let ${element} = document.getElementById("${id}");
                                try {
                                    new Theme(${element}).setTheme("${theme}");
                                    if(${showAxes}) {
                                        new Axes(${element}).draw();
                                    }
                                    const func = new Function('${element}', 'Figure', \`${content}\`);
                                    func(${element}, Figure);
                                } catch (error) {
                                    errorElement.style.display = "block";
                                    let code = document.createElement('code');  
                                    code.style.color = "red";
                                    code.textContent = error.stack;  
                                    let pre = document.createElement('pre');  
                                    pre.appendChild(code);  
                                    document.getElementById('${errorId}').appendChild(pre);
                                }
                            })();
                        </script>`;
        const html = tag + script;
        return html;
    };
}
export { markdownitCanvas };
