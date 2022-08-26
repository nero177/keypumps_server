module.exports = class ArticleDTO{
    id;
    title;
    body;
    date;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.body = model.body;
        this.date = model.date;
    }
}

//Data Transfer Object for filter article model data