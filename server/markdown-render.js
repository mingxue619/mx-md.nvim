import markdownit from "markdown-it";
import hljs from "highlight.js"; // https://highlightjs.org
import { createHash } from "crypto";
import { markdownitCanvas } from "./plugin/canvas.js";

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
        debugger;
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
            .use(markdownitCanvas)
            // .use(window.markdownitHr)
            // .use(window.markdownitSub)
            // .use(window.markdownitSup)
            // .use(window.markdownitInjectLinenumbers)
            .render(newContent);
        this.html = html;
        this.hash = newHash;
        bufferInfo.hash = this.hash;
        bufferInfo.html = this.html;
        return bufferInfo;
    }
}
