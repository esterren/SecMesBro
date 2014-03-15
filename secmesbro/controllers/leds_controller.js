
exports.index = function(app, req, res) {
  var leds = app.models.led.getAllEntries();
  //res.json( leds );
};

exports.show = function(app, req, res) {
  var led = app.models.led.find(req.params.id);
  res.json( led );
};

exports.create = function(app, req, res) {
  console.log('Creating new led');
  var led = app.models.led.create(req.body);
  res.json( led );
};

exports.update = function(app, req, res) {
  var led = app.models.led.update(req.body);
  res.json( led );
};

exports.remove = function(app, req, res) {
  var led = app.models.led.remove(req.params.id);
  res.json( led );
};