var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'CardiologiService',
  description: 'This is a cardio app service',
  script: 'F:\\WEB APPS\\Cardio\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();