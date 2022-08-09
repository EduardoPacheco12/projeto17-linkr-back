import { stripHtml } from "string-strip-html";

export default function clearData(req, res, next) {
  const data = res.locals.reqData;
  const output = [...data];
  for(let i = 0; i < data.length; i++) {
    for (const param in data[i]) {
      if (typeof output[i][param] === "string") {
        output[i][param] = stripHtml(data[i][param]).result.trim();
      }
    }
  }
  res.locals.cleanData = output;
  next();
};