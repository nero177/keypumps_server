const {Schema, model} = require('mongoose');

const Article = new Schema({
    title: {type: String},
    thumbnailId: {type: String}, 
    body: {type: String, default: 'Article body'}
})

module.exports = model('Article', Article)