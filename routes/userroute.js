const express = require('express');

const { UserModel } = require('../models/usermodel');

const{authenticate}=require('../middleware/authenticate')


const userrouter = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

require('dotenv').config()


userrouter.get("/users",async(req,res)=>{
    // const {payload}=req.body;
    // console.log(req.body.UserId);
    try {
        const user_data=await UserModel.find();
        res.status(200).json({"msg":user_data})
    } catch (error) {
        console.log(error);
        console.log('Error while getting the data')
    }
})




userrouter.post("/register", async (req, res) => {
    const { name, email, password, dob, bio } = req.body;


    let find_email = await UserModel.find({ email });

    if (find_email.length > 0) {
        return res.json({ "msg": "Email Id Already Exists" })
    }

    try {
        bcrypt.hash(password, 5, async (err, hashed_password) => {
            if (err) {
                console.log(err);
            } else {
                const user_data = new UserModel({ name, email, password: hashed_password, dob, bio });
                await user_data.save();
                res.status(201).json({ "msg": "Successfully Registered The User Data" })
            }
        })


    } catch (error) {
        console.log(error);
        console.log('Error while registering the user')
    }

})


userrouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let find_email = await UserModel.find({ email });
        let hashed_password = find_email[0].password;
        console.log(find_email, hashed_password)
        if (find_email.length > 0) {
            bcrypt.compare(password, hashed_password, async (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    let token = jwt.sign({ UserId: find_email[0]._id }, process.env.key);
                    res.status(201).json({ "msg": "Successfully logged in the user", "toekn": token })
                }
            })
        }

    } catch (error) {
        console.log(error);
        console.log('Error while logging the user')
    }
})

userrouter.get("/users/:id/friends",async(req,res)=>{
    const id=req.params.id
    // const {payload}=req.body;
    // console.log(req.body.UserId);
    try {
        const user_data=await UserModel.find({_id:id});
        console.log(user_data)
        res.status(200).json({"friends":user_data[0].friends})
    } catch (error) {
        console.log(error);
        console.log('Error while getting the data')
    }
})


userrouter.post("/users/:id/friends",authenticate,async(req,res)=>{
    const id=req.params.id;
    const friend_id=req.body.friendId
    // console.log(id,friend_id);

    // const {payload}=req.body;
    // console.log(req.body.UserId);
    try {
        const user_data=await UserModel.find({_id:id});
        const friend_data=await UserModel.find({_id:friend_id})
    //    console.log(user_data,friend_data)
       if(friend_data.length>0){
        friend_data[0].friendRequests.push(id);
        const resp=await friend_data[0].save();
        res.json({"msg":resp})
       }
        
    } catch (error) {
        console.log(error);
        console.log('Error while sending the friend request the data')
    }
})



userrouter.patch("/users/:id/friends/:friendId",authenticate,async(req,res)=>{
    const id=req.params.id;
    const friend_id=req.params.friendId
    // console.log(id,friend_id);

    // const {payload}=req.body;
    // console.log(req.body.UserId);
    
    try {
       const user_data=await UserModel.find({_id:id});
    //    console.log(user_data);

    for(let i=0;i<user_data[0].friendRequests.length;i++){
        let frndreq_id=user_data[0].friendRequests[i];
        let frnd_id=frndreq_id.toString();
        if(frnd_id==friend_id){
            user_data[0].friends.push(frnd_id);
            let resp=await user_data[0].save();
            // res.json({"msg":resp})
        }
     
        let store=user_data[0].friendRequests.filter((ele)=>{
            let fr_id=ele.toString();
            if(fr_id!=friend_id){
              return ele;
            }
        })
        // console.log(store);
        let update_data=await UserModel.findByIdAndUpdate({_id:id},{friendRequests:store},{new:true});
         res.json({"msg":update_data});


        // console.log(frnd_id);
    }
        
    } catch (error) {
        console.log(error);
        console.log('Error while getting the data')
    }
})


module.exports = {
    userrouter
}




// {
//     "name":"nikhil",
//     "email":"nikhil@gmail.com",
//     "password":"nikhil",
//     "dob":"1996",
//     "bio":"I am nikhil"
//   }


// {
  
//     "email":"nikhil@gmail.com",
//     "password":"nikhil"
//   }



// {
  
//     "email":"gunjan@gmail.com",
//     "password":"gunjan"
//   }