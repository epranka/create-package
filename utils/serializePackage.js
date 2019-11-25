const converToObject = (package, property) => {
  const arr = package[property];
  package[property] = {};
  for (const obj of arr) {
    for (const key of Object.keys(obj)) {
      package[property][key] = obj[key];
    }
  }
};

const serializePackage = package => {
  const clonedPackage = JSON.parse(JSON.stringify(package));
  converToObject(clonedPackage, "scripts");
  converToObject(clonedPackage, "dependencies");
  converToObject(clonedPackage, "devDependencies");
  converToObject(clonedPackage, "peerDependencies");
  return JSON.stringify(clonedPackage, null, 4);
};

module.exports = serializePackage;
