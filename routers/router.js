const { Router } = require("express");
const router = new Router();
const postController = require("../controllers/PostController");
const multipartFormParser = require("../middlewares/multipartFormParser");
const userController = require("../controllers/UserController")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/", (req, res) => res.send("server"));

/* AUTH */
router.post('/login', userController.login);
router.get('/auth', authMiddleware);
/* /AUTH */ 

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
router.get("/filter", postController.filter)
router.get("/search", postController.search);

router.delete("/deletePost", postController.deletePost);
router.delete("/deletePostImage", postController.deletePostImage);
/* /POSTS */

module.exports = router;
