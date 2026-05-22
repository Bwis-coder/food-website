const validator = (schema) => {
  console.log("validator reached");
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }
    req.body = result.data;

    next();
  };
};

const searchV = (schema) => {
  console.log("searchValidator reached");
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues[0].message,
      });
    }
    next();
  };

};
export { validator, searchV};
