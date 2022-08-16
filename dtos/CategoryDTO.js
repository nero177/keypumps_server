module.exports = class CategoryDTO{
    id;
    title;
    products;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.products = model.products;
    }
}

//Data Transfer Object for filter category model data