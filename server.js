var dht2=require("rpi-dht-sensor");
var path = require('path');
var mysql=require("mysql");

var dht=new dht2.DHT11(18);

var app = require('express')();
var http = require('http').Server(app);

const port = 8100


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data', function(req, res){
  res.send(JSON.strigify(readData()));
});

app.get('/alldata', function(req, res){
  res.send(JSON.strigify());
});

http.listen(8100, function(){
  console.log('listening on *:8100');
});


function readData(){

  var data = dht.read();

  if(r.temperature==0 && r.humidity==0){
    data = readData();
  }

  return data;

}



var con = mysql.createConnection({

		host: "localhost",
		user: "root",
		password: "",
		database: "temperature",

	});


con.connect(function(err){

	if(err) throw err;
	console.log("connected");

	readDB();

	var d, n;
	var sql;


  function read(){

    var r = readData();

  	if(r.temperature!=0 && r.humidity!=0){

  		d = new Date();
  		n = d.getTime();

  		sql="INSERT INTO data (temperature, humidity, time) VALUES ?";

  		values=[[r.temperature, r.humidity, n/1000]];

  		con.query(sql, [values], function (err, result) {
  		    if (err) throw err;
  		});

  	}else{
  		console.log("false reading");
      read();
  	}

  }

  setInterval(read, 60000);

});
