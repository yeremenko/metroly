module.exports = function (app, mongoose) {

  var Schema = mongoose.Schema;

  var BusLineSchema = new Schema({
    uid: String,
    name: String,
    created: {type: Date, default: Date.now}
  });

  mongoose.model('BusLine', BusLineSchema);
};