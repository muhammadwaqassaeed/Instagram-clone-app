// // controllers/postController.js
// const POST = require("../models/post");
// const mongoose = require("mongoose");

// // Like a post
// const likePost = async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const post = await POST.findById(mongoose.Types.ObjectId(postId));

//         // Rest of your code...
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// };

// // Unlike a post
// const unlikePost = async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const post = await POST.findById(mongoose.Types.ObjectId(postId));

//         // Rest of your code...
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// };

// module.exports = { likePost, unlikePost /* Existing controller functions... */ };
