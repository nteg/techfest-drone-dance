var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.takeoff();

//client.animate("yawDance",3000);

client.animate("phiDance",3000);
    
  client.after(10000, function() {
    this.stop();
    this.land();
  });