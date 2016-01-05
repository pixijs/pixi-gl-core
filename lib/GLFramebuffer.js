
var Texture = require('./GLTexture');

/**
 * Helper class to create a webGL Framebuffer
 *
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext}
 */

var Framebuffer = function(gl, width, height)
{
	this.gl = gl;

	this.framebuffer = gl.createFramebuffer();
	
	this.stencil = null;
	this.texture = null;

	this.width = width || 100;
	this.height = height || 100;
}

Framebuffer.prototype.enableTexture = function(texture)
{
	var gl = this.gl;

	this.texture = texture || new Texture(gl);

	this.texture.bind();

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	this.bind();

	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
}

Framebuffer.prototype.enableStencil = function()
{
	if(this.stencil)return;

	var gl = this.gl;

	this.stencil = gl.createRenderbuffer();
    
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
    
    // TODO.. this is depth AND stencil?
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.width  , this.height );
}

Framebuffer.prototype.clear = function( r, g, b, a )
{
	this.bind();

	var gl = this.gl;
    
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

Framebuffer.prototype.bind = function()
{
	var gl = this.gl;
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );	
}

Framebuffer.prototype.resize = function(width, height)
{
	var gl = this.gl;

	this.width = width;
	this.height = height;

	if ( this.texture )
    {
    	this.texture.bind();
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width, height , 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}

	if ( this.stencil )
    {
        // update the stencil buffer width and height
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
}

Framebuffer.prototype.destroy = function()
{
	var gl = this.gl;
	//TODO
	gl.deleteFramebuffer(this.framebuffer);
}

module.exports = Framebuffer;

