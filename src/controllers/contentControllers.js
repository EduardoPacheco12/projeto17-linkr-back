import { getContentData } from "../repositories/contentRepository.js"

export async function redirectToHashtag(req, res) {
  try {
    const data = 'blah';
    const { rows: response } = await getContentData({ data })
    res.status(200).send(response);
    return;
  } catch (err) {
    res.status(400).send('no');
    return;
  }
}

export async function createHashtag(req, res) {
  try {
    const data = 'blah';
    const { rows: response } = await getContentData({ data })
    res.status(200).send(response);
    return;
  } catch (err) {
    res.status(400).send('no');
    return;
  }
}