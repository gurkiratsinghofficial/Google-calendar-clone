exports.sendResponse = (obj, res, code) => {
  return res.status(code).send(obj);
};
