import  {tokenMatch} from "../handlers/tokenHandler.js";

const schema = {
  // joi validations go here
};

export default async function validateEntry(req, res, next) {
  const validationData = res.locals.cleanData;
  
  for (const index in validationData) {
    try {
      const schema = schemas[setSchema(validationData[index])];
      const response = await schema.validateAsync(validationData[index], {
        abortEarly: false,
      });
      res.locals.dbData = Object.entries(response);
    } catch (err) {
      const errMessage = err.details.map((res) =>
        res.message
          .replaceAll('"', "")
          .replace(
            "confirmPassword must be [ref:password]",
            "password does not match"
          )
      );
      res.status(422).send(errMessage);
      return;
    }
  }
  next();
}

export function tokenValidate(req, res, next){
  const token = req.headers.authorization;
  const user_id = tokenMatch(token)[1]

  if(!tokenMatch(token)) { 
    return res.sendStatus(401)
  }

  res.locals.id = user_id;
  next();
}

function setSchema(objectData) {
  return "";
}