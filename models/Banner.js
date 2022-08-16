const {Schema, model} = require('mongoose');

const Banner = new Schema({
    title: {type: String, default: 'Main'},
    imagesIds: [{type: String}]
})

module.exports = model('Banner', Banner)