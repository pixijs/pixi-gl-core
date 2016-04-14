
var compileProgram = require('./shader/compileProgram'),
	extractAttributes = require('./shader/extractAttributes'),
	extractUniforms = require('./shader/extractUniforms'),
	generateUniformAccessObject = require('./shader/generateUniformAccessObject');

/**
 * Helper class to create a webGL Shader
 *
 * @class
 * @memberof pixi.gl
 * @param gl {WebGLRenderingContext}
 * @param vertexSrc {string|string[]} The vertex shader source as an array of strings.
 * @param fragmentSrc {string|string[]} The fragment shader source as an array of strings.
 */
var Shader = function(gl, vertexSrc, fragmentSrc)
{
	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;

	/**
	 * The shader program
	 *
	 * @member {WebGLProgram}
	 */
	// First compile the program..
	this.program = compileProgram(gl, vertexSrc, fragmentSrc);


	/**
	 * The attributes of the shader as an object containing the following properties
	 * {
	 * 	type,
	 * 	size,
	 * 	location,
	 * 	pointer
	 * }
	 * @member {Object}
	 */
	// next extract the attributes
	this.attributes = extractAttributes(gl, this.program);

    var uniformData = extractUniforms(gl, this.program);

	/**
	 * The uniforms of the shader as an object containing the following properties
	 * {
	 * 	gl,
	 * 	data
	 * }
	 * @member {Object}
	 */
    this.uniforms = generateUniformAccessObject( gl, uniformData );
};
/**
 * Uses this shader
 */
Shader.prototype.bind = function()
{
	this.gl.useProgram(this.program);
};

/**
 * Destroys this shader
 * TODO
 */
Shader.prototype.destroy = function()
{
	var gl = this.gl;
};

module.exports = Shader;
