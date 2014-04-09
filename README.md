js-svu
======

A simple object validation utility for javascript

```js
var validation = require("js-svu");

var validator = validation.create({
    field1: function() {expect(this).to.equal(1);},
    field2: function() {expect(this).to.equal("test");}
});

var obj = {
    field1: 1,
    field2: "test1",
};

var result = validator(obj);
```