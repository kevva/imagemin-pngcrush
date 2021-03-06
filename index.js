'use strict';
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const pngcrush = require('pngcrush-bin');

module.exports = options => buf => {
	options = {...options};

	if (!Buffer.isBuffer(buf)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

	if (!isPng(buf)) {
		return Promise.resolve(buf);
	}

	const args = [
		'-brute',
		'-force',
		'-q'
	];

	if (options.reduce) {
		args.push('-reduce');
	} else {
		args.push('-noreduce');
	}

	args.push(execBuffer.input, execBuffer.output);

	return execBuffer({
		input: buf,
		bin: pngcrush,
		args
	}).catch(error => {
		error.message = error.stderr || error.message;
		throw error;
	});
};
