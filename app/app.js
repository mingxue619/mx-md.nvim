// import { CanvasManager } from "/app/plugin/canvas/canvas-manager.js";
import { CursorScroll } from "/app/scroll.js";
import { HtmlRender } from "/app/html-render.js";
let render = new HtmlRender();
let cursorScroll = new CursorScroll();
// window.render = render;
// window.cursorScroll = cursorScroll;
let bufnr = getBufferNumber();
if (bufnr) {
    wsConnect(bufnr);
}
// CanvasManager.init(render);

// CanvasManager.onPaintingDrawFinish((painting) => {
//     cursorScroll.onCanvasInit(painting);
// });

function getBufferNumber() {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/page\/(\d+)/);
    if (match && match[1]) {
        const bufnr = match[1];
        return bufnr;
    } else {
        alert("url is error");
    }
}

function wsConnect(bufnr) {
    const host = window.location.host;
    const ws = new WebSocket("ws://" + host + "/md");
    ws.onopen = function () {
        console.log("Connected to the server");
        const data = {
            action: "Init",
            bufnr: bufnr,
        };
        let msg = JSON.stringify(data);
        ws.send(msg);
    };

    ws.onmessage = function (event) {
        // console.log(`Received from server: ${event.data}`);
        let data = event.data;
        let bufferInfo = JSON.parse(data);
        let action = bufferInfo.action;
        let cursorAction = ["CursorMoved", "CursorMovedI"];
        let contentAction = ["Init", "CursorHold", "BufWrite", "InsertLeave"];
        if (cursorAction.includes(action)) {
        } else if (contentAction.includes(action)) {
            let success = render.render(bufferInfo);
            if (!success) {
                return;
            }
        }
        cursorScroll.scrollTo(bufferInfo);
    };

    ws.onclose = function () {
        console.log("Disconnected from the server");
    };
}
