const fs = require('fs');

class DataBase {

  constructor (path) {
    this.path = path;
    let database = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (typeof database !== 'object') {
      throw "wong database format (it's not an object)"
    }

    this.header = database.header;
    if (typeof this.header !== 'object') {
      throw "there not an header"
    }
    
    this.content = database.content;
    if (!Array.isArray(this.content)) {
      throw "the content is not an array"
    }
  }
  
  add (line) {
    if(typeof line !== 'object') { throw 'it not a object'; }

    let headerKey = Object.keys(this.header);
    
    if (headerKey.length !== Object.keys(line).length) {
      throw 'there is not the same number of key.input key: ' + JSON.stringify(Object.keys(line)) + ' . header: ' + JSON.stringify(headerKey);
    }
    for (let i = 0; i < headerKey.length; i++) {
      if (!line.hasOwnProperty(headerKey[i])) {
        throw 'there is not the "'+ headerKey[i] + '" key in the input object';
      }
      if (typeof line[headerKey[i]] !== this.header[headerKey[i]]) {
        throw 'the "'+ headerKey[i] + '" input is a '+ typeof line[headerKey[i]] + ' and not a ' + this.database[0][headerKey[i]];
      }
    }
    this.content.push(line);
    
    this.write();
  }

  write() {
    let file = '{\n' +
               '  "header": ' + JSON.stringify(this.header) + ',\n' +
               '  "content": [\n' 
    this.content.forEach(line => {
      file += '    ' + JSON.stringify(line) + ',\n'
    });
    file = file.slice(0, -2);
    file += '\n  ]\n'+
            '}'


    fs.writeFile(this.path, file, function(err) {
      if(err) {
        console.error(err);
      }
    }); 
  }

  search(key, value) {
    for (let i = 0; i < this.content.length; i++) {
      
      if (this.content[i][key] === value) {
        return i;
      }
    }
    return -1;
  }
}



module.exports = DataBase;