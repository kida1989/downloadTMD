
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var radarmeasurementSchema= new Schema ({
  _id: String


},{collection:'bb.radarmeasurement'});

module.exports = mongoose.model('Radar', radarmeasurementSchema);
