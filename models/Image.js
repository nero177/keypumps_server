const {Schema, model} = require('mongoose');

const Image = new Schema({
    image: {type: Buffer},
    contentType: {type: String}
})

module.exports = model('Image', Image)