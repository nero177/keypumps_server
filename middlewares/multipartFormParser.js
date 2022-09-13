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
        form.parse(req, async function (err, fields, files) {
            req.body = fields;
            req.files = files;
            
            const filename = files.postImage[0].originalFilename;
            const fileContent = fs.readFileSync(files.postImage[0].path)
    
            const params = {
                Bucket: 'keypumpsbucket',
                Key: filename,
                Body: fileContent
            }
    
            const uploadData = await s3.upload(params).promise();
            res.locals.fileSrc = uploadData.Location;
            next();
        })
    } catch (err) {
        console.log('[multipartFormParser] image uploading error' + err)
    }

}
