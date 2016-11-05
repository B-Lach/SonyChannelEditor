const Parser = require('../js/logic/parser.js'),
path = __dirname.replace(/\/html*/, '/resources/sdb.xml'),
parser = new Parser();


parser.parseFile(path).then(function(results) {
  updateHTML(results[1].sorting)
}).catch(function(error) {
  alert(error)
})

function updateHTML(content) {
  for (line of content) {
    document.body.innerHTML = document.body.innerHTML.concat('<br>'+line)
  }
}
