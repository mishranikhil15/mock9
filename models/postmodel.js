const mongoose = require('mongoose');


// {
//     _id: ObjectId,
//     user: { type: ObjectId, ref: 'User' },
//     text: String,
//     image: String,
//     createdAt: Date,
//     likes: [{ type: ObjectId, ref: 'User' }],
//     comments: [{
//       user: { type: ObjectId, ref: 'User' },
//       text: String,
//       createdAt: Date
//     }]
//   }

const PostSchema = mongoose.Schema({
    user: { type: "ObjectId", ref: 'users' },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type: "ObjectId", ref: 'users' }],
    comments: [{
        user: { type: "ObjectId", ref: 'users' },
        text: String,
        createdAt: Date
    }]
})


const PostModel=mongoose.model("posts",PostSchema);

module.exports={
    PostModel
}