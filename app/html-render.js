import { CanvasManager } from "/app/plugin/canvas/canvas-manager.js";

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
        // console.log(Object.keys(md.renderer.rules));
        const contentElement = document.getElementById("content");
        contentElement.innerHTML = newHtml;
        // script
        // let scripts = contentElement.getElementsByTagName("script");
        // Array.from(scripts).forEach(function (script) {
        //     let scriptElement = document.createElement("script");
        //     if(script.type) {
        //         scriptElement.type = script.type;
        //     }
        //     scriptElement.textContent = script.textContent || script.innerText || "";
        //     document.body.appendChild(scriptElement);
        //     // setTimeout(function () {
        //     //     document.body.removeChild(newScript);
        //     // }, 0);
        // });
        this.hash = newHash;
        this.pluginRender();
        return true;
    }
    pluginRender() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                console.log("HTML 内容渲染完成");
                CanvasManager.init(render);
            });
        });
    }
}
