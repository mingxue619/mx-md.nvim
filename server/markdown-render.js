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
            .render(newContent);
        this.html = html;
        this.hash = newHash;
        bufferInfo.hash = this.hash;
        bufferInfo.html = this.html;
        return bufferInfo;
    }
}
