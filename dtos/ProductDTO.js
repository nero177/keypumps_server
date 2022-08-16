module.exports = class CategoryDTO{
    id;
    title;
    category;
    displayMain;
    price;
    initialPrice;
    discountPrice;
    linkedProducts;
    filters;
    description;
    details;
    inStock;

    constructor(model){
        this.id = model._id;
        this.title = model.title;
        this.category = model.category;
        this.displayMain = model.displayMain;
        this.price = model.price;
        this.initialPrice = model.initialPrice;
        this.discountPrice = model.discountPrice;
        this.linkedProducts = model.linkedProducts;
        this.filters = model.filters;
        this.description = model.description;
        this.details = model.details;
        this.inStock = model.inStock;
    }
}

//Data Transfer Object for filter product model data