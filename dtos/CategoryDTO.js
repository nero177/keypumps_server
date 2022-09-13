module.exports = class CategoryDTO{
    id;
    title;
    products;
    filters;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.products = model.products;
        this.filters = model.filters;
    }
}

//Data Transfer Object for filter category model data