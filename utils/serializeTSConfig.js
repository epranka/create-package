const serializeTSConfig = tsconfig => {
  return JSON.stringify(tsconfig, null, 4);
};

module.exports = serializeTSConfig;
