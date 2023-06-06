const mongoose=require('mongoose');

// {
//     _id: ObjectId,
//     name: String,
//     email: String,
//     password: String,
//     dob: Date,
//     bio: String,
//     posts: [{ type: ObjectId, ref: 'Post' }],
//     friends: [{ type: ObjectId, ref: 'User' }],
//     friendRequests: [{ type: ObjectId, ref: 'User' }]
//   }

const UserSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    dob:Date,
    bio:String,
    posts:[{type:"ObjectId", ref:'posts'}],
    friends:[{type:"ObjectId", ref:'users'}],
    friendRequests: [{ type: "ObjectId", ref: 'users' }]
})


const UserModel=mongoose.model("users",UserSchema);

module.exports={
    UserModel
}