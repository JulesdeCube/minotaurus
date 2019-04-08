const fs = require('fs');

class DataBase {
  constructor (path) {
    this.path = path;
    this.database = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!Array.isArray( this.database)) {
      throw "wong database format (it's not a array)"
    }
    
    if (this.database.length < 1) {
      throw "wong database format (it's not header)"
    }
  }
  
  add (line) {
    if(typeof line !== 'object') {
      throw 'it not a object'
    }
    let headerKey = Object.keys(this.database[0]);
    
    if (headerKey.length !== Object.keys(line).length) {
      throw 'there is not the same number of key.input key: ' + JSON.stringify(Object.keys(line)) + ' . header: ' + JSON.stringify(headerKey);
    }
    for (let i = 0; i < headerKey.length; i++) {
      if (!line.hasOwnProperty(headerKey[i])) {
        throw 'there is not the "'+ headerKey[i] + '" key in the input object';
      }
      if (typeof line[headerKey[i]] !== this.database[0][headerKey[i]]) {
        throw 'the "'+ headerKey[i] + '" input is a '+ typeof line[headerKey[i]] + ' and not a ' + this.database[0][headerKey[i]];
      }
    }
    this.database.push(line);
    
    fs.writeFile(this.path, JSON.stringify(this.database), function(err) {
      if(err) {
        console.error(err);
      }
    }); 
  }


  search(key, value) {
    for (let i = 1; i < this.database.length; i++) {
      if (this.database[i][key] === value) {
        return i;        
      }
    }
    return -1;
  }
}



module.exports = DataBase;