const markdownItGraphviz = (md) => {
    const temp = md.renderer.rules.fence.bind(md.renderer.rules);
    md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        const code = token.content || "";
        if (token.info && (token.info.trim() === "dot" || token.info.trim() === "graphviz")) {
            return `<div class="dot">${code}</div>`;
        }
        return temp(tokens, idx, options, env, slf);
    };
};

export { markdownItGraphviz };
