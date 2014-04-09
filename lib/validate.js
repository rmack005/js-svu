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

/*jslint nomen: true, white: true */

var constructApi = function(_) {
	"use strict";

	var tryValidate = function(fn, propertyName, obj)  {
		try {
			var result = fn.apply(obj[propertyName], [propertyName, obj]);

			if ((typeof result !== 'undefined') && (result !== null) && (result === false)) {
				return "'" + obj[propertyName] + "' is not valid.";
			}

			if((typeof result === 'string') || (typeof result === 'object')) {
				return result;
			}

			return null;
		}
		catch(error) {
			return error.toString();
		}
	},


	isResultValid = function(result) {
		return (_.keys(result).length === 0);
	},

	objectValidator = function(validationObject) {
		return function(obj) {
			return _.transform(validationObject, function(result, fn, propertyName) {
					var validationResult = tryValidate(fn, propertyName, obj);

					if((typeof validationResult !== 'undefined') && (validationResult !== null)) {
						result[propertyName] = validationResult;
					}
				});
		};	
	},

	collectionValidator = function(validator) {
		return function(collection) {
			return _.transform(collection, function(result, value, key) {
				var validationResult = validator(value);

				if(!isResultValid(validationResult)) {
					result[key] = validationResult;
				}
			});
		};
	},

	create = function(parameter) {
		if(typeof parameter === 'function') {
			return collectionValidator(parameter);
		}

		return objectValidator(parameter);
	},

	getErrorCollection = function(result, parent) {
		parent = parent || "";

		return _(result)
			.map(function(value, key) {
				if(typeof value === 'string') {
					return {
						property: parent + key,
						message: value
					};
				}
				
				return getErrorCollection(result[key], parent + key + ".");
			})
			.flatten()
			.value();
	};

	return {
		create: create,
		isResultValid: isResultValid,
		getErrorCollection: getErrorCollection
	};
};

if((typeof require === 'function') && (typeof exports === 'object')) {
	var api = constructApi(require('lodash'));
	exports.create = api.create;
	exports.isResultValid = api.isResultValid;
	exports.getErrorCollection = api.getErrorCollection;
}
else if ((typeof window === 'object') && (typeof window._ === 'object')) {
	window.svu = constructApi(window._);
}