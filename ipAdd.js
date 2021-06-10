text = (url) => {
    return fetch(url).then(res => res.text());
  }
  
  text('https://www.cloudflare.com/cdn-cgi/trace').then(data => {
    let ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
    let ip = data.match(ipRegex)[0];
  
    document.getElementById('ippublic').innerHTML = `Public IP: ${ip} `;
    
  });
  
 
  
  getIPAdd = (onNewIP) => { 
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: []
      }),
      noop = () => {},
      localIPs = {},
      ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;
  
      iterateIP = (ip) => {
          if (!localIPs[ip]) onNewIP(ip);
          localIPs[ip] = true;
      }
  
       
      pc.createDataChannel("");
  
     
      pc.createOffer((sdp) => {
          sdp.sdp.split('\n').forEach(function(line) {
              if (line.indexOf('candidate') < 0) return;
              line.match(ipRegex).forEach(iterateIP);
          });
          
          pc.setLocalDescription(sdp, noop, noop);
      }, noop); 
  
   
      pc.onicecandidate = (ice) =>{
          if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) 
          return;
          ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
  }
  

  
  getIPAdd((ip) =>{
          document.getElementById("ipprivate").innerHTML = `Private IP:${ip}`;
  });