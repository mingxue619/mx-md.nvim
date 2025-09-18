import markdownit from "markdown-it";
import hljs from "highlight.js"; // https://highlightjs.org
import { createHash } from "crypto";
import markdownitInjectLinenumbers from "markdown-it-inject-linenumbers";
// import MarkdownItTypst from "markdown-it-typst";
import markdownItMultimdTable from "markdown-it-multimd-table";
import { markdownItCanvas } from "./plugin/canvas-element.js";
import { markdownItMermaid } from "./plugin/mermaid-element.js";
import { markdownItGraphviz } from "./plugin/graphviz-element.js";
import { markdownItHr } from "./plugin/hr.js";
import { markdownItTypst } from "./plugin/typst.js";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-toc-done-right";

const anchorSymbol =
    '<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>';

export default class MarkdownRender {
    constructor() {
        const md = markdownit({
            html: true,
            xhtmlOut: true,
            breaks: false,
            langPrefix: "language-",
            linkify: true,
            typographer: true,
            quotes: "“”‘’",
            linkify: false,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return '<pre><code class="hljs">' + hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + "</code></pre>";
                    } catch (__) {}
                }

                return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
            },
        });
        this.md = md;
        this.hash = "";
        this.html = "";
    }

    renderMarkdown(bufferInfo) {
        const lines = bufferInfo.lines;
        const newContent = lines.join("\n");
        const md5 = createHash("md5");
        md5.update(newContent);
        const newHash = md5.digest("hex");

        if (this.hash === newHash) {
            bufferInfo.hash = this.hash;
            bufferInfo.html = this.html;
            return bufferInfo;
        }
        const html = this.md
            .use(markdownItCanvas)
            .use(markdownItMermaid)
            .use(markdownItGraphviz)
            .use(markdownItHr)
            // .use(window.markdownitSub)
            // .use(window.markdownitSup)
            .use(markdownItTypst)
            .use(markdownItMultimdTable, {
                multiline: false,
                rowspan: false,
                headerless: false,
                multibody: true,
                autolabel: true,
            })
            .use(markdownitInjectLinenumbers)
            .use(markdownItAnchor, {
                permalink: true,
                permalinkBefore: true,
                permalinkSymbol: anchorSymbol,
                permalinkClass: "anchor",
            })
            .use(markdownItToc, {
                listType: "ul",
            })
            .render(newContent);
        this.html = html;
        this.hash = newHash;
        bufferInfo.hash = this.hash;
        bufferInfo.html = this.html;
        return bufferInfo;
    }
}
