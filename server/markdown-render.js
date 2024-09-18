import markdownit from "markdown-it";
import { createHash } from 'crypto';

export default class MarkdownRender {
    constructor() {
        this.md = markdownit();
        this.hash = "";
        this.html = "";
    }

    renderMarkdown(bufferInfo) {
        debugger;
        const lines = bufferInfo.lines;
        const newContent = lines.join("\n");
        const md5 = createHash('md5');
        md5.update(newContent);
        const newHash = md5.digest('hex');

        if (this.hash != newHash) {
            const html = this.md.render(newContent);
            this.html = html;
            this.hash = newHash;
        }
        bufferInfo.hash = this.hash;
        bufferInfo.html = this.html;
        return bufferInfo;
    }
}
