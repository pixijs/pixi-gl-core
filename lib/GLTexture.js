
/**
 * Helper class to create a webGL Texture
 *
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext}
 */

var Texture = function(gl)
{
	this.gl = gl;

	this.texture = gl.createTexture();

	// some settings..
	this.mipmap = false;
}

Texture.prototype.upload = function(data)
{
	this.bind();

	var gl = this.gl;

	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);//texture.premultipliedAlpha);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
}

Texture.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
}

Texture.prototype.minFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	if(this.mipmap)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
	}	
}

Texture.prototype.magFilter = function( linear )
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
}

Texture.prototype.enableMipmap = function()
{
	this.bind();

	this.mipmap = true;
	gl.generateMipmap(gl.TEXTURE_2D);
}

Texture.prototype.enableLinearScaling = function()
{
	this.minFilter(true);
	this.magFilter(true);
}

Texture.prototype.enableNearestScaling = function()
{
	this.minFilter(false);
	this.magFilter(false);
}

Texture.prototype.enableWrapClamp = function()
{
	var gl = this.gl;

	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

Texture.prototype.enableWrapRepeat = function()
{
	var gl = this.gl;

	this.bind();
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

Texture.prototype.destroy = function()
{
	var gl = this.gl;
	//TODO
	gl.deleteTexture(this.texture);
}

module.exports = Texture;

