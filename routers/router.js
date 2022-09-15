const { Router } = require("express");
const router = new Router();
const postController = require("../controllers/PostController");
const multipartFormParser = require("../middlewares/multipartFormParser");
const userController = require("../controllers/UserController")
const authMiddleware = require("../middlewares/auth.middleware")
const reloadMiddleware = require("../middlewares/reload.middleware");

router.get("/", (req, res) => res.send("server"));

/* AUTH */
router.post('/login', userController.login);
router.get('/auth', authMiddleware);
/* /AUTH */ 

/* POSTS */
router.post("/uploadPostImage", multipartFormParser, postController.uploadPostImage, reloadMiddleware);
router.post("/createPost", postController.createPost);
router.post("/updatePost", postController.updatePost);
router.post("/changeProductCategory", postController.changeProductCategory);
router.post("/deleteProductFromCategory", postController.deleteProductFromCategory)

router.get("/getPostImages", postController.getPostImages);
router.get("/getPostsById", postController.getPostsById);
router.get("/getPosts", postController.getPosts);
router.get("/getPost", postController.getPost);
router.get("/search", postController.search);
router.get("/filterProducts", postController.filterProducts);
router.get("/filterByPrice", postController.filterByPrice);

router.delete("/deletePost", postController.deletePost);
router.delete("/deletePostImage", postController.deletePostImage);
/* /POSTS */

module.exports = router;
