const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requirelogin = require("../middlewares/requirelogin");
const POST = mongoose.model("POST")
// const { likePost, unlikePost } = require("../middlewares/likeUnlike");
// const POST = require("../models/post");


// Route
router.get("/allposts", requirelogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => res.json(posts))
        .catch(err => console.log(err))
})

router.post("/createPost", requirelogin, (req, res) => {
    const { body, pic } = req.body;
    if (!body || !pic) {
        return res.status(422).json({ error: " please add all the fields" })
    }
    req.user

    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then((result) => {
        return res.json({ post: result })
    })
        .catch(err => console.log(err))
})

router.get("/myposts", requirelogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id, name")
        .sort("-createdAt")
        .populate("comments.postedBy", "_id name")
        .then(myposts => {
            res.json(myposts)
        })
})

router.put("/comment", requirelogin, async (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, { new: true })
        .populate("comments.postedBy", "_id name ")
        .populate("postedBy", "_id name Photo")
        .exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

// api to delete 
router.delete("/deletePost/:postId", requirelogin, (req, res) => {
    POST.findOne({_id: req.params.postId})
        .populate("postedBy", "_id")
        .exec()
        .then(post => {
            if (!post) {
                return res.status(422).json({error: "Post not found"});
            }

            if (post.postedBy._id.toString() === req.user._id.toString()) {
                // Ensure post is a Mongoose document
                if (post instanceof POST) {
                    return post.deleteOne(); // Assuming remove() is a valid function for your model
                } else {
                    return res.status(500).json({error: "Invalid post object"});
                }
            } else {
                return res.status(401).json({error: "Unauthorized access"});
            }
        })
        .then(result => {
            return res.json({message: "Successfully deleted"});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: "Internal Server Error"});
        });
});

// Route to like a post
router.put("/like", requirelogin, async (req, res) => {
    try {
        // Use await to handle the asynchronous operation (findByIdAndUpdate)
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name Photo")
        .lean().exec();

        // Respond with a JSON object containing success and data properties
        res.json({ success: true, data: result });
    } catch (err) {
        // Handle errors and respond with a JSON object containing success: false and the error message
        res.status(422).json({ success: false, error: err.message });
    }
});

  router.put("/unlike", requirelogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).populate("postedBy", "_id name Photo")
      .lean().exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });
  
  // my following posts
router.get("/myfollowingpost", requirelogin,(req,res)=>{
    POST.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{console.log(err)})
})

module.exports = router
