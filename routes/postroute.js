const express=require('express');

const { PostModel}=require("../models/postmodel");
const { UserModel } = require('../models/usermodel');

const{authenticate}=require('../middleware/authenticate');


const postrouter=express.Router();


postrouter.get("/posts",async(req,res)=>{
    try {
        let post_data=await PostModel.find();
        res.json({"msg":post_data})
    } catch (error) {
        console.log(error);
        console.log(`Error While getting the data`)
    }
})

postrouter.get("/posts/:id",async(req,res)=>{
    let id=req.params.id
    try {
        let post_data=await PostModel.find({_id:id}).populate("likes").populate("comments").exec();
        res.json({"msg":post_data})
    } catch (error) {
        console.log(error);
        console.log(`Error While getting the data`)
    }
})


postrouter.post("/posts", authenticate,  async(req,res)=>{

    const {text,image,createdAt}=req.body;
     const id=req.body.UserId;
    //  console.log(id);
    let find_data=await UserModel.find({_id:id});
    // console.log(find_data)
    try {
        const post_data=new PostModel({text,image,createdAt});
        await post_data.save();
        find_data[0].posts.push(post_data);
        let resp=await find_data[0].save();
        res.status(201).json({"msg":post_data,"msg1":resp})
    } catch (error) {
        console.log(error);
        console.log(`Error while posting the data`);
    }
    

})

postrouter.patch("/posts/:id",authenticate,async(req,res)=>{
    const id=req.params.id;
    const user_id=req.body.UserId;
    const payload=req.body;
    // console.log(id,user_id)
    try {
        let update_post=await PostModel.findByIdAndUpdate({_id:id},payload,{new:true});
        console.log(update_post);

        let update_data=await UserModel.findByIdAndUpdate({_id:user_id},{posts:update_post},{new:true}).populate('posts').exec();
        res.json({"msg":update_post,"msg1":update_data})
        

    } catch (error) {
        console.log(error);
        console.log(`Error while updating the post`)
    }

})


postrouter.delete("/posts/:id",authenticate,async(req,res)=>{
    const id=req.params.id;
    const user_id=req.body.UserId;
    // const payload=req.body;
    // console.log(id,user_id)
    try {
        let update_post=await PostModel.findByIdAndDelete({_id:id},{new:true});
        console.log(update_post);

      let user_Data=await UserModel.find({_id:user_id});

      let store=user_Data[0].posts.filter((ele)=>{
        let idd=ele._id.toString()
        if(idd!=id){
            return ele
        }
        // console.log(idd)
      })
    //   console.log(store);

        let update_data=await UserModel.findByIdAndUpdate({_id:user_id},{posts:store},{new:true}).populate('posts').exec();
        res.json({"msg":update_post,"msg1":update_data})
        

    } catch (error) {
        console.log(error);
        console.log(`Error while DELETING the post`)
    }
})


postrouter.post("/posts/:id/like",authenticate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.body.UserId

    try {
        let post_data=await PostModel.find({_id:id});
        let user_data=await UserModel.find({_id:userId});
        let store=post_data[0].likes.push(userId);
        let update_post=await post_data[0].save();

        console.log(update_post);
        res.json({"likes":update_post})
    } catch (error) {
        console.log(error);
        console.log("Error while updating the likes")
    }
})

postrouter.post("/posts/:id/comment",authenticate,async(req,res)=>{
    const id=req.params.id;
    const userId=req.body.UserId

    try {
        let post_data=await PostModel.find({_id:id});
        let user_data=await UserModel.find({_id:userId});
        let store=post_data[0].comments.push(userId);
        let update_post=await post_data[0].save();
        let update_post1=await post_data[0];
        console.log(update_post);
        res.json({"comments":update_post1})
    } catch (error) {
        console.log(error);
        console.log("Error while updating the comments")
    }
})

module.exports={
    postrouter
}

// {
//     "text":"I am a dancer",
//     "image":"https://via.placeholder.com/350x250",
//     "createdAt":"12-22-2023"
//   }
