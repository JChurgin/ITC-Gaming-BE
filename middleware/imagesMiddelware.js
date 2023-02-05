const multer= require("multer")
const path= require("path")
const pathToImage= path.resolve(__dirname,"../images")
const cloudinary= require("cloudinary").v2
const{CloudinaryStorage}=require("multer-storage-cloudinary")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathToImage)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
    }
  })
  const upload = multer({ storage: storage })


  const genrateUrl=(req,res,next)=>{
    const imageUrl= `http://localhost:3000/${req.file.filename}`
    console.log(imageUrl)
    req.body.imageUrl=imageUrl;
    next()
  }

  module.exports= {upload,genrateUrl}