const {Schema, model} = require('mongoose');

const Category = new Schema({
    title: {type: String, required: true},
    thumbnailId: {type: String},
    products: [{type: String, default: []}]
})

module.exports = model('Category', Category)