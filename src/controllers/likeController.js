import { tokenMatch } from '../handlers/tokenHandler.js';
import { likeRepository } from '../repositories/likeRepository.js';

const getLikes = async (req, res) => {
  console.log(req.params)
  const { postId } = req.params;
  try {
    const usersWhoLikes = await likeRepository.getLikesByPostId(postId);
    res.status(200).send(usersWhoLikes.rows);
  } catch (err) {
    console.log(err)
    res.sendStatus(500);
  }
}

const addOrRemoveLike = async (req, res) => {
  const token = req.headers.authorization;
  const user_id = tokenMatch(token)[1]

  const { postId } = req.params;

  try {

    const postExist = await likeRepository.checkPostExist(postId);

    if(postExist.rowCount === 0){
      res.sendStatus(404);
      return;
    }

    const postIsLiked = await likeRepository.checkPostLiked(user_id ,postId);

    if(postIsLiked.rowCount > 0){
      await likeRepository.removeLike(user_id, postId);
      res.sendStatus(200);
      return;
    }
    
    await likeRepository.addLike(user_id , postId);
    res.sendStatus(201);

  } catch (err) {

    res.sendStatus(500);
  }
}

const LikeControllers = { getLikes,addOrRemoveLike };
export default LikeControllers;