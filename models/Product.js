const {Schema, model} = require('mongoose');

const Product = new Schema({
    title: {type: String, required: true},
    category: {type: String},
    displayMain: {type: Boolean, default: false},
    inStock: {type: Boolean, default: true},
    price: {type: Number},
    initialPrice: {type: Number},
    discountPrice: {type: Number},
    linkedProducts: [{type: Object, ref: 'Product'}],
    filters: [{type: Object}],
    description: {type: String, default: 'Product description'},
    details: [{type: Object}],
    imagesIds: [{type: String}]
})

module.exports = model('Product', Product)