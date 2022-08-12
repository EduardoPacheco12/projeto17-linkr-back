import { getContentData } from "../repositories/contentRepository.js"

export async function redirectToHashtag(req, res) {
  try {
    const data = req.params;
    console.log(data);
    const { rows: response } = await getContentData(data.id)
    console.log(response);
    res.status(200).send(response);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send();
    return;
  }
}