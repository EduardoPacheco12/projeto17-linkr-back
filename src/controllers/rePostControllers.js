import { rePostRepository } from "../repositories/rePostRepository.js";
import {likeRepository} from '../repositories/likeRepository.js'


const getRePosts = async (req, res) => {
  const {postId} = req.params;
  const userId = res.locals.userId;
  try {
    const rePosts = await rePostRepository.countRePost(postId);

    
    res.status(200).send(rePosts.rows);
  } catch (err) {
    console.log(err)
    res.sendStatus(500);
  }
}

const makeRePost = async (req, res) => {
  const userId = res.locals.userId;
  console.log("usreId", userId)

  const { postId } = req.params;

  try {
    
    const postExist = await likeRepository.checkPostExist(postId);

    if(postExist.rowCount === 0){
      res.sendStatus(404);
      return;
    }
    const postIsPosted = await rePostRepository.checkRePost(postId, userId);

    if(postIsPosted.rowCount > 0){
      await rePostRepository.deleteRePost(postId, userId);
      res.sendStatus(200);
      return;
    }
    
    await rePostRepository.insertRePost(postId, userId);
    res.sendStatus(201);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

const rePostControllers = { getRePosts,makeRePost };

export default rePostControllers;