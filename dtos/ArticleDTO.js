module.exports = class ArticleDTO{
    id;
    title;
    body;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.body = model.body;
    }
}

//Data Transfer Object for filter article model data