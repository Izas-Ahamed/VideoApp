var msgCtn = document.getElementById("message-container");
var msg = document.getElementById("message");
var videoCtn = document.getElementById("video-container");
var terminatebtn1 = document.getElementById("terminatebtn1");
var terminatebtn2 = document.getElementById("terminatebtn2");
var fidCtn = document.getElementById("fid-container");
var footer = document.getElementById("footer");
var incalctn = document.getElementById("incoming-call-container");
var sendmsg = document.getElementById("send-message");
var yourMsg = document.getElementById("your-msg");
var chatctn = document.getElementById("chat-container");
var idCtn = document.getElementById("id-container"); 
chatctn.style.display="none";
incalctn.style.display="none";
videoCtn.style.display = "none";
terminatebtn1.style.display = "none";
terminatebtn2.style.display = "none";
var ourId;

  const peer = new Peer();
  peerList = [];
  
  peer.on("open", (id) => {
    document.getElementById("our-id").value = id;
    ourId=id;

  });


  window.addEventListener("load", (event) => {
  document
    .getElementById("connect-video")
    .addEventListener("click", (event) => {
      let friendId = document.getElementById("friend-id").value;
      if (friendId == "" || ourId == friendId) {
        return;
      }
      document.getElementById("message").innerHTML = "Connecting : " + friendId;
      connectPeerVideo(friendId);
    });


    document
    .getElementById("connect-screen")
    .addEventListener("click", (event) => {
      let friendId = document.getElementById("friend-id").value;
      if (friendId == "" || ourId == friendId) {
        return;
      }
      document.getElementById("message").innerHTML = "Connecting : " + friendId;
      connectPeerScreen(friendId);
    });

  peer.on("call", (call) => {
  if(!peerList.includes(call.peer))
  {
    peerList.push(call.peer);

  }
  msg.style.display = "none";
  incalctn.style.display="block";
  terminatebtn1.style.display="block";
  document.getElementById("accept-video").addEventListener('click', event =>
  {
    navigator.mediaDevices.
    getUserMedia({ video: true, audio: true })
    .then( stream => {
      call.answer(stream);
      call.on("stream", (friendStream) => {
          chatctn.style.display="block";
          idCtn.style.display="none";
          videoCtn.style.display = "block";
          msgCtn.style.display = "none";
          fidCtn.style.display = "none";
          terminatebtn2.style.display = "block";
          peerList.push(call.peer);
          addPeerVideo(friendStream);
      });
    });
});
  
  document.getElementById("accept-screen").addEventListener('click', event =>
  {
    navigator.mediaDevices.getDisplayMedia(
      { video: {cursor: "always" },
        audio: {echoCancellation: true,noiseSuppression: true}
      }).then( stream =>
        {
        call.answer(stream);
        call.on("stream", (friendStream) => {
          videoCtn.style.display = "block";
          chatctn.style.display="block";
          idCtn.style.display="none";
          msgCtn.style.display = "none";
          fidCtn.style.display = "none";
          terminatebtn2.style.display = "block";
          peerList.push(call.peer);
          addPeerVideo(friendStream);
      
      });
        });
  })

  });

  peer.on("connection", function (conn) {
    conn.on("data", data => {
      if(data=="#terminate-process")
      {
        setEndProperties();
        document.getElementById("message").innerHTML = "User Disconnected !";
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
      else
      {
    document.getElementById("frnd-msg").textContent= data;
      }
    });
  });

  
  function connectPeerVideo(id) {
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then( (stream) => {
      let call = peer.call(id, stream);
      call.on("stream", (friendStream) => {
        if (!peerList.includes(call.peer)) {
          chatctn.style.display="block";
          idCtn.style.display="none";
          videoCtn.style.display = "block";
          msgCtn.style.display = "none";
          fidCtn.style.display = "none";
          terminatebtn1.style.display = "none";
          terminatebtn2.style.display = "block";
          peerList.push(call.peer);
          addPeerVideo(friendStream);
        }
      });
    });
  }


function connectPeerScreen(id)
  {

    navigator.mediaDevices.getDisplayMedia(
        { video: {cursor: "always" },
          audio: {echoCancellation: true,noiseSuppression: true}
        }).then(
        stream => {
            let call = peer.call(id, stream);
            call.on("stream", (friendStream) => {
              if (!peerList.includes(call.peer)) {
                incalctn.style.display="none";
                chatctn.style.display="block";
                idCtn.style.display="none";
                videoCtn.style.display = "block";
                msgCtn.style.display = "none";
                fidCtn.style.display = "none";
                terminatebtn1.style.display = "none";
                terminatebtn2.style.display = "block";
                peerList.push(call.peer);
                addPeerVideo(friendStream);
              }
            });

        });
    }

  function addPeerVideo(stream) {
    let video = document.createElement("video");
    video.classList.add("video");
    video.srcObject = stream;
    video.play();
    document.getElementById("video-container").append(video);
  }

  terminatebtn1.addEventListener("click", () => {
    var conn = peer.connect(peerList[0]);
    console.log("sdfdsf")
    conn.on("open", () => {
      conn.send("#terminate-process");
      setEndProperties();
      location.reload();
    });
  });

  terminatebtn2.addEventListener("click", () => {
    var conn = peer.connect(peerList[0]);
    conn.on("open", () => {
      conn.send("#terminate-process");
      setEndProperties();
      location.reload();
    });
  });
document.getElementById("sendingmsg").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendmsg.click();
  }
});
  sendmsg.addEventListener("click", () => {
    var conn = peer.connect(peerList[0]);
    var msg = document.getElementById("sendingmsg")
    conn.on("open", () => {
      conn.send(msg.value);
      yourMsg.textContent = msg.value;
      document.getElementById("sendingmsg").value=""
      });
  });

  function setEndProperties() {
    msgCtn.style.display = "block";
    videoCtn.style.display = "none";
    incalctn.style.display="none";
    terminatebtn1.style.display = "none";
    terminatebtn2.style.display = "none";
  }
});

function doCopy() {
  var copyText = document.getElementById("our-id");
  copyText.select();
  document.execCommand("copy");
}
if (window.isSecureContext) {
  // Page is a secure context so service workers are now available
  console.log("sd")
  // navigator.serviceWorker.register("/offline-worker.js").then(function () {
  // });
}
