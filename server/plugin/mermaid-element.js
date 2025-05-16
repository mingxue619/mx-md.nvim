const mermaidChart = (code) => {
    return `<div class="mermaid">${code}</div>`;
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
