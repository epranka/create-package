const createREADME = ({ name, description, author, email, licenseContent }) => {
  const authorBlock = [];
  if (author) {
    authorBlock.push(author);
  }
  if (email) {
    authorBlock.push(`[${email}](mailto:${email})`);
  }

  return `# ${name}

${description}

## Install

\`\`\`
npm install --save ${name}
\`\`\`

or

\`\`\`
yarn install ${name}
\`\`\`

## Import module

## Usage

${
  authorBlock.length
    ? `## Author
    
${authorBlock.join("\n\n")}
`
    : ""
}
## Build

\`\`\`
npm run build // for single build

npm run watch // to watch changes
\`\`\`

or

\`\`\`
yarn build // for single build

yarn watch // to watch changes
\`\`\`


## License

${licenseContent}
`;
};

module.exports = createREADME;
