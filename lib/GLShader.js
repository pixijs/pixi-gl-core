
var compileProgram = require('./shader/compileProgram'),
	extractAttributes = require('./shader/extractAttributes'),
	extractUniforms = require('./shader/extractUniforms'),
	generateUniformAccessObject = require('./shader/generateUniformAccessObject');

/**
 * Helper class to create a webGL Shader
 *
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext}
 */
var Shader = function(gl, vertexSrc, fragmentSrc)
{
	this.gl = gl;

	// First compile the program..
	this.program = compileProgram(gl, vertexSrc, fragmentSrc);

	// next extract the attributes
	this.attributes = extractAttributes(gl, this.program); 

    var uniformData = extractUniforms(gl, this.program);

    this.uniforms = generateUniformAccessObject( gl, uniformData );
}

Shader.prototype.bind = function()
{
	this.gl.useProgram(this.program);
}

Shader.prototype.destroy = function()
{
	var gl = this.gl;
}

module.exports = Shader;

