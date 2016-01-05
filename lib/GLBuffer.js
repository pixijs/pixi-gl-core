
/**
 * Helper class to create a webGL buffer
 *
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext}
 */

var EMPTY_ARRAY_BUFFER = new ArrayBuffer(0);

var Buffer = function(gl, type, drawType)
{
	this.gl = gl;

	this.buffer = gl.createBuffer();
	this.type = type || gl.ARRAY_BUFFER;
	this.drawType = drawType || gl.STATIC_DRAW;

	this.data = EMPTY_ARRAY_BUFFER;
}

Buffer.prototype.upload = function(data, offset)
{
	this.bind();

	var gl = this.gl;
	
	data = data || this.data;
	offset = offset || 0;

	if(this.data.byteLength === data.byteLength)
	{
		
		gl.bufferSubData(this.type, offset, data);
	}
	else
	{
		gl.bufferData(this.type, data, this.drawType);
	}

	this.data = data;
}

Buffer.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindBuffer(this.type, this.buffer);
}

Buffer.createVertexBuffer = function(gl)
{
	return new Buffer(gl, gl.ARRAY_BUFFER);
}

Buffer.createIndexBuffer = function(gl)
{
	return new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER);
}

Buffer.create = function(gl, type, drawType)
{
	return new Buffer(gl, type, drawType);
}

//TODO Destroy..

module.exports = Buffer;

