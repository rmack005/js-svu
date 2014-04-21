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
    it('should return error(s) if the object is not valid (exceptions).', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(30);
            },
            lastName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(40);
            },
        });

        var name = {
            firstName: 1,
            lastName: "Doe",
        };

        var result = nameValidator(name);

        expect(validation.isValid(result)).to.equal(false);
        expect(result).to.have.property('firstName');
        expect(result).to.not.have.property('lastName');
    }); 

    it('should return error(s) if the object is not valid (error strings).', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                if(typeof it !== 'string') {
                    return "firstName must be a string.";
                }

                if(typeof it.length === 0) {
                    return "firstName may not be empty.";
                }

                if(typeof it.length >= 30) {
                    return "firstName must contain fewer than 30 characters.";
                }
            },
            lastName: function(it) {
                if(typeof it !== 'string') {
                    return "lastName must be a string.";
                }

                if(typeof it.length === 0) {
                    return "lastName may not be empty.";
                }

                if(typeof it.length >= 40) {
                    return "lastName must contain fewer than 40 characters.";
                }
            }
        });

        var name = {
            firstName: 1,
            lastName: "Doe",
        };

        var result = nameValidator(name);

        expect(validation.isValid(result)).to.equal(false);
        expect(result).to.have.property('firstName');
        expect(result).to.not.have.property('lastName');
    }); 

    it('should support nested validators.', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(30);
            },
            lastName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(40);
            },
        });

        var nameCollectionValidator = validation.create(nameValidator);

        var studentValidator = validation.create({
            name: function(it) {return nameValidator(it);},
            aliases: function(it) {return nameCollectionValidator(it);},
            id: function(it) {
                expect(it).to.be.a('number');
                expect(it).to.be.above(0);
            },
            gpa: function(it) {
                expect(it).to.be.a('number');
                expect(it).to.be.within(0,4);
            },
        });

        var student = {
            name: {
                firstName: 1,
                lastName: "Doe",
            },
            aliases: [
                {firstName: "Johnson", lastName: "Doe"},
                {firstName: "Johnny", lastName: "Doe"}
            ],
            id: "invalidId",
            gpa: 3.4
        };

        var result = studentValidator(student);

        expect(validation.isValid(result)).to.equal(false);
        expect(result).to.have.property('name');
        expect(result).to.have.property('id');
        expect(result).to.not.have.property('aliases');
        expect(result.name).to.have.property('firstName');
        expect(result).to.not.have.property('gpa');
    }); 

    it('should not return error(s) if the object is valid.', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(30);
            },
            lastName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(40);
            },
        });

        var name = {
            firstName: "john",
            lastName: "doe",
        };

        var result = nameValidator(name);

        expect(validation.isValid(result)).to.equal(true);
        expect(result).to.not.have.property('firstName');
        expect(result).to.not.have.property('lastName');
    }); 
});


describe('CollectionValidator Method',function() { 
    it('should return error(s) if the object(s) are not valid.', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(30);
            },
            lastName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(40);
            },
        });

        var nameCollectionValidator = validation.create(nameValidator);

        var nameCollection = [
            {firstName: "john", lastName: "doe"},
            {firstName: "jane", lastName: "doe"},
            {firstName: 5.2, lastName: "doe"}
        ];

        var result = nameCollectionValidator(nameCollection);

        expect(validation.isValid(result)).to.equal(false);

        //  can't rely on result.length because the array may be sparse
        expect(Object.keys(result)).to.have.length(1);
    });    
 });

describe('CollectionValidator Method',function() { 
    it('should support validation of simple types.', function(){
        var stateCollectionValidator = validation.create(function(it) {
            expect(it).to.be.a('string').and.have.length(2);
        });

        var stateCollection = [
            'VA',
            'TX',
            'MA',
            'ZZZ'
        ];

        var result = stateCollectionValidator(stateCollection);

        expect(validation.isValid(result)).to.equal(false);

        //  can't rely on result.length because the array may be sparse
        expect(Object.keys(result)).to.have.length(1);

        stateCollection = [
            'VA',
            'TX',
            'MA'
        ];

        result = stateCollectionValidator(stateCollection);
        expect(validation.isValid(result)).to.equal(true);
    });    
 });

describe('getErrorCollection',function() { 
    it('should return a flat list of errors.', function(){
        var nameValidator = validation.create({
            firstName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(30);
            },
            lastName: function(it) {
                expect(it).to.be.a('string');
                expect(it).to.not.be.empty;
                expect(it).to.have.length.below(40);
            },
        });

        var studentValidator = validation.create({
            name: function(it) {return nameValidator(it);},
            id: function(it) {
                expect(it).to.be.a('number');
                expect(it).to.be.above(0);
            },
            gpa: function(it) {
                expect(it).to.be.a('number');
                expect(it).to.be.within(0,4);
            },
        });

        var student = {
            name: {
                firstName: 1,
                lastName: "Doe",
            },
            id: "invalidId",
            gpa: 3.4
        };

        var result = studentValidator(student);
        var errorCollection = validation.flatten(result);

        expect(validation.isValid(result)).to.equal(false);
        expect(Object.keys(errorCollection)).to.have.length(2);
    }); 
});