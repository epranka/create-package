const serializeTSConfig = tsconfig => {
  return JSON.stringify(tsconfig, null, 2);
};

module.exports = serializeTSConfig;
