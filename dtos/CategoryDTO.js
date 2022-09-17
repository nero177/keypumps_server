module.exports = class CategoryDTO{
    id;
    title;
    products;
    filters;
    order;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.products = model.products;
        this.filters = model.filters;
        this.order = model.order;
    }
}

//Data Transfer Object for filter category model data