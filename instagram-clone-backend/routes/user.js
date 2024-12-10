const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST")
const USER = mongoose.model("USER")
const requirelogin = require("../middlewares/requirelogin");


// router.get("/user/:id", (req,res)=>{
//     USER.findOne({_id:req.params.id})
//     .select("-password")
//     .then(user =>{
//         POST.find({postedBy:req.params.id})
//         .populate("postedBy","_id")
//         .exec((err,post)=>{
//             if(err){
//                 return res.status(422).json({error:err})
//             }
//            res.status(200),json({user,post})
//         })
//     }).catch(err=>{
//         return res.status(404).json({error: "User not found"})
//     })
// })

// ROUTER FOR USERPROFILE
router.get("/user/:id", async (req, res) => {
    try {
      const user = await USER.findOne({ _id: req.params.id }).select("-password");
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const posts = await POST.find({ postedBy: req.params.id }).populate("postedBy", "_id");
  
      res.status(200).json({ user, posts });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //ROUTER FOR FOLLOW AND FOLLOWING
//   router.put("/follow", requirelogin, (req,res)=>{
//     USER.findByIdAndUpdate(req.body.followId,{
//         $push:{followers: req.user._id}
//     },{
//         new:true
//     },(err, result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         USER.findByIdAndUpdate(req.user._id,{
//             $push:{following: req.body.followId}

//         },{
//             new:true
//         }).then(result=> res.json(result))
//         .catch(err =>{
//             return res.status(422).json({error:err})
//         })
//     })
//   })

router.put("/follow", requirelogin, async (req, res) => {
    try {
      const updatedFollowedUser = await USER.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id }
        },
        { new: true }
      );
  
      const updatedCurrentUser = await USER.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId }
        },
        { new: true }
      );
  
      res.json(updatedCurrentUser);
    } catch (error) {
      console.error('Error in follow route:', error);
      res.status(422).json({ error: error.message || 'Unexpected error' });
    }
  });
  

  //router for unfollow
//   router.put("/unfollow", requirelogin, (req,res)=>{
//     USER.findByIdAndUpdate(req.body.followId,{
//         $pull:{followers: req.user._id}
//     },{
//         new:true
//     },(err, result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         USER.findByIdAndUpdate(req.user._id,{
//             $pull:{following: req.body.followId}

//         },{
//             new:true
//         }).then(result=> res.json(result))
//         .catch(err =>{
//             return res.status(422).json({error:err})
//         })
//     })
//   })

router.put("/unfollow", requirelogin, async (req, res) => {
    try {
      const updatedUnfollowedUser = await USER.findByIdAndUpdate(
        req.body.followId,
        {
          $pull: { followers: req.user._id }
        },
        { new: true }
      );
  
      const updatedCurrentUser = await USER.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId }
        },
        { new: true }
      );
  
      res.json(updatedCurrentUser);
    } catch (error) {
      console.error('Error in unfollow route:', error);
      res.status(422).json({ error: error.message || 'Unexpected error' });
    }
  });

  //to upload profile pic
//   router.put("/uploadprofilepic", requirelogin,(req,res)=>{
//     USER.findByIdAndUpdate(req.user._id,{
//         $set:{Photo:req.body.pic}
//     },{
//         new:true
//     }).exec((err,result)=>{
//         if(err){
//          return res.status(422).json({error:err})
//         }else{
//             res.json(result)
//         }
//     })
//   })
  
router.put("/uploadprofilepic", requirelogin, async (req, res) => {
    try {
      const result = await USER.findByIdAndUpdate(
        req.user._id,
        {
          $set: { Photo: req.body.pic },
        },
        {
          new: true,
        }
      ).exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });
  
  

module.exports = router;