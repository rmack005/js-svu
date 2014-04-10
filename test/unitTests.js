/*
Copyright (c) 2014 Ryan Mack

License (MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var validation = require("../../js-svu");
var expect = require('chai').expect;

describe('Validator',function() { 
    it('should return a function', function(){
    	var result = validation.create({});
		expect(result).to.be.a('function');
    });	
});

describe('CollectionValidator',function() { 
    it('should return a function', function(){
        var validator = validation.create({});
        var result = validation.create(validator);
        expect(result).to.be.a('function');
    }); 
});

describe('Validator Method',function() { 
    it('should return error(s) if the object is not valid.', function(){
        var validator = validation.create({
            field1: function(it) {expect(it).to.equal(1);},
            field2: function(it) {expect(it).to.equal("test");}
        });

        var obj = {
            field1: 1,
            field2: "test1",
        };

        var result = validator(obj);

        expect(validation.isValid(result)).to.equal(false);
        expect(result).to.have.property('field2');
        expect(result).to.not.have.property('field1');
    }); 

    it('should support nested validators.', function(){
        var validator1 = validation.create({
            inner1: function(it) {expect(it).to.equal("test");}
        });

        var validator2 = validation.create({
            field1: function(it) {expect(it).to.equal(1);},
            field2: function(it) {expect(it).to.equal("test");},
            field3: function(it) {return validator1(it);}
        });

        var obj = {
            field1: 1,
            field2: "test1",
            field3: {
                inner1: "test1"
            },
        };

        var result = validator2(obj);

        expect(validation.isValid(result)).to.equal(false);
        expect(result).to.have.property('field2');
        expect(result).to.have.property('field3');
        expect(result.field3).to.have.property('inner1');
        expect(result).to.not.have.property('field1');
    }); 

    it('should not return error(s) if the object is valid.', function(){
        var validator = validation.create({
            field1: function(it) {expect(it).to.equal(1);},
            field2: function(it) {expect(it).to.equal("test");}
        });

        var obj = {
            field1: 1,
            field2: "test",
        };

        var result = validator(obj);

        expect(validation.isValid(result)).to.equal(true);
        expect(result).to.not.have.property('field1');
        expect(result).to.not.have.property('field2');
    }); 
});


describe('CollectionValidator Method',function() { 
    it('should return error(s) if the object(s) are not valid.', function(){
        var myObjectValidator = validation.create({
            id: function(it) {expect(it).to.be.a('number');},
            field1: function(it) {expect(it).to.be.a('number');},
            field2: function(it) {expect(it).to.be.a("string");}
        });

        var myObjectCollectionValidator = validation.create(myObjectValidator);

        var array = [
            {id: 1, field1: 1, field2: "test1"},
            {id: 2, field1: 123, field2: "testing"},
            {id: 3, field1: "test", field2: "$1.23"}
        ];

        var result = myObjectCollectionValidator(array);

        expect(validation.isValid(result)).to.equal(false);

        //  can't rely on result.length because the array may be sparse
        expect(Object.keys(result)).to.have.length(1);
    });    
 });

describe('getErrorCollection',function() { 
    it('should return a flat list of errors.', function(){
        var validator1 = validation.create({
            inner1: function(it) {expect(it).to.equal("test");}
        });

        var validator2 = validation.create({
            field1: function(it) {expect(it).to.equal(1);},
            field2: function(it) {expect(it).to.equal("test");},
            field3: function(it) {return validator1(it);}
        });

        var obj = {
            field1: 1,
            field2: "test1",
            field3: {
                inner1: "test1"
            },
        };

        var result = validator2(obj);
        var errorCollection = validation.getErrorCollection(result);

        expect(validation.isValid(result)).to.equal(false);
        expect(Object.keys(errorCollection)).to.have.length(2);
    }); 
});