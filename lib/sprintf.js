/**
*
* Basic sprintf implementation for JavaScript. Created for personal learning purposes.
* This implementation has string (%s w/ padding), decimal (%d w/ padding) and object (%(foo)s) support.
* 
* @example
* console.log(sprintf("http://%s.%s", "rinaldi", "nu")); // http://rinaldi.nu
* console.log(sprintf("%(lorem)s %(ipsum)s", {lorem: "Lorem", ipsum: "Ipsum"})); // Lorem Ipsum
* console.log(sprintf("%30s", "foo")); //                           foo
*
* @author Rafael Rinaldi (rafaelrinaldi.com)
* @since Mar 17, 2010
*
*/
exports.sprintf = function ( p_raw ) {

	var raw = p_raw,
		buffer,
		args = arguments,
		BASIC_REGEX = /%[d|s]|%\d+[d|s]/gi,
		COMPLEX_REGEX = /%(\(([\w_\d]+)\))s/gi;

	buffer = p_raw;

	/**
	*
	* Fill the buffer with a new entry.
	*
	* @param p_match Match.
	* @param p_substitution Substitution value.
	* @param p_padding Padding.
	*
	**/
	function pad( p_match, p_substitution, p_padding ) {

		/** Tip by Miller Medeiros (millermedeiros.com). **/
		var padding = new Array(p_padding + 1).join(" ");
		
		/** Computes the result to string buffer. **/
		buffer = buffer.replace(p_match, padding + p_substitution);

	}

	/**
	* @return True if the second parameter is a number or a string, false otherwise.
	*/
	function hasBasicFormatter() {
		return (typeof args[1] === "string" || typeof args[1] === "number");
	}

	/**
	* @return True if the second parameter is a pure object, false otherwise.
	*/
	function hasComplexFormatter() {
		return (typeof args[1] === "object");
	}

	/** Process values in the format: %s, %d, %ns and %nd. **/
	function processBasic() {

		var index = 0,
			matches = raw.match(BASIC_REGEX),
			match,
			substitution,
			padding;

		do {
			match = matches[index];
			substitution = args[index + 1];
			padding = parseInt(match.substring(1, match.length - 1)) || 0;

			pad(match, substitution, padding);

			index++;
		}

		while(index < matches.length);

	}

	/** Process values in the format: %(complex)s. **/
	function processComplex() {

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

	}

	if(hasBasicFormatter()) {
		processBasic();
	} else if(hasComplexFormatter()) {
		processComplex();
	}

	return !raw ? null : buffer;

};