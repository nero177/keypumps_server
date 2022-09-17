const {Schema, model} = require('mongoose');

const Product = new Schema({
    title: {type: String, required: true},
    category: {type: String},
    displayMain: {type: Boolean, default: false},
    inStock: {type: Boolean, default: true},
    topSales: {type: Boolean, default: false},
    price: {type: Number, default: 0},
    initialPrice: {type: Number},
    discountPrice: {type: Number},
    order: {type: Number, default: 0},
    linkedProducts: [{type: Object, ref: 'Product'}],
    filters: [{type: String}],
    description: {type: String, default: 'Product description'},
    details: [{type: Object}],
    imagesIds: [{type: Schema.Types.ObjectId, ref: 'Image'}],
    articul: {type: Number}
})

module.exports = model('Product', Product)