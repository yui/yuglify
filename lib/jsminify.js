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
var parser = require('uglify-js').parser,
    uglify = require('uglify-js').uglify;

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
        TOKEN = 'yUglify: preserved comment block',
        reMultiComments = /\/\*![\s\S]*?\*\//g,
        ast;

    try {
        code = code.replace(reMultiComments, function (comment) {
            comments.push(comment);
            var len = comments.length - 1;
            return ';("' + TOKEN + '__' + len + '");';
        });

        config.ascii_only = true; //Force ascii
        ast = parser.parse(code, config.semicolon || false);

        if (config.mangle) {
            ast = uglify.ast_mangle(ast, config);
        }
        if (config.squeeze) {
            ast = uglify.ast_squeeze(ast, config);
        }

        code = uglify.gen_code(ast, config);

        comments.forEach(function(comment, key) {
            var token = '("' + TOKEN + '__' + key + '")',
            REG = [
                new RegExp(token + ',', 'g'),
                new RegExp(',' + token, 'g'),
                new RegExp(',' + token + ',', 'g'),
                new RegExp(token, 'g')
            ];
            
            REG.forEach(function(re) {
                code = code.replace(re, ';\n' + comment + '\n');
            });
        });

        if ((code.substr(code.length - 1) === ')') ||
            (code.substr(code.length - 1) === '}')) {
            code += ';';
        }
        code += '\n';

        callback(null, code);
    } catch (e) {
        callback(e);
    }
};
