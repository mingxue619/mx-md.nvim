class HtmlRender {
    constructor() {
        this.hash = "";
    }
    render(bufferInfo) {
        this.bufferInfo = bufferInfo;
        const newHash = bufferInfo.hash;
        if (this.hash === newHash) {
            return;
        }
        const html = bufferInfo.html;
        const newHtml = `<section>${html}</section>`;
        // console.log(Object.keys(md.renderer.rules));
        const contentElement = document.getElementById("content");
        contentElement.innerHTML = newHtml;
        let scripts = contentElement.getElementsByTagName("script");
        Array.from(scripts).forEach(function (script) {
            let scriptElement = document.createElement("script");
            if(script.type) {
                scriptElement.type = script.type;
            }
            scriptElement.textContent = script.textContent || script.innerText || "";
            document.body.appendChild(scriptElement);
            // setTimeout(function () {
            //     document.body.removeChild(newScript);
            // }, 0);
        });
        this.hash = newHash;
        return true;
    }
}
