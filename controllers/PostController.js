const postService = require("../services/PostService");
const fs = require("fs");

class PostController {
  async uploadThumbnail(req, res) {
    const title = req.query.title;
    const postType = req.query.postType;
    let img, refererPage; //page of editing post type

    switch (postType) {
      case "Category":
        img = fs.readFileSync(req.files.categoryImage[0].path);
        refererPage = "editCategory";
        break;
      case "Article":
        img = fs.readFileSync(req.files.articleImage[0].path);
        refererPage = "editArticle";
        break;
      default:
        break;
    }

    const encodeImg = img.toString("base64");
    const finalImg = {
      image: Buffer.from(encodeImg, "base64"),
    };

    const response = await postService.uploadThumbnail(
      finalImg,
      title,
      postType
    );

    if (!response)
      return res.json({ error: "Error while uploading thumbnail" });

    const redirectLink = req.headers.referer + refererPage + `?${title}`;
    return res.redirect(redirectLink);
  }

  async createPost(req, res) {
    const response = await postService.createPost(
      req.body.title,
      req.query.postType,
      req.body.additional
    );
    res.json({ response });
  }

  async addPostImage(req, res) {
    let img;
    const {postType, postTitle} = req.query;
   
    switch (postType) {
      case "Banner":
        img = fs.readFileSync(req.files.bannerImage[0].path);
        break;
      case "Product":
        img = fs.readFileSync(req.files.productImage[0].path)
        break;
      default:
        break;
    }

    const encodeImg = img.toString("base64");
    const finalImg = {
      image: Buffer.from(encodeImg, "base64"),
    };

    await postService.addPostImage(finalImg, postType, postTitle);

    switch (postType) {
      case "Banner":
        res.redirect(req.headers.referer + "banners");
        break;
      case "Product":
        res.redirect(req.headers.referer + `editProduct?${postTitle}`)
        break;
      default:
        break;
    }
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
    const posts = await postService.getPosts(req.query.postType);
    return res.json({posts});
  }

  async getPost(req, res){
    const {postTitle, postType} = req.query;
    const post = await postService.getPost(postTitle, postType);
    return res.json({post});
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
}

module.exports = new PostController();
