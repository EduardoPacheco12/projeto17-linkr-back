
export default function trendSelector(req, res, next) {
  const data = req.body;
  if(data.description?.length === 0) {
    next();
  }
  const tagRegex = /#\b[a-zA-Z0-9]{1,}/gm;
  const result = [...data.description?.matchAll(tagRegex)];
  if(result.length > 0) {
    res.locals.trendsArray = result.join().replaceAll("#","").split(",");
  }
  next();
}