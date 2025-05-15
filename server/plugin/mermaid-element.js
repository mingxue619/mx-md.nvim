import mermaid from "mermaid";

const mermaidChart = (code) => {
    try {
        mermaid.parse(code);
        const tag = `<div class="mermaid">${code}</div>`;
        const script = `
                        <script>
                            const theme = "default";
                            const ganttAxisFormat = "%Y-%m-%d";
                            mermaid.initialize({
                                theme: theme,
                                gantt: {
                                    axisFormatter: [
                                        [
                                            ganttAxisFormat,
                                            (d) => {
                                                return d.getDay() === 1;
                                            },
                                        ],
                                    ],
                                },
                            });
                        </script>`;
        const html = tag + script;
        return html;
    } catch ({ str, hash }) {
        return `<pre>${str}</pre>`;
    }
};

const markdownItMermaid = (md) => {
    const temp = md.renderer.rules.fence.bind(md.renderer.rules);
    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        const code = token.content || "";
        if (token.info === "mermaid") {
            return mermaidChart(code);
        }
        return temp(tokens, idx, options, env, slf);
    };
};

// export default markdownItMermaid

export { markdownItMermaid };
