module.exports = function (app, mongoose) {

  mongoose.connect('mongodb://localhost/metroly');

  var Schema = mongoose.Schema;

  var BusLineSchema = new Schema({
    uid: String,
    name: String,
    created: {type: Date, default: Date.now}
  });

  mongoose.model('BusLine', BusLineSchema);
};