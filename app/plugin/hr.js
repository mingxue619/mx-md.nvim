window.markdownitHr = function (md) {
    const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
    const defaultFenceRenderer = md.renderer.rules.hr || proxy;

    md.renderer.rules.hr = function (tokens, idx, options, env, self) {
        let token = tokens[idx];
        debugger
        return defaultFenceRenderer(tokens, idx, options, env, self);
    };
};
