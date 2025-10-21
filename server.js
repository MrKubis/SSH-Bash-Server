const express = require("express"); 
const {WebSocket,WebSocketServer} = require("ws")
const pty = require("node-pty")

const shell = process.platform === "win32" ? "powershell.exe" : "bash";
const term =  pty.spawn(shell,[],{
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});

const app = express();

const server = app.listen(3000, () => {
    console.log("Listening on port: 3000");
})

const wss = new WebSocketServer({server:server});
wss.on('connection', function(ws,req){
    term.onData((data) =>{
        ws.send(data);
    })
    ws.on('open', function open(){
            console.log("Connected");
    ws.send("sup");
    })
    ws.on('message',(message) => {
        console.log("meesseg");
        term.write(message)
    });
    ws.on("close", ()=>{
        term.kill();
    })
})
