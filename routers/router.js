const { Router } = require("express");
const router = new Router();
const postController = require("../controllers/PostController");
const multipartFormParser = require("../middlewares/multipartFormParser");

router.get("/", (req, res) => res.send("server"));

/* POSTS */
router.post("/editThumb", multipartFormParser, postController.uploadThumbnail);
router.post("/addPostImage", multipartFormParser, postController.addPostImage);
router.post("/createPost", postController.createPost);
router.post("/updatePost", postController.updatePost);
router.post("/changeProductCategory", postController.changeProductCategory);
router.post("/deleteProductFromCategory", postController.deleteProductFromCategory)

router.get("/getPostImages", postController.getPostImages);
router.get("/getPosts", postController.getPosts);
router.get("/getPost", postController.getPost);

router.delete("/deletePost", postController.deletePost);
router.delete("/deletePostImage", postController.deletePostImage);
/* /POSTS */

module.exports = router;
