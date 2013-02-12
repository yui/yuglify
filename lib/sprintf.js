/**
*
* Basic sprintf implementation for JavaScript. Created for personal learning purposes.
* This implementation has string (%s w/ padding), decimal (%d w/ padding) and object (%(foo)s) support.
*
* @example
* console.log(sprintf('http://%s.%s', 'rinaldi', 'nu')); // http://rinaldi.nu
* console.log(sprintf('%(lorem)s %(ipsum)s', {lorem: 'Lorem', ipsum: 'Ipsum'})); // Lorem Ipsum
* console.log(sprintf('%30s', 'foo')); //                           foo
*
* @author Rafael Rinaldi (rafaelrinaldi.com)
* @since Mar 17, 2010
*
*/

var raw = '',
	buffer = raw,
	args = [],
	BASIC_REGEX = /%[d|s]|%\d+[d|s]/gi,
	COMPLEX_REGEX = /%(\(([\w_\d]+)\))s/gi;

/**
* Fill the buffer with a new entry.
* @method pad
* @param p_match {String} Match.
* @param p_substitution {String} Substitution value.
* @param p_padding {Number} Padding.
* @private
*/
function pad( p_match, p_substitution, p_padding ) {

	/** Tip by Miller Medeiros (millermedeiros.com). **/
	var padding = new Array(p_padding + 1).join(' ');
	
	/** Computes the result to string buffer. **/
	buffer = buffer.replace(p_match, padding + p_substitution);

};

/**
* @method hasBasicFormatter
* @return {Boolean} True if the second parameter is a number or a string, false otherwise.
* @private
*/
function hasBasicFormatter() {
	return (typeof args[1] === 'string' || typeof args[1] === 'number');
};

/**
* @method hasComplexFormatter
* @return {Boolean} True if the second parameter is a pure object, false otherwise.
* @private
*/
function hasComplexFormatter() {
	return (typeof args[1] === 'object');
};

/**
* Process values in the format: %s, %d, %ns and %nd.
* @method resolveBasic
* @private
*/
function resolveBasic() {

	var index = 0,
		matches = raw.match(BASIC_REGEX),
		match,
		substitution,
		padding;

	do {
		match = matches[index];
		substitution = args[index + 1];
		padding = parseInt(match.substring(1, match.length - 1), 10) || 0;

		pad(match, substitution, padding);

		index++;
	}

	while(index < matches.length);

};


/**
* Process values in the format: %(complex)s.
* @method resolveComplex
* @private
*/
function resolveComplex() {

	var index = 0,
		matches = raw.match(COMPLEX_REGEX),
		match,
		id,
		substitution;

	do {
		match = matches[index];
		id = match.substring(2, match.length - 2);
		substitution = args[1][id];

		pad(match, substitution, 0);

		index++;
	}

	while(index < matches.length);

};

/**
* @method sprintf
* @param p_raw {String} String to be sprintfied.
* @return Sprintfied string.
*/
exports.sprintf = function ( p_raw ) {

	raw = p_raw;
	buffer = raw;
	args = arguments;
	
	if(hasBasicFormatter()) {
		resolveBasic();
	} else if(hasComplexFormatter()) {
		resolveComplex();
	}

	return !raw ? null : buffer;

};