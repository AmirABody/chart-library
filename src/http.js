const http = require("http");
const extract = require("./cli-commands/extract");

//create a server object:
http
  .createServer(function (req, res) {
    console.log(req);
    // res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080