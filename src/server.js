var io = require("socket.io")(process.env.PORT || 3000);
var ProtoBuf = require("protobufjs");
var path = require("path");

console.log("server started");
console.log(process.env.PORT);

var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "www", "SetAllianceStatus.proto")),
    Message = builder.build("com.goodgamestudios.ranch.controller.protobuf.alliance.management.setalliancestatus.Response");

var msg = new Message();
msg.status = 5;
msg.aState = 2; //marked as optional, but if not filled, throws an error

var bb = msg.encode();
var bufferString = String.fromCharCode.apply(null, new Uint8Array(bb.buffer));
console.log(bufferString);
var base64String = new Buffer(bufferString).toString('base64');
console.log(base64String);

var playerCount = 0;

io.on("connection", function (socket) {
    console.log("client connected, broadcastin spawn");

    socket.emit("proto", base64String);
    playerCount++;

    for (var i = 0; i < playerCount; i++) {
        socket.emit("spawn")
    }

    socket.on("move", function (data) {
        console.log("player move")
    });

    socket.on("disconnect", function (data) {
        console.log("client disconnected");
        playerCount--;
    });
});