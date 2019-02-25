var dht2=require("rpi-dht-sensor");
var path = require('path');
var mysql=require("mysql");
var io = require('socket.io')(http);

var dht=new dht2.DHT11(18);


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


const port = 8100

var count;
var sumT;
var sumH;

var alldata=[];



app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(8100, function(){
  console.log('listening on *:8100');
});

var con = mysql.createConnection({

		host: "localhost",
		user: "root",
		password: "",
		database: "temperature",

	});

con.connect(function(err){

	if(err) throw err;
	console.log("connected");

	function readDB(){

		con.query("select * from data;", function (err, result) {
			if (err) throw err;


			if(result==[] || result==false){

				console.log("Table is empty, writing in a new table");

				sumT=0;
				sumH=0;
				count=0;


			}else{

				alldata=result;

				console.log("Countinouing to write in the same table");

				dt=result[result.length-1];
				sumT=dt.sumT;
				sumH=dt.sumH;
				count=dt.count;

				}





	});

	}

	readDB();



	var r;

	var d, n;

	var sql;


	function read(){

		r=dht.read();

		if(r.temperature!=0 && r.humidity!=0){

			d = new Date();
			n = d.getTime();

			count=count+1;

			sumT=sumT+r.temperature;

			sumH=sumH+r.humidity;

			console.log(r.temperature, r.humidity, sumT/count, sumH/count);

			sql="INSERT INTO data (temperature, humidity, sumT, sumH, count, time) VALUES ?";

			values=[[r.temperature, r.humidity, sumT, sumH, count, n/1000]];

			//console.log(values);

			con.query(sql, [values], function (err, result) {
			if (err) throw err;
			});

		}else{

			console.log("false reading");

			}

		}

	setInterval(read, 60000);


	io.on('connection', function(socket){
	  console.log('a user connected');

	  readDB();

	  socket.emit("alldata", alldata);

	  //console.log(alldata);

    send();

	  setInterval(send, 60000);

    send();


	  function send(){

		if(r){

		  if(r.temperature!=0 && r.humidity!=0){

			 d = new Date();
			n = d.getTime();

			socket.emit("data", [r.temperature, r.humidity, sumT/count, sumH/count, n]);

      readDB();

      socket.emit("alldata", alldata);

		}

		}

		  }

	});

});
