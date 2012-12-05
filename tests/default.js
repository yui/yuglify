var vows = require('vows'),
    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto'),
    assert = require('assert');

var tests = {
    "require": {
        topic: function() {
            return require('../lib');
        },
        "should have jsmin": function(topic) {
            assert.ok(topic.jsmin);
        },
        "should have cssmin": function(topic) {
            assert.ok(topic.cssmin);
        }
    },
    'comments parser': {
        topic: function() {
            var yuglify = require('../lib'),
                self = this,
                sha = function(data) {
                    var shasum = crypto.createHash('sha1');
                    shasum.update(data);
                    return shasum.digest('hex');
                };
                IN = path.join(__dirname, 'in', 'YUI-2.9.0-raw.js'),
                OUT = path.join(__dirname, 'out', 'YUI-2.9.0-raw-min.js'),
                strings = {
                    raw: sha(fs.readFileSync(IN, 'utf8')),
                    expected: sha(fs.readFileSync(OUT, 'utf8'))
                };


                yuglify.jsmin(fs.readFileSync(IN, 'utf8'), function(err, data) {
                    strings.minned = sha(data);
                    self.callback(null, strings);
                });
        },
        'minned file should be as expected': function(topic) {
            assert.equal(topic.minned, topic.expected);
        },
        'min file should be different than raw': function(topic) {
            assert.notEqual(topic.raw, topic.expected);
        }
    }
};

vows.describe('yUglify').addBatch(tests).export(module);
