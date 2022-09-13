const {Schema, model} = require('mongoose');

const Image = new Schema({
    src: {type: String}
})

module.exports = model('Image', Image)