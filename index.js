const http = require('http');
const util = require('util');

// https://github.com/node-formidable/node-formidable
const Formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Create a server
http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        // parse a file upload
        const form = new Formidable();

        form.parse(req, (err, fields, files) => {

            //https://cloudinary.com/documentation/upload_images
            cloudinary.uploader.upload(files.upload.path, result => {

                console.log(result)
                if (result.public_id) {
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.write('received upload:\n\n');
                    res.end(util.inspect({ fields: fields, files: files }));
                }
            }
            );
        });
        return;
    }

    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);

}).listen(8080);
