js-svu
======

A simple object validation utility for javascript inspired by [`Fluent Validation`](http://fluentvalidation.codeplex.com/) 
and [`Mocha`](http://visionmedia.github.io/mocha/).  Combine with your favorite assertion library (I like [`Chai`](http://chaijs.com/)).

__Warning__: this library is still experimental and the API unstable.

```js
var validation = require("js-svu");
var expect = require('chai').expect;

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
```

## Installation

Using [`npm`](http://npmjs.org/):

```bash
npm install js-svu
```

Note: js-svu currently depends on lodash.  And is best used with an asertion library of some sort.

## Quick Start

First, define a validator.

```js
var validation = require("js-svu");
var expect = require('chai').expect;

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
    }
});
```

The above validator ensures that every object it validates has a property 
named "firstName" that's a non-empty string whose length is less than 30, 
and a property named "lastName" that's a non-empty string whose length is less than 40.
The above example validator makes use of Chai's expect API which throws exceptions (that js-svu handles),
but one could also simply return a string (an error message) to indicate failure.

```js
var validation = require("js-svu");

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
```

Next, use the validator to validate an object.

```js
var name = {
    firstName: 1,
    lastName: "Doe",
};

var result = nameValidator(name);
var isValid = validation.isValid(result)
```

Examine the result to determine if the object passed validation, and if not why (
the object above should fail validation since firstName is not a string). For 
each property in the object being validated a property with the same name
is added to the result object, but instead of containing a copy of the value
it contains an error message.  

```js
result.firstName === "Some error message about the type being wrong.";
```

The presense of a property in the result object
indicates a problem with the associated property in the validated object.  If a
result object contains no properties, all properties are valid (a valid object).

You can also flatten the result object into a simple collection of error messages.

```js
var errorCollection = validation.flatten(result);
```

Which will be empty if no of the validations failed.  And for more complex objects 
with properties whose values are objects themselves, validation can be delegated to 
other validators.

```js
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
result.name.firstName === "Some error message about the type being wrong.";
result.id === "Some error message about the type being wrong.";
```

## Philosophy

The basic philosophy behind the utility is that validators should be written in terms
closly related to the objects being validated, and that the results should also be 
reported in terms closely related to those objects.  In pratice this 
means that each property in an object should have an associated property in 
the validator that contains the function that validates the value, and an associated
property in the result (if it fails validation) that contains the error message.

## Examples

Not written yet.