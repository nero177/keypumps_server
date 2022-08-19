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
  async uploadThumbnail(image, postTitle, postType) {
    try {
      const newImage = await Image.create(image);
      let post;

      switch (postType) {
        case "Category":
          post = await Category.findOne({ title: postTitle });
          break;
        case "Article":
          post = await Article.findOne({ title: postTitle });
          break;
        default:
          break;
      }

      if (!post) return null;

      post.thumbnailId = newImage.id;
      await post.save();

      return true;
    } catch (err) {
      console.log("[PostService.js, uploadThumbnail]: " + err);
    }
  }

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
          post = await Product.findOne({ title: title });
          if (post) break;

          const newProduct = { title, ...additional };
          await Product.create(newProduct);

          const productCategory = await Category.findOne({title: newProduct.category})
          productCategory.products.push(newProduct.title);
          await productCategory.save()

          break;
        case "Article":
          post = await Article.findOne({ title: title });

          if (post) break;

          const newArticle = {
            title,
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

  async addPostImage(image, postType, postTitle) {
    try {
      const newImage = await Image.create(image);

      switch (postType) {
        case "Banner":
          const banner = await Banner.findOne({ title: "Main" });
          banner.imagesIds.push(newImage._id);
          await banner.save();
          break;
        case "Product":
          const product = await Product.findOne({ title: postTitle });
          product.imagesIds.push(newImage._id);
          await product.save();
          break;
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, addPostImage]: " + err);
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
        default:
          break;
      }

      if (!post) return;

      let photos = [];

      await Promise.all(
        post.imagesIds.map(async (imageId) => {
          const postImage = await Image.findById(imageId);
          photos.push(postImage.image);
        })
      );

      return photos;
    } catch (err) {
      console.log("[PostService.js, getPostImages]: " + err);
    }
  }

  async deletePostImage(index, postType, postTitle) {
    try {
      switch (postType) {
        case "Banner":
          const banner = await Banner.findOne({ postTitle });
          banner.imagesIds.splice(index, 1);
          await banner.save();
          return true;
        default:
          break;
      }
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
        case "Category":
          const categoryProducts = await Product.find({category: title})
          
          await Promise.all(
            categoryProducts.map(async (product) => {
              product.category = 'Без категории'
              await product.save();
            })
          )
         
          await Category.deleteOne({ title });
          break;
        case "Promo":
          await Promo.deleteOne({ promocode: title });
          break;
        case "Product":
          const product = await Product.findOne({title});
          const productCategory = await Category.findOne({title: product.category}); 

          if(productCategory){
            const filteredCategoryProducts = productCategory.products.filter(productTitle => productTitle !== title);
            productCategory.products = filteredCategoryProducts;
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

  async getPosts(postType) {
    try {
      switch (postType) {
        case "Article":
         const articles = await Article.find();
          const articlesDto = [];

          articles.forEach(article => {
            const articleDto = new ArticleDTO(article);
            articlesDto.push({...articleDto});
          })

          return articlesDto;
        case "Category":
          const categories = await Category.find();
          const categoriesDto = [];

          categories.forEach(category => {
            const categoryDto = new CategoryDTO(category);
            categoriesDto.push({...categoryDto});
          })

          return categoriesDto;
        case "Promo":
          return await Promo.find();
        case "Product":
          const products = await Product.find();
          const productsDto = [];

          products.forEach(product => {
            const productDto = new ProductDTO(product);
            productsDto.push({...productDto});
          })

          return productsDto;
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
          postImages = await Image.findById(category.thumbnailId);
          const categoryDto = new CategoryDTO(category);
         
          return { ...categoryDto, postImages };
        case "Article":
          const article = await Article.findOne({ title: postTitle });
          postImages = await Image.findById(article.thumbnailId);
          const articleDto = new ArticleDTO(article);
         
          return { ...articleDto, postImages };
        case "Product":
          const product = await Product.findOne({ title: postTitle });
         
          postImages = await this.getPostImages(postTitle, postType);
          const productDto = new ProductDTO(product);
          return { ...productDto, postImages };
        default:
          break;
      }
    } catch (err) {
      console.log("[PostService.js, getPost]: " + err);
    }
  }

  async updatePost(post, postType){
    try{
      switch (postType){
        case 'Category':
          const category = await Category.findById(post.id);  
          await Object.assign(category, post).save();
          break;
        case 'Product':
          const product = await Product.findById(post.id);
          await Object.assign(product, post).save();
          break;
        case 'Article':
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

  async changeProductCategory(productTitle, newCategoryTitle){
    try{
      const product = await Product.findOne({title: productTitle}); //find the product
      const productPrevCategory = await Category.findOne({title: product.category}); //find previus product category

      if(productPrevCategory){
        const filteredProducts = productPrevCategory.products.filter(item => item !== productTitle); //remove this product from previus category
        productPrevCategory.products = filteredProducts; //update previus category
        await productPrevCategory.save();
      }
    
      const newCategory = await Category.findOne({title: newCategoryTitle}); //get selected category
      newCategory.products.push(productTitle); //push this product to selected category and save
      await newCategory.save();

      product.category = newCategoryTitle;
      await product.save();
    } catch (err){
      console.log("[PostService.js, changeProductCategory]: " + err);
    }
  }

  async deleteProductFromCategory(categoryTitle, productTitle){
    try{
      const category = await Category.findOne({title: categoryTitle});
      category.products = category.products.filter(item => item !== productTitle);
      await category.save();

      const product = await Product.findOne({title: productTitle});
      product.category = 'Без категории';
      await product.save();
    } catch (err){
      console.log("[PostService.js, deleteProductFromCategory]: " + err);
    }
  }

  async filter(filterObject){
    try{
      const products = await this.getPosts('Product');
      const filteredProducts = [];
    
      products.map(product => {
        const filteringDetails = Object.entries(filterObject.details).map((e) => ({[e[0]]: e[1] } ));
        const filteringFilters = Object.entries(filterObject.filters).map((e) => ({[e[0]]: e[1] } ));

        product.details.map(detail => {
          const entries = new Map([
            [detail.key, detail.value]
          ])

          filteringDetails.map(item => {
            if(JSON.stringify(item) === JSON.stringify(Object.fromEntries(entries))){
              const ind = filteringDetails.indexOf(item)
              filteringDetails.splice(ind, 1);
            }
          })
        });
        
        product.filters.map(filterItem => {
          const entries = new Map([
            [filterItem.key, filterItem.value]
          ])

          filteringFilters.map(item => {
            if(JSON.stringify(item) === JSON.stringify(Object.fromEntries(entries))){
              const ind = filteringFilters.indexOf(item)
              filteringFilters.splice(ind, 1);
            }
          })
        });

        if(filteringDetails.length === 0 && filteringFilters.length === 0 &&
          (product.price >= parseInt(filterObject.price.from) && product.price <= parseInt(filterObject.price.to))){
          filteredProducts.push(product)
        }
      })

      return filteredProducts;
    } catch (err){
      console.log("[PostService.js, filter]: " + err);
    }
  }

  async search(searchString){
    const allProducts = await this.getPosts('Product');
    const findedProducts = [];

    allProducts.map(product => {
      if(product.title.toLowerCase().includes(searchString.toLowerCase()))
        findedProducts.push(product);
    })
    
    return findedProducts;
  }
}

module.exports = new PostService();
