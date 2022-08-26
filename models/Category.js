const {Schema, model} = require('mongoose');

const Category = new Schema({
    title: {type: String, required: true},
    thumbnailId: {type: String},
    products: [{type: Object, ref: 'Product'}]
})

module.exports = model('Category', Category)