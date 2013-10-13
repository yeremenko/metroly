module.exports = function (app, mongoose) {

  var Schema = mongoose.Schema;

  var BusLineSchema = new Schema({
    name: String,
    city: String,
    agency: String,
  });

  mongoose.model('BusLine', BusLineSchema);
};