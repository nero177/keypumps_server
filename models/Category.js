const {Schema, model} = require('mongoose');

const Category = new Schema({
    title: {type: String, required: true},
    imagesIds: [{type: Schema.Types.ObjectId, ref: 'Image'}],
    products: [{type: String, ref: 'Product', default: []}],
    filters: [{type: Object}],
    order: {type: Number}
})

module.exports = model('Category', Category)