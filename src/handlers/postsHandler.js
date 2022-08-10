import bcrypt from "bcrypt";
import urlMetadata from 'url-metadata';



 export async function postsMetadata(lista) {

  try {
   const {title, image, url, description} = await urlMetadata(lista.url);
   lista["metadata"] = {title, image, url, description};
  } catch (error) {
    console.log(error)
  }
 
  return lista
}