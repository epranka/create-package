const serializeBabelRC = babelrc => {
  return JSON.stringify(babelrc, null, 2);
};

module.exports = serializeBabelRC;
