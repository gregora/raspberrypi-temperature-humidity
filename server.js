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
  res.send(JSON.stringify(readData()));
});

app.get('/alldata', function(req, res){
  res.send(JSON.stringify(readHistory()));
});

http.listen(8100, function(){
  console.log('listening on *:8100');
});


function readData(){

  var data = dht.read();

  if(data.temperature==0 && data.humidity==0){
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

function readHistory(){

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM data", function (err, result, fields) {
      if (err) throw err;
      return result;
    });
  });

}

function saveToDB(){

  con.connect(function(err){

  	if(err) throw err;
  	console.log("connected");

  	var d, n;
  	var sql;

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
      saveToDB();
  	}

  });
}

setInterval(saveToDB, 60000);
