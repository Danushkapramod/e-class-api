
import multer from "multer";


const storage =  multer.diskStorage({
        destination:(req,file,cb)=>{
        cb(null,"upload")
        },
        filename:(req,file,cb)=>{
            const ext = file.mimetype.split('/')[1];
        cb(null,`${req.user._id}_${Date.now()}.${ext}`)
        }
     })

const fileFilter = (req,file,cb)=>{
        const allowedFileType = ["jpg", "jpeg", "png"];
        if(allowedFileType.includes(file.mimetype.split("/")[1])){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }

const file = multer({limits:10000,storage,fileFilter})
const buffer = multer({ storage:multer.memoryStorage() })

export const uploadBuffer =   buffer.single('avatar')
export const imgUploadFile =  file.single('avatar')
