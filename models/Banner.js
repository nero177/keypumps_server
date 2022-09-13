const {Schema, model} = require('mongoose');

const Banner = new Schema({
    title: {type: String, default: 'Main'},
    imagesIds: [{type: Schema.Types.ObjectId, ref: 'Image'}],
})

module.exports = model('Banner', Banner)