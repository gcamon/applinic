var PeerManager = (function (name) {
    this.name = name;
    var localId,
      config = {
        peerConnectionConfig: {
          iceServers: [
            /*{
              "url": "turn:45.55.203.165:3478?transport=udp",             
              "username": "applinicvideo",
              "credential": "zajawekihascome",
            },
            {
              "url": "turn:45.55.203.165:3478?transport=tcp",             
              "username": "applinicvideo",
              "credential": "zajawekihascome",
            },*/
            {"url":"stun:ws-turn2.xirsys.com"},{"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=",
            "url":"turn:ws-turn2.xirsys.com:80?transport=udp","credential":"52d776ca-89a1-11ea-beac-a695319b0c25"},
            {"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=","url":"turn:ws-turn2.xirsys.com:3478?transport=udp",
            "credential":"52d776ca-89a1-11ea-beac-a695319b0c25"},{"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=",
            "url":"turn:ws-turn2.xirsys.com:80?transport=tcp","credential":"52d776ca-89a1-11ea-beac-a695319b0c25"},
            {"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=",
            "url":"turn:ws-turn2.xirsys.com:3478?transport=tcp","credential":"52d776ca-89a1-11ea-beac-a695319b0c25"},
            {"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=","url":"turns:ws-turn2.xirsys.com:443?transport=tcp",
            "credential":"52d776ca-89a1-11ea-beac-a695319b0c25"},{"username":"AXZLBbcKAV94V-3shmJu5LR86GsIxsFRI9v_7wMtLnhOdrtIHze_sRv3BXDFsYdKAAAAAF6osPhnY2Ftb24=",
            "url":"turns:ws-turn2.xirsys.com:5349?transport=tcp","credential":"52d776ca-89a1-11ea-beac-a695319b0c25"}
          ]
        },
        peerConnectionConstraints: {
          optional: [
            {"DtlsSrtpKeyAgreement": true}
          ]
        }
      },
      peerDatabase = {},
      localStream,
      remoteVideoContainer = document.getElementById('remoteVideosContainer'),
      socket = io();

      var storage = window.localStorage.getItem("resolveUser");
      var user = JSON.parse(storage);
      
  socket.on('message', handleMessage);

  socket.on('id', function(id) {
    localId = id;
  });

  /*
{"v":{"iceServers":[{"url":"stun:w3.xirsys.com"},
{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turn:w3.xirsys.com:80?transport=udp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"},

{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turn:w3.xirsys.com:3478?transport=udp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"},

{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turn:w3.xirsys.com:80?transport=tcp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"},

{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turn:w3.xirsys.com:3478?transport=tcp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"},

{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turns:w3.xirsys.com:443?transport=tcp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"},

{"username":"d9e8091c-2e0a-11e8-b899-820ee5d51a5e",
"url":"turns:w3.xirsys.com:5349?transport=tcp",
"credential":"d9e80994-2e0a-11e8-a497-b30dd1ef5383"}]}
  */

  //if peer does not exist yet, this function will create peer below otherwise peer will be retreived fron 'peerDatabase' where existin
  //peer are kept. The remark where this happened in "jj".
  function addPeer(remoteId,name) {
    var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints, name);
    peer.pc.onicecandidate = function(event) {
      if (event.candidate) {
        send('candidate', remoteId, {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };
    
    peer.pc.onaddstream = function(event) {
      attachMediaStream(peer.remoteVideoEl, event.stream);
      peer.videoDiv.appendChild(peer.captionElement);
      peer.videoDiv.appendChild(peer.remoteVideoEl);
      remoteVideosContainer.appendChild(peer.videoDiv);
      //remoteVideosContainer.appendChild(peer.remoteVideoEl);
    };

    peer.pc.onremovestream = function(event) {
      peer.remoteVideoEl.src = '';
      remoteVideosContainer.removeChild(peer.remoteVideoEl);
    };

    peer.pc.oniceconnectionstatechange = function(event) {
      switch(
      (  event.srcElement // Chrome
      || event.target   ) // Firefox
      .iceConnectionState) {
        case 'disconnected':
          remoteVideosContainer.removeChild(peer.videoDiv);
          var btn = document.getElementById(remoteId);
          btn.style.display = "none";
          break;
      }
    };

    peerDatabase[remoteId] = peer;
    //peerDatabase[remoteId]['name'] = name;
        
    return peer;
  }

  function answer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createAnswer(
      function(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('answer', remoteId, sessionDescription);
      }, 
      error
    );
  }

  function offer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createOffer(
      function(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('offer', remoteId, sessionDescription);
      }, 
      error
    );
  }

  function handleMessage(message) {
    var type = message.type,
        from = message.from,
        pc = (peerDatabase[from] || addPeer(from)).pc;

    console.log('received ' + type + ' from ' + from);
  
    switch (type) {
      case 'init':
        toggleLocalStream(pc);
        offer(from);
        break;
      case 'offer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
        answer(from);
        break;
      case 'answer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
        break;
      case 'candidate':
        if(pc.remoteDescription) {
          pc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: message.payload.label,
            sdpMid: message.payload.id,
            candidate: message.payload.candidate
          }), function(){}, error);
        }
        break;
    }
  }

  function send(type, to, payload,name) {
    console.log('sending ' + type + ' to ' + to);

    socket.emit('message', {
      to: to,
      type: type,
      payload: payload
    },function(response){
      if(!response.status)
        alert("Oops! this " + name + " channel has no signal. Please try again.");
    });
  }

  function toggleLocalStream(pc) {
    if(localStream) {
      (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
    }
  }

  function error(err){
    console.log(err);
  }

  return {
    name : name,
    getId: function() {
      return localId;
    },
    
    setLocalStream: function(stream) {
      // if local cam has been stopped, remove it from all outgoing streams.
      if(!stream) {
        for(id in peerDatabase) {
          pc = peerDatabase[id].pc;
          if(!!pc.getLocalStreams().length) {
            pc.removeStream(localStream);
            offer(id);
          }
        }
      }
      
      localStream = stream;
    }, 

    toggleLocalStream: function(remoteId) {
      peer = peerDatabase[remoteId] || addPeer(remoteId); //"jj"
      toggleLocalStream(peer.pc);
    },
    
    peerInit: function(remoteId,name) {

      if(peerDatabase[remoteId]) {
        peerDatabase[remoteId].captionElement.innerHTML = name;
        //peerDatabase[remoteId].videoDiv.id = remoteId;
      }
     
      //peer = peerDatabase[remoteId] || addPeer(remoteId,name); //'jj'
      peer = peerDatabase[remoteId] || addPeer(remoteId,name);
      
      send('init', remoteId, null,name);
    },

    peerRenegociate: function(remoteId) {
      offer(remoteId);
    },

    send: function(type, payload) {
      socket.emit(type, payload,function(data){
        console.log(data);
        var names = user.name || user.title + " " + user.firstname;
        socket.emit("init reload",{controlId:data.controlId,message:"from site init",userId: user.user_id,names: names});
      });
    },

    controlJoin: function(controlId,name) {
      socket.emit("control join",{control:controlId,name:name},function(data){
        console.log(data.control + " created a room!")
      })
    },
   
    getSocketForController: function() {
      return socket;
    }
  };
  
});

var Peer = function (pcConfig, pcConstraints,name) {
  //this.name = name //refers to the remote user name
  this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
  this.remoteVideoEl = document.createElement('video');
  this.videoDiv = document.createElement('section');
  this.videoDiv.className = "col-md-6 col-lg-6";
  this.videoDiv.style.border = "2px solid #d9edf7";
  this.videoDiv.style.display = "inline-block";
  this.videoDiv.style.padding = "8px 8px 0 8px";
  this.remoteVideoEl.style.width = "100%";
  //this.remoteVideoEl.style.height = "268px";
  //this.remoteVideoEl.style.width = "auto";
  
  this.remoteVideoEl.controls = true;
  this.remoteVideoEl.autoplay = true;
  this.captionElement = document.createElement('p');
  this.captionElement.style.backgroundColor  = "#d9edf7";
  this.captionElement.style.color = "orange";
  this.captionElement.style.padding = "4px";
  this.captionElement.style.textAlign = "center";
  this.captionElement.innerHTML = name;
}


//width:100%;height:268px