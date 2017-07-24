var http = require("http"); // for the status codes

/* ---------------------------------------------------
   These helpers are used in handlebar files (.hbs).
   --------------------------------------------------- */
var helpers = {
	/* -----------------------------------------------------------
	   General helper to allow more advanced if conditions
	   ----------------------------------------------------------- */
	ifCond: function (v1, operator, v2, options) {
		switch (operator) {
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
		}
	},
	/* ===========================================================
	   Conversion helpers:
	   'decodeURI' 
	   'encodeURI' 
	   =========================================================== */
	decodeURI: function(string) {
		return decodeURI(string);
	},
	encodeURI: function(string) {
		return encodeURI(string);
	},
	/* -----------------------------------------------------------
	   add a description to http response code
	   ----------------------------------------------------------- */
	statusDesc: function(code) {
		if (code) 
			return code+" - "+http.STATUS_CODES[code];
		else
			return 'unknown';
	},
	/* -----------------------------------------------------------
	   the category for a given http response code
	   ----------------------------------------------------------- */
	statusCategory: function(code) {
		if (code >= 200 && code < 300)  
			return 'success';
		else if (code >= 300 && code < 400)  
			return 'warning';
		else
			return 'error';
	}
}

module.exports = helpers;
