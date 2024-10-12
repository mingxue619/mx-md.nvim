import { Paint } from "/app/plugin/canvas/canvas-paint.js";
import { CanvasManager } from "/app/plugin/canvas/canvas-manager.js";
import { CursorScroll } from "/app/scroll.js";
import { CanvasScroll, CurrentFocusCanvas } from "/app/scroll-canvas.js";
import { HtmlRender } from "/app/html-render.js";
let render = new HtmlRender();
let cursorScroll = new CursorScroll();
window.render = render;
window.cursorScroll = cursorScroll;
let bufnr = getBufferNumber();
if (bufnr) {
    wsConnect(bufnr);
}

// 防抖函数
function debounce(wait, func) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

CanvasManager.onPaintingDrawFinish((painting) => {
    debugger
    // requestAnimationFrame
    CurrentFocusCanvas.unFocus();
    cursorScroll.scrollToCanvas();
    const element = painting.element;

    const debouncedHandler = debounce(100, function (event) {
        // 获取鼠标位置
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const mouse = [x, y];
        CanvasScroll.onMouseMove(painting, mouse);
    });
    element.addEventListener("mousemove", debouncedHandler);
});

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

// function wsConnect(bufnr) {
//     // const host = window.location.host;
//     // const ws = new WebSocket("ws://" + host);
//     const socket = io();
//     socket.on("connect", function () {
//         console.log("Connected to server");
//         const data = {
//             bufnr: bufnr,
//         };
//         let msg = JSON.stringify(data);
//         socket.emit("init", msg);
//     });
//
//     socket.on("refresh-content", function (msg) {
//         console.log("received message: " + msg);
//     });
// }
