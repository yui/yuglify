/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var UglifyJS = require('uglify-js');

exports.config = {
    mangle: true,
    output: {
      semicolons: false,
      max_line_len: 6000,
      comments: /^!/,
    },
    compress: {
      hoist_vars: true,
    },
};

exports.jsminify = function (code, config, callback) {
    if (typeof config === 'function') {
        callback = config;
        config = null;
    }
    config = config || exports.config;
    
    var result = UglifyJS.minify(code, config);
    if (result.error) {
      callback(result.error);
    }
    else {
      callback(null, result.code);
    }
};
