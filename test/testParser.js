const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};
const expect =require('chai').expect;
console.log(expect);
const chaiassert=require('chai').assert;
const Parser=require(src('index.js')).Parser;
const MissingValueError=require(errors('missingValueError.js'));
const MissingEndQuoteError=require(errors('missingEndQuoteError.js'));
const MissingKeyError=require(errors('missingKeyError.js'));
const MissingAssignmentOperatorError=require(errors('missingAssignmentOperatorError.js'));
const IncompleteKeyValuePairError=require(errors('incompleteKeyValuePairError.js'));

var kvParser;

describe("parse basic key values",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parses an empty string",function(){
    let actual=kvParser.parse("");
    chaiassert.equal(0,actual.length());
  });

  it("parse key=value",function(){
    let actual=kvParser.parse("key=value");
    chaiassert.equal("value",actual.key);
    chaiassert.equal(1,actual.length());
  });

  it("parse when there are leading spaces before key",function(){
    let keyValObj=kvParser.parse(" key=value");
    let expected=new Parser().parse("");
    expected['key']='value';
    chaiassert.deepEqual(keyValObj,expected);

  });

  it("parse when there are spaces after key",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let actual=kvParser.parse("key =value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse when there are spaces before and after key",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let actual=kvParser.parse(" key =value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse when there are spaces before value",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let actual=kvParser.parse("key= value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse when there are spaces after value",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let actual=kvParser.parse("key=value ");
    chaiassert.deepEqual(expected,actual);
  });
});

describe("parse digits and other special chars",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse keys with a single digit",function(){
    let expected=new Parser().parse("");
    expected['1']='value';
    let actual=kvParser.parse("1=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with only multiple digits",function(){
    let expected=new Parser().parse("");
    expected['123']='value';
    let actual=kvParser.parse("123=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with leading 0s",function(){
    let expected=new Parser().parse("");
    expected['0123']='value';
    let actual=kvParser.parse("0123=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with underscores",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={'first_name':"value"};
    let actual=kvParser.parse("first_name=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with a single underscore",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={'_':"value"};
    let actual=kvParser.parse("_=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with multiple underscores",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={'__':"value"};
    let actual=kvParser.parse("__=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with alphabets and digits(digits leading)",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={'0abc':"value"};
    let actual=kvParser.parse("0abc=value");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse keys with alphabets and digits(alphabets leading)",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={'a0bc':"value"};
    let actual=kvParser.parse("a0bc=value");
    chaiassert.deepEqual(expected,actual);
  });
});

describe("multiple keys",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse more than one key",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"value",anotherkey:"anothervalue"};
    let actual=kvParser.parse("key=value anotherkey=anothervalue");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse more than one key when keys have leading spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"value",anotherkey:"anothervalue"};
    let actual=kvParser.parse("   key=value anotherkey=anothervalue");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse more than one key when keys have trailing spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"value",anotherkey:"anothervalue"};
    let actual=kvParser.parse("key  =value anotherkey  =anothervalue");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse more than one key when keys have leading and trailing spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"value",anotherkey:"anothervalue"};
    let actual=kvParser.parse("  key  =value anotherkey  =anothervalue");
    chaiassert.deepEqual(expected,actual);
  });
});

describe("single values with quotes",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("parse a single value with quotes",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"value"};
    let actual=kvParser.parse("key=\"value\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse a single quoted value that has spaces in it",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
      let expected=new Parser().parse("");let expected={key:"va lue"};

    let actual=kvParser.parse("key=\"va lue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse a single quoted value that has spaces in it and leading spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
      let expected=new Parser().parse("");let expected={key:"va lue"};

    let actual=kvParser.parse("key=   \"va lue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse a single quoted value that has spaces in it and trailing spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
      let expected=new Parser().parse("");let expected={key:"va lue"};

    let actual=kvParser.parse("key=\"va lue\"   ");
    chaiassert.deepEqual(expected,actual);
  });
});

describe("multiple values with quotes",function(){
  it("parse more than one value with quotes",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    let expected={key:"va lue",anotherkey:"another value"};
    let actual=kvParser.parse("key=\"va lue\" anotherkey=\"another value\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse more than one value with quotes with leading spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='va lue';
    expected['anotherkey']='another value';
    let actual=kvParser.parse("key= \"va lue\" anotherkey= \"another value\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse more than one value with quotes when keys have trailing spaces",function(){
    let expected=new Parser().parse("");
    expected['key']='va lue';
    expected['anotherkey']='another value';
    let actual=kvParser.parse("key = \"va lue\" anotherkey = \"another value\"");
    chaiassert.deepEqual(expected,actual);
  });
});

describe("mixed values with both quotes and without",function(){
  it("parse simple values with and without quotes",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    let actual=kvParser.parse("key=value anotherkey=\"anothervalue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse simple values with and without quotes and leading spaces on keys",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    let actual=kvParser.parse("   key=value anotherkey=\"anothervalue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse simple values with and without quotes and trailing spaces on keys",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    let actual=kvParser.parse("key  =value anotherkey  =\"anothervalue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse simple values with and without quotes and leading and trailing spaces on keys",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    let expected={key:"value",anotherkey:"anothervalue"};
    let actual=kvParser.parse("  key  =value anotherkey  = \"anothervalue\"");
    chaiassert.deepEqual(expected,actual);
  });

  it("parse simple values with and without quotes(quoted values first)",function(){
    let expected=new Parser().parse("");
    expected['key']='value';
    expected['anotherkey']='anothervalue';
    let actual=kvParser.parse("anotherkey=\"anothervalue\" key=value");
    chaiassert.deepEqual(expected,actual);
  });
});

const errorChecker=function(key,pos,typeOfError) {
    return function(err) {
      if(err instanceof typeOfError && err.key==key && err.position==pos)
        return true;
      return false;
    }
}

describe("error handling",function(){
  beforeEach(function(){
    kvParser=new Parser();
  });

  it("throws error on missing value when value is unquoted",function(){
    try{
      kvParser.parse("key=");
    }catch(e){
      fn=errorChecker("key",3,MissingValueError);
      chaiassert.isOk(fn(e));
    }


 });

  it("throws error on missing value when value is quoted",function(){

    try{
      kvParser.parse("key=\"value");
    }catch(e){
      fn=errorChecker("key",9,MissingEndQuoteError);
      chaiassert.isOk(fn(e));
    }

  });

  it("throws error on missing key",function(){
    try{
      kvParser.parse("=value");
    }catch(e){
      fn=errorChecker(undefined,0,MissingKeyError)
      chaiassert.isOk(fn(e));
    }

  });

  it("throws error on invalid key",function(){
    try{
      kvParser.parse("'foo'=value");
    }catch(e){
      fn=errorChecker(undefined,0,MissingKeyError)
      chaiassert.isOk(fn(e));
    }

  });

  it("throws error on missing assignment operator",function(){
    try{
      kvParser.parse("key value");
    }catch(e){
      fn=errorChecker(undefined,4,MissingAssignmentOperatorError)
      chaiassert.isOk(fn(e));
    }

  });

  it("throws error on incomplete key value pair",function(){
    try{
      kvParser.parse("key");
    }catch(e){
      fn=errorChecker(undefined,2,IncompleteKeyValuePairError);
      chaiassert.isOk(fn(e));
    }

  });

});
