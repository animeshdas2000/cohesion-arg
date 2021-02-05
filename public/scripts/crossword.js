const CrosswordsJS = require('crosswords-js');
const crosswordDefintion = require('./crossword.json');
 
//  Compile the crossword.
try {
  const crosswordModel = CrosswordsJS.compileCrossword(crosswordDefinition);
} catch (err) {
  console.log(`Error compiling crossword: ${err}`);
}

var crosswordDom = new CrosswordsJS.CrosswordsDOM(document, crosswordModel, document.body);