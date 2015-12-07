var express = require('express');
var port = process.env.PORT || 8090;

app.use("/", express.static('./static')).use('/images', express.static('../images')).use('/lib', express.static('../lib'));
app.use(express.bodyParser());

module.exports = app;
if(process.mainModule === module) {
	app.listen(port);
	console.log("Express server listening on port " +port);
}
