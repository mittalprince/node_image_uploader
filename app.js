const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

var port = process.env.PORT || 8000

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, callback) {
        callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage,
    limits:{fileSize: 1000000 },
    fileFilter: function(req,file,callback){
        checkFileType(file,callback);
    }
}).single('myImage')

function checkFileType(file, callback){
    const filetype = /jpeg|jpg|png|gif/;
    const extname = filetype.test(path.extname(file.originalname).toLowerCase())
    const mimetype =filetype.test(file.mimetype)

    if(extname && mimetype){
        return callback(null,true)
    }
    else{
        callback('Error : Images only')
    }

}

const app =express()

app.set('view engine', 'ejs')

app.use(express.static('./public'))

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
      if(err){
          res.render('index', { msg:err})
      }
      else{
         if(req.file == undefined){
             res.render('index',{
                 msg: "Error No file selected"
             })
         }
         else{
             res.render('index', {
                 msg:'File Uploaded',
                 file: `uploads/${req.file.filename}`
             })
         }
      }
    })
})

app.listen(port, () => {
    console.log(`Server works on port ${port}`);
})


