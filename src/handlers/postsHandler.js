import bcrypt from "bcrypt";
import urlMetadata from 'url-metadata';


export function getMetadata(listaPosts) {

  urlMetadata(listaPosts)
    .then((e)=>{
     return {listaPosts, e}
  })
    .catch((erro)=>{
    return erro
  })

}