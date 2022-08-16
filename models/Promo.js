const {Schema, model} = require('mongoose');

const Promo = new Schema({
    promocode: {type: String, required: true},
    percent: {type: Number, required: true}
})

module.exports = model('Promo', Promo)