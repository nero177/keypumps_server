module.exports = class CategoryDTO{
    id;
    title;
    category;
    displayMain;
    topSales;
    price;
    initialPrice;
    discountPrice;
    linkedProducts;
    filters;
    description;
    details;
    inStock;
    order;
    articul;

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
        this.topSales = model.topSales;
        this.order = model.order;
        this.articul = model.articul;
    }
}

//Data Transfer Object for filter product model data