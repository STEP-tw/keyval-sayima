const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const contains=function(list,key) {
  return list.find(function(validKey){
    return key==validKey;
  });
}

var StrictParseInfo=function(initialParsingFunction,validKeys,bool) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  this.isCaseSensitive= bool===false?false:true;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(this.isCaseSensitive){
    if(!contains(this.validKeys,this.currentKey))
      throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
    this.parsedKeys[this.currentKey]=this.currentValue;
    this.resetKeysAndValues();
  }else{
    let newValidKey=this.validKeys.map((validKey)=>{return validKey.toLowerCase()});
    let currentKey=this.currentKey.toLowerCase();
    if(!contains(newValidKey,currentKey))
      throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
    this.parsedKeys[this.currentKey]=this.currentValue;
    this.resetKeysAndValues();
  }

}

module.exports=StrictParseInfo;
