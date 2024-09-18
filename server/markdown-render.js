import markdownit from "markdown-it";

export default class MarkdownRender {
    constructor() {
        this.md = markdownit();
    }

    renderMarkdown(bufferInfo) {
        debugger;
        const lines = bufferInfo.lines;
        if (!lines) {
            bufferInfo.html = "";
            return bufferInfo;
        }
        const newContent = lines.join("\n");
        if (this.content != newContent) {
            const html = this.md.render(newContent);
            this.html = html;
        }
        bufferInfo.html = this.html;
        return bufferInfo;
    }
}
