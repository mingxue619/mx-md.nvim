function getAttributes(info) {
    const attributes = {};
    const canvasRegex = /canvas\(([^)]+)\)/;
    const match = info.match(canvasRegex);
    if (match && match[1]) {
        const attributesString = match[1];
        const attributePairs = attributesString.split(",");
        attributePairs.forEach((pair) => {
            const [key, value] = pair.trim().split("=");
            attributes[key.trim()] = value.replace(/^['"]|['"]$/g, "");
        });
    }
    return attributes;
}
function getId(attributes) {
    let id = attributes.id;
    if (!id) {
        id =
            "canvas-uuid-" +
            "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        attributes["id"] = id;
    }
    return id;
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
        let attributes = getAttributes(info);
        let id = getId(attributes);
        let errorId = "error-" + id;
        let context = attributes.context || "2d";
        let content = token.content || "";
        let canvasAttribute = Object.entries(attributes)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ");
        const tag = `
                    <canvas class="canvas" ${canvasAttribute}>
                        browser not support canvas
                    </canvas>
                    <div id="${errorId}" style="display: none"></div>
                    `;
        const script = `
                        <script>
                            (function() {
                                // debugger;
                                let errorElement = document.getElementById('${errorId}');  
                                let element = document.getElementById("${id}");
                                try {
                                    // if (element.getContext) {
                                    //     let ctx = element.getContext("${context}");
                                    //     ctx.clearRect(0, 0, element.width, element.height);
                                    // };
                                    ${content}
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
