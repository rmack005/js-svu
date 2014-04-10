js-svu
======

A simple object validation utility for javascript inspired by [`Fluent Validation`](http://fluentvalidation.codeplex.com/) 
and [`Mocha`](http://visionmedia.github.io/mocha/).  Combine with your favorite assertion library (I like [Chai](http://chaijs.com/)).

```js
var validation = require("js-svu");

var validator = validation.create({
    field1: function(it) {expect(it).to.equal(1);},
    field2: function(it) {expect(it).to.equal("test");}
});

var obj = {
    field1: 1,
    field2: "test1",
};

var result = validator(obj);
```

__Warning__: this library is still experimental and the API unstable.

## Installation

Using [`npm`](http://npmjs.org/):

```bash
npm install js-svu
```

## Quick Start

First, define a validator.

```js
var validation = require("js-svu");

var validator = validation.create({
    field1: function(it) {expect(it).to.equal(1);},
    field2: function(it) {expect(it).to.equal("test");}
});
```

The above validator ensures that every object it validates has a property 
named "field1" one that's equal to 1, and a property named "field2"
that's equal to "test".

Next, use the validator to validate an object.

```js
var obj = {
    field1: 1,
    field2: "test1",
};

var result = validator(obj);
var isValid = validation.isValid(result)
```

The object above should fail validation (field2 is equal to "test1", not "test").
Examine the result to determine if the object passed validation, and if not why.  
For each property in the object being validated a property with the same name
is added to the result object, but instead of containing a copy of the value
it contains an error message.  The presense of a property in the result object
indicates a problem with the associated property in the validated object.  If a
result object contains no properties, validation succeeded.


## Features

Not written yet.

## Philosophy

Not written yet.

## Examples

Not written yet.