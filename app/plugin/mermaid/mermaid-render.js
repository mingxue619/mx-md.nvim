// https://mermaid.js.org/config/usage.html
// import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import mermaid from '/node_modules/mermaid/dist/mermaid.esm.min.mjs';

export class MermaidRender {
    static async init() {
        // debugger
        mermaid.initialize({ startOnLoad: false });
        await mermaid.run({
          nodes: document.querySelectorAll('.mermaid'),
        });
    }
}
