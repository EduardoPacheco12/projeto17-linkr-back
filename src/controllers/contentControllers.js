import { getContentData, getTrendingQuery } from "../repositories/contentRepository.js";

export async function redirectToHashtag(req, res) {
  try {
    const page = req.query.page;
    const data = req.params;
    const { rows: response } = await getContentData(data.id, page);
    res.status(200).send(response);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send();
    return;
  }
}

export async function listTopTrends(req, res) {
  try {
    const { rows: response } = await getTrendingQuery()
    res.status(200).send(response);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send();
    return;
  }
}