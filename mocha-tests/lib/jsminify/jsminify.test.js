
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var module = require('../../../lib/jsminify.js');
var config = module.config;
var jsminify = module.jsminify;
var good = String(fs.readFileSync(path.join(__dirname, 'goodSyntax.js.ignore')));
var goodWithLicense = String(fs.readFileSync(path.join(__dirname, 'goodSyntaxWithLicense.js.ignore')));
var bad = String(fs.readFileSync(path.join(__dirname, 'badSyntax.js.ignore')));

describe('JSminify Unit Tests', function () {
	it('should have a default config object', function () {
		assert.strictEqual(typeof config, 'object');
		assert.strictEqual(typeof config.output, 'object');
		assert.strictEqual(typeof config.compress, 'object');
	});
	it('should have a jsminify function', function () {
		assert.strictEqual(typeof jsminify, 'function');
	});
	it('should minify js code', function (done) {
		jsminify(good, null, function (err, code) {
			if (err) {
				return done(err);
			}
			assert.strictEqual(code, 'var a=function(){return!0}\n');
			done();
		});
	});
	it('should preserve license comments in js code', function (done) {
		jsminify(goodWithLicense, null, function (err, code) {
			if (err) {
				return done(err);
			}

			assert.strictEqual(code, '/*! This is a License Comment\n\t* It should persist through the uglification\n*/\nvar a=function(){return!0}\n');
			done();
		});
	});
	it('should error on bad syntax', function (done) {
		jsminify(bad, null, function (err, code) {
			assert(err, 'Expected an error');
			done();
		});
	});
});