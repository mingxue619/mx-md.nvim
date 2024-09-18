import PageWebSocket from "./page-websocket.js";
import Nvim from "./nvim.js";
import HttpServer from "./http-server.js";

const servername = process.argv[2];

// import { attach } from "neovim";
// let nvim = attach({
//     socket: servername,
// });
// nvim.command("vsp");

const httpServer = HttpServer.createServer();
const pws = new PageWebSocket(httpServer);
const nvim = new Nvim(servername);
pws.setupListeners(nvim);
nvim.setupListeners(pws);

let port = await nvim.getPort()
httpServer.listen(port, async () => {
    const msg = `Server is running on http://localhost:${port}`;
    console.log(msg);
    // await nvim.print(msg);
});
