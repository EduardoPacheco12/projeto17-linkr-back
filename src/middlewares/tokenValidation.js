
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


function setSchema(objectData) {
  return "";
}