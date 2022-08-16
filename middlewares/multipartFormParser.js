const AWS = require('aws-sdk');
const fs = require('fs');
const multiparty = require('multiparty')

module.exports = (req, res, next) => {
    const form = new multiparty.Form()
    const s3 = new AWS.S3({
        accessKeyId: 'AKIAVD7YYXH732OL7VPI',
        secretAccessKey: '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'
    })

    try{
        form.parse(req, function (err, fields, files) {
            req.body = fields;
            req.files = files;
            
            let filename;
            let fileContent;
    
            if(files.articleImage){
                filename = files.articleImage[0].originalFilename;
                fileContent = fs.readFileSync(files.articleImage[0].path)
            }
            
            if(files.categoryImage){
                filename = files.categoryImage[0].originalFilename;
                fileContent = fs.readFileSync(files.categoryImage[0].path)
            }

            if(files.productImage){
                filename = files.productImage[0].originalFilename;
                fileContent = fs.readFileSync(files.productImage[0].path)
            }

            if(files.bannerImage){
                filename = files.bannerImage[0].originalFilename;
                fileContent = fs.readFileSync(files.bannerImage[0].path)
            }
    
            const params = {
                Bucket: 'keypumpsbucket',
                Key: filename,
                Body: fileContent
            }
    
            s3.upload(params, (err, data) => {
                if(err)
                    console.log(err)
            })
    
            next();
        })
    } catch (err) {
        console.log('[multipartFormParser] image uploading error' + err)
    }

}
