/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*
 * The comment/license workaround is based on the Ender workaround here:
 * https://github.com/ender-js/Ender/blob/76961673be2a29e893d8d3dc9b97e3faf8b169a6/lib/ender.file.js#L25-58
 * Ender is licensed under MIT - copyright 2012 Dustin Diaz & Jacob Thornton
 * http://ender.no.de/
*/

var UglifyJS = require('uglify-js');

exports.config = {
    mangle: true,
    squeeze: true,
    semicolon: false,
    lift_vars: true,
    mangle_toplevel: true,
    no_mangle_functions: true,
    max_line_length: 6000
};

exports.jsminify = function (code, config, callback) {
    if (typeof config === 'function') {
        callback = config;
        config = exports.config;
    }
    config = config || exports.config;
    var comments = [],
        // trick UglifyJS.minify to preserve the token by assigning it to a variable
        token = 'a="yUglify: preserved comment block"',
        reMultiComments = /\/\*![\s\S]*?\*\//g,
        /*
            In some cases Uglify adds a comma, in others it doesn't
            So we have to process the tokens twice, first with the comma
            then without it to catch both cases and to be clear about it.
        */
        reTokens1 = new RegExp(token + ',', 'g'),
        reTokens = new RegExp(token, 'g');

    try {
        code = code.replace(reMultiComments, function (comment) {
            comments.push(comment);
            return ';' + token + ';';
        });

        config.ascii_only = true; // Force ascii
        config.fromString = true; // Force from string

        code = UglifyJS.minify(code, config).code;

        //First pass with comma (comment inside code somewhere)
        code = code.replace(reTokens1, function () {
            return '\n' + comments.shift() + '\n';
        });

        //Second pass without the comma to catch normal comments
        code = code.replace(reTokens, function () {
            return '\n' + comments.shift() + '\n';
        });

        if ((code.substr(code.length - 1) === ')') ||
            (code.substr(code.length - 1) === '}')) {
            code += ';';
        }

        //Trim spaces at the beginning of the code
        code = code.replace(/^\s+/, '');

        code += '\n';

        callback(null, code);
    } catch (e) {
        callback(e);
    }
};
