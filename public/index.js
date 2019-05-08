/*global io*/
/** @type {RTCConfiguration} */
const config = {
  // eslint-disable-line no-unused-vars
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const socket = io.connect(window.location.origin);

window.onunload = window.onbeforeunload = function() {
  socket.close();
};
