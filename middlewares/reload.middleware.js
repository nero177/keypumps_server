module.exports = (req, res) => {
    const {postType, postTitle} = res.locals;

    switch (postType) {
        case "Article":
          res.redirect(req.get('referer') + 'editArticle?' + postTitle);
          break;
        case "Product":
          res.redirect(req.get('referer') + 'editProduct?' + postTitle);
          break;
        case "Category":
          res.redirect(req.get('referer') + 'editCategory?' + postTitle); 
          break;
        case "Banner":
          res.redirect(req.get('referer') + 'banners');
          break;
    }
}