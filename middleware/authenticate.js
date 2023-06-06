const jwt=require('jsonwebtoken');

require('dotenv').config()

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    //  console.log(token)
    try {
        if(token){
          const decode=jwt.verify(token,process.env.key);
        //   console.log(decode);
          if(decode){
            const UserId=decode.UserId;
            req.body.UserId=UserId
            next()
          }else{
            res.json({"msg":"Please Login Again"})
          }
        }else{
            res.json({"msg":"Token deosn't exist"})
        }
        
    } catch (error) {
        console.log(error);
    }
    
    

}

module.exports={
    authenticate
}