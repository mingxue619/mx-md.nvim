let bufnr = getBufferNumber();
if (bufnr) {
    wsConnect(bufnr);
}

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
            action: "init",
            bufnr: bufnr,
        };
        let msg = JSON.stringify(data);
        ws.send(msg);
    };

    ws.onmessage = function (event) {
        console.log(`Received from server: ${event.data}`);
        let data = event.data;
        let bufferInfo = JSON.parse(data);
        debugger;
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
//         debugger
//         console.log("Connected to server");
//         const data = {
//             bufnr: bufnr,
//         };
//         let msg = JSON.stringify(data);
//         socket.emit("init", msg);
//     });
//
//     socket.on("refresh-content", function (msg) {
//         debugger
//         console.log("received message: " + msg);
//     });
// }
