const Image = require("../models/Image");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Article = require("../models/Article");
const Banner = require("../models/Banner");
const Promo = require("../models/Promo");
const CategoryDTO = require("../dtos/CategoryDTO");
const ArticleDTO = require("../dtos/ArticleDTO");
const ProductDTO = require("../dtos/ProductDTO");

class PostService {
  async createPost(title, postType, additional) {
    try {
      let post;

      switch (postType) {
        case "Category":
          post = await Category.findOne({ title: title });

          if (post) break;

          const newCategory = { title };

          post = await Category.create(newCategory);
          return post;
        case "Product":
          post = await Product.findOne({ title: title }); //check if product already exist
          if (post) break;

          let newProduct = { title, ...additional }; //create new product from title and additional options
          newProduct = await Product.create(newProduct);
          //find selected category of new product
          const productCategory = await Category.findOne({
            title: newProduct.category,
          });
          //push new product id to selected category and save it
          productCategory.products.push(newProduct._id);
          await productCategory.save();

          break;
        case "Article":
          post = await Article.findOne({ title: title });

          if (post) break;

          const date = new Date();

          const newArticle = {
            title,
            date,
          };

          return await Article.create(newArticle);
        case "Promo":
          const newPromo = title; //title arg commonly means post title, but in some cases another content

          const promo = await Promo.findOne({ promocode: newPromo.promocode });

          if (promo) return;

          await Promo.create(newPromo);
          break;
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, createPost]: " + err);
    }
  }

  async uploadPostImage(fileSrc, postType, postTitle) {
    try {
      const newImage = await Image.create({src: fileSrc});
      let post;

      switch (postType) {
        case "Banner":
          post = await Banner.findOne({ title: "Main" });
          post.imagesIds.push(newImage._id);
          break;
        case "Product":
          post = await Product.findOne({ title: postTitle });
          post.imagesIds.push(newImage._id);
          break;
        case "Category":
          post = await Category.findOne({ title: postTitle });
          post.imagesIds[0] = newImage._id;
          break;
        case "Article":
          post = await Article.findOne({ title: postTitle });
          post.imagesIds[0] = newImage._id;
          break;
        default:
          break;
      }

      return post.save();
    } catch (err) {
      console.log("[PostService.js, uploadPostImage]: " + err);
    }
  }

  async getPostImages(postTitle, postType) {
    try {
      let post;

      switch (postType) {
        case "Banner":
          post = await Banner.findOne({ title: postTitle || "Main" });
          break;
        case "Product":
          post = await Product.findOne({ title: postTitle });
          break;
        case "Category":
          post = await Category.findOne({ title: postTitle });
          break;
        case "Article":
          post = await Article.findOne({ title: postTitle });
          break;
        default:
          break;
      }

      if (!post) return;

      let imagesLinks = [];

      await Promise.all(
        post.imagesIds.map(async (imageId) => {
          const postImage = await Image.findById(imageId);
          if(!postImage) return;
          imagesLinks.push(postImage.src);
        })
      );

      return { photosLinks: imagesLinks };
    } catch (err) {
      console.log("[PostService.js, getPostImages]: " + err);
    }
  }

  async deletePostImage(index, postType, postTitle) {
    try {
      let post;

      switch (postType) {
        case "Banner":
          post = await Banner.findOne({ postTitle });
        case "Product":
          post = await Product.findOne({ title: postTitle });
        default:
          break;
      }

      post.imagesIds.splice(index, 1);
      return await post.save();
    } catch (err) {
      console.log("[PostService.js, deletePostImage]: " + err);
    }
  }

  async deletePost(title, postType) {
    try {
      switch (postType) {
        case "Article":
          await Article.deleteOne({ title });
          break;
        case "Category": //при удалении категории
          //находим продукты категории
          const categoryProducts = await Product.find({ category: title });

          //перебираем продукты категории, 
          await Promise.all(
            categoryProducts.map(async (product) => {
              product.category = "Без категории"; //всем ставим "Без категории"
              await product.save();
            })
          );

          await Category.deleteOne({ title });
          break;
        case "Promo":
          await Promo.deleteOne({ promocode: title });
          break;
        case "Product": //при удалении продукта
          const product = await Product.findOne({ title });
          const productCategory = await Category.findOne({title: product.category})
        
          if (productCategory) {
            console.log(product._id)
            productCategory.products = productCategory.products.filter(
              productId => productId !== product._id.toString()
            );

            await productCategory.save();
          }

          await Product.deleteOne({ title });
          break;
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, deletePost]: " + err);
    }
  }

  async getPosts(postType, sortBy) {
    try {

      switch (postType) {
        case "Article":
          const articles = await Article.find();
          const articlesObject = [];

          await Promise.all(
            articles.map(async (article) => {
              const articleDto = new ArticleDTO(article);
              const articleImage = await this.getPostImages(
                article.title,
                postType
              );
              articlesObject.push({ ...articleDto, articleImage });
            })
          );

          return articlesObject;
        case "Category":
          const categories = await Category.find();
          const categoriesObject = [];

          await Promise.all(
            categories.map(async (category) => {
              const categoryDto = new CategoryDTO(category);
              const categoryImage = await this.getPostImages(
                category.title,
                postType
              );
              categoriesObject.push({ ...categoryDto, categoryImage });
            })
          );

          return categoriesObject;
        case "Promo":
          return await Promo.find();
        case "Product":
          let products = await Product.find();
          let productsObject = [];

          await Promise.all(
            products.map(async (product) => {
              const productDto = new ProductDTO(product);
              const productImages = await this.getPostImages(
                product.title,
                postType
              );

              productsObject.push({ ...productDto, productImages });
            })
          );

          switch (sortBy){
            case 'price_descending':
              productsObject = productsObject.sort((a, b) => a.price > b.price ? -1 : 1);
              break;
            case 'price_ascending':
              productsObject = productsObject.sort((a, b) => a.price > b.price ? 1 : -1);
              break;
            default:
              productsObject = productsObject.sort((a, b) => a.order > b.order ? -1 : 1);
              break;
          }
          
          return productsObject;
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, getPosts]: " + err);
    }
  }

