# Temperature and humidity sensor and display for raspberry pi

This tool creates server on port 8100, where you can see current temperature and humidity and also charts for the past.

# Getting Started

To run this project you first need to download node.js and this repository on your Raspberry Pi. You need to own DHT11 temperature and humidity sensor that you connect to pin number 18. If you don't know how to do this, check it out [here](http://www.circuitbasics.com/how-to-set-up-the-dht11-humidity-sensor-on-the-raspberry-pi/), but remember to connect it to pin 18. You also need to have a mysql server running. You need to create a new database on your server called "temperature" and table "data" with columns "temperature", "humidity", "sumT", "sumH", "count" and "time". After that, change lines 11 and 12 in /server.js, so you have your mysql user and password instead of "root" and "". Now you can start the server. Open the terminal and navigate to the repository. Once in repository, execute this command: "sudo node server.js". This will run a web server with your data on port 8100.

# Built With

Node.js
  - express.js
  - socket.io
  - rpi-dht-sensor
