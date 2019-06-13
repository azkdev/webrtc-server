/*global socket, video, config*/
let peerConnection;

socket.on("offer", function(id, description) {
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(function() {
      socket.emit("answer", id, peerConnection.localDescription);
    });

  let videot;

  peerConnection.ontrack = event => {
    videot = document.createElement("video");
    videot.muted = true;
    videot.autoplay = true;
    videot.srcObject = event.streams[0];
    document.body.appendChild(videot);
    videot.play();
  };

  peerConnection.oniceconnectionstatechange = () => {
    if (peerConnection.iceConnectionState === "disconnected")
      document.body.removeChild(videot);
  };

  peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});

socket.on("candidate", function(id, candidate) {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("connect", function() {
  socket.emit("watcher");
});

socket.on("broadcaster", function() {
  socket.emit("watcher");
});

socket.on("record", data => {
  console.log(data.length);
});

socket.on("bye", function() {
  peerConnection.close();
});
