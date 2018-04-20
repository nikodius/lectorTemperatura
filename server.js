var express = require('express');  
var app = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
 
var port = 3000; 
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');
});
 
httpServer.listen(port);  
console.log('Servidor disponible en http://localhost:' + port);  
var led1, led2, led3;
 
//Arduino board connection
 
var board = new five.Board();  
board.on("ready", function() {  
    console.log('Arduino conectado');
    led1 = new five.Led(2);
	led2 = new five.Led(3);
	led3 = new five.Led(4);
	//lectura potenciometro
	var potentiometer = new five.Sensor({
		pin: "A2",
		freq: 250
	});
	potentiometer.on("data", function() {
		io.sockets.emit('pot',this.value);
	});
	//lectura temperatura
	var temperature = new five.Thermometer({
		controller: "LM35",
		pin: "A0"
	});
  temperature.on("change", function() {
		io.sockets.emit('temp',this.celsius);
  });
});
 
//Socket connection handler
io.on('connection', function (socket) {  
        socket.on('led:on', function (data) {
			led1.on();
			led2.on();
        });
 
        socket.on('led:off', function (data) {
            led1.off();
			led2.off();
        });
    });
 
console.log('Esperando por conexion');