const {Schema, model} = require('mongoose');

const Article = new Schema({
    title: {type: String},
    imagesIds: [{type: Schema.Types.ObjectId, ref: 'Image'}],
    body: {type: String, default: 'Article body'},
    theme: {type: String},
    date: {type: Date}
})

module.exports = model('Article', Article)