import { CanvasManager } from "/app/plugin/canvas/canvas-manager.js";
import { MermaidRender } from "/app/plugin/mermaid/mermaid-render.js";
import { GraphvizRender } from "/app/plugin/graphviz/graphviz-render.js";

export class HtmlRender {
    constructor() {
        this.hash = "";
    }
    render(bufferInfo) {
        this.bufferInfo = bufferInfo;
        const newHash = bufferInfo.hash;
        if (this.hash === newHash) {
            return;
        }
        //title
        const filePath = bufferInfo.name;
        const fileName = filePath.split("/").at(-1).split(".")[0];
        const pageTitle = bufferInfo.pageTitle;
        const title = pageTitle.replace("${name}", fileName);
        document.title = title;
        // html
        const html = bufferInfo.html;
        const newHtml = `<section>${html}</section>`;
        const contentElement = document.getElementById("content");
        contentElement.innerHTML = newHtml;
        this.hash = newHash;
        this.pluginRender(bufferInfo);
        return true;
    }
    pluginRender(bufferInfo) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                console.log("HTML 内容渲染完成");
                CanvasManager.init(bufferInfo);
                MermaidRender.init(bufferInfo);
                GraphvizRender.init(bufferInfo);
            });
        });
    }
}
