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
## License

${licenseContent}
`;
};

module.exports = createREADME;
