import bcrypt from "bcrypt";
import urlMetadata from 'url-metadata';


async function getMetadata(post) {
    const {url, title, image, description} = await urlMetadata(post.url)
    
    const metadata = { title, image, url, description};

    return metadata

}


export async function postsMetadata(lista) {

  for (let i = 0; i < lista.length; i++) {
    lista[i]["metadata"] = (await getMetadata(lista[i]));
  }
  return lista
}