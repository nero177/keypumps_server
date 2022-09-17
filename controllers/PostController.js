const postService = require("../services/PostService");
const fs = require("fs");

class PostController {
  async createPost(req, res) {
    const response = await postService.createPost(
      req.body.title,
      req.query.postType,
      req.body.additional
    );
    res.json({ response });
  }

  async uploadPostImage(req, res, next) {
    const {postType, postTitle} = req.query;
    const fileSrc = res.locals.fileSrc;

    await postService.uploadPostImage(fileSrc, postType, postTitle);

    res.locals = req.query; //pass query params to locals for next (reload) middleware
    next();
  }

  async getPostImages(req, res) {
    const images = await postService.getPostImages(
      req.query.title,
      req.query.postType
    );
    return res.json({ images });
  }

  async deletePostImage(req, res) {
    const { index, postType, postTitle } = req.query;
    const response = await postService.deletePostImage(
      index,
      postType,
      postTitle
    );
    return res.json({ response });
  }

  async deletePost(req, res) {
    const {postTitle, postType} = req.query;
    await postService.deletePost(postTitle, postType)

    return res.json({success: 'Post successfully deleted'})
  }

  async getPosts(req, res){
    const {postType, sortBy} = req.query;
    const posts = await postService.getPosts(postType, sortBy);
    return res.json({posts});
  }

  async getPost(req, res){
    const {postTitle, postType} = req.query;
    const post = await postService.getPost(postTitle, postType);
    return res.json({post});
  }

  async getPostsById(req, res){
    const {ids, postType} = req.query;
    const posts = await postService.getPostsById(ids, postType);
    return res.json({posts});
  }

  async updatePost(req, res){
    const post = req.body.post;
    const postType = req.query.postType;
    await postService.updatePost(post, postType)
  }

  async changeProductCategory(req, res){
    const {productTitle, newCategoryTitle} = req.query;
    await postService.changeProductCategory(productTitle, newCategoryTitle);
  }

  async deleteProductFromCategory(req, res){
    const {categoryTitle, productTitle} = req.query;
    await postService.deleteProductFromCategory(categoryTitle, productTitle);
    return res.json({success: 'product successfully deleted from category'})
  }

  async search(req, res){
    const searched = await postService.search(req.query.searchString);
    return res.json(searched)
  }

  async filterProducts(req, res){
    const {categoryTitle, filters, priceFrom, priceTo} = req.query;
 
    const filtered = await postService.filterProducts(categoryTitle, filters, priceFrom, priceTo);
    return res.json(filtered);
  }

  async getMainPageProducts(){
    const products = postService.getMainPageProducts();
    return res.json(products);
  }
}

module.exports = new PostController();