  async getPost(postTitle, postType) {
    try {
      let postImages;

      switch (postType) {
        case "Category":
          const category = await Category.findOne({ title: postTitle });
          postImages = await this.getPostImages(postTitle, postType);
        
          const categoryDto = new CategoryDTO(category);
          const categoryProducts = await this.getPostsById(category.products, "Product")

          return { ...categoryDto, postImages, categoryProducts };
        case "Article":
          const article = await Article.findOne({ title: postTitle });
          postImages = await this.getPostImages(postTitle, postType);
          const articleDto = new ArticleDTO(article);

          return { ...articleDto, postImages };
        case "Product":
          const product = await Product.findOne({ title: postTitle });
          postImages = await this.getPostImages(postTitle, postType);
          const productDto = new ProductDTO(product);
          return { ...productDto, postImages };
        case "Banner":
          postImages = await this.getPostImages(postTitle, postType);
          return { postImages };
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, getPost]: " + err);
    }
  }

  async getPostsById(ids, postType){
    try{
      switch(postType){
        case "Category":
          const categories = await Promise.all(
            ids.map(async (id) => await Category.findById(id))
          )
          return categories;
        case "Product":
          let products = await Promise.all(
            ids.map(async (id) => {
              const product = await Product.findById(id);
              const images = await this.getPostImages(product.title, 'Product');

              return {product, images};
            })
          );

          products = products.sort((a, b) => a.order > b.order ? 1 : -1);
          return products;
        default: 
          break;
      }
    } catch (err) {
      console.log("[PostService.js, getPostsById]: " + err);
    }
  }

  async updatePost(post, postType) {
    try {
      switch (postType) {
        case "Category":
          const category = await Category.findById(post.id);
          await Object.assign(category, post).save();
          break;
        case "Product":
          const product = await Product.findById(post.id);
          await Object.assign(product, post).save();
          break;
        case "Article":
          const article = await Article.findById(post.id);
          await Object.assign(article, post).save();
          break;
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, updatePost]: " + err);
    }
  }

  async changeProductCategory(productTitle, newCategoryTitle) {
    try {
      const product = await Product.findOne({ title: productTitle });
      const productPrevCategory = await Category.findOne({
        title: product.category,
      });

      if (productPrevCategory) {
        const filteredProducts = productPrevCategory.products.filter(
          productId => productId !== product._id.toString()
        ); //remove this product from previus category

        productPrevCategory.products = filteredProducts; //update previus category
        await productPrevCategory.save();
      }

      const newCategory = await Category.findOne({ title: newCategoryTitle });
      newCategory.products.push(product._id);
      await newCategory.save();

      product.category = newCategoryTitle;
      await product.save();
    } catch (err) {
      console.log("[PostService.js, changeProductCategory]: " + err);
    }
  }

  async deleteProductFromCategory(categoryTitle, productTitle) {
    try {
      const category = await Category.findOne({ title: categoryTitle });
      const product = await Product.findOne({ title: productTitle });

      category.products = category.products.filter(
        productId => productId.toString() !== product._id.toString()
      );

      product.category = "Без категории";

      await category.save();
      await product.save();
    } catch (err) {
      console.log("[PostService.js, deleteProductFromCategory]: " + err);
    }
  }

  async search(searchString, limit) {
    const allProducts = await this.getPosts("Product");
    const findedProducts = [];

    allProducts.map((product) => {
      if (product.title.toLowerCase().includes(searchString.toLowerCase()))
        findedProducts.push(product);
    });

    if(limit)
      findedProducts.length = limit;

    return findedProducts;
  }

  async filterProducts(categoryTitle, filters, priceFrom, priceTo){
    try{
      priceFrom = parseInt(priceFrom);
      priceTo   = parseInt(priceTo);

      const parsedFilters = filters.split(',');
      const category = await this.getPost(categoryTitle, "Category");
      let filteredProducts = [];
      
      
      category.categoryProducts.map(productObject => {
        const found = parsedFilters.every(filter => productObject.product.filters.includes(filter));
      
        if(found)
          filteredProducts.push(productObject);
      });

      if(priceFrom || priceTo)
        filteredProducts = filteredProducts.filter(productObject => (productObject.product.price > priceFrom) && (productObject.product.price < priceTo));
      
      return filteredProducts;
    } catch (err) {
      console.log("[PostService.js, filterProducts]: " + err);
    }
  }

  async getMainPageProducts(){
    try{
      return await Product.find({displayMain: true});
    } catch (err){
      console.log("[PostService.js, getMainPageProducts]: " + err);
    }
  }
}

module.exports = new PostService();
