
var Texture = require('./GLTexture');

/**
 * Helper class to create a webGL Framebuffer
 *
 * @class
 * @memberof PIXI.glCore
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 */
var Framebuffer = function(gl, width, height)
{
    /**
     * The current WebGL rendering context
     *
     * @member {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * The frame buffer
     *
     * @member {WebGLFramebuffer}
     */
    this.framebuffer = gl.createFramebuffer();

    /**
     * The stencil buffer
     *
     * @member {WebGLRenderbuffer}
     */
    this.stencil = null;

    /**
     * The stencil buffer
     *
     * @member {PIXI.glCore.GLTexture}
     */
    this.texture = null;

    /**
     * The width of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.width = width || 100;
    /**
     * The height of the drawing area of the buffer
     *
     * @member {Number}
     */
    this.height = height || 100;
};

/**
 * Adds a texture to the frame buffer
 * @param texture {PIXI.glCore.GLTexture}
 */
Framebuffer.prototype.enableTexture = function(texture)
{
    var gl = this.gl;

    this.texture = texture || new Texture(gl);

    this.texture.bind();

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    this.bind();

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.texture, 0);
};

/**
 * Initialises the stencil buffer
 */
Framebuffer.prototype.enableStencil = function()
{
    if(this.stencil)return;

    var gl = this.gl;

    this.stencil = gl.createRenderbuffer();

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);

    // TODO.. this is depth AND stencil?
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencil);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,  this.width  , this.height );


};

/**
 * Erases the drawing area and fills it with a colour
 * @param  r {Number} the red value of the clearing colour
 * @param  g {Number} the green value of the clearing colour
 * @param  b {Number} the blue value of the clearing colour
 * @param  a {Number} the alpha value of the clearing colour
 */
Framebuffer.prototype.clear = function( r, g, b, a )
{
    this.bind();

    var gl = this.gl;

    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * Binds the frame buffer to the WebGL context
 */
Framebuffer.prototype.bind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );
};

/**
 * Unbinds the frame buffer to the WebGL context
 */
Framebuffer.prototype.unbind = function()
{
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null );
};
/**
 * Resizes the drawing area of the buffer to the given width and height
 * @param  width  {Number} the new width
 * @param  height {Number} the new height
 */
Framebuffer.prototype.resize = function(width, height)
{
    var gl = this.gl;

    this.width = width;
    this.height = height;

    if ( this.texture )
    {
        this.texture.uploadData(null, width, height);
    }

    if ( this.stencil )
    {
        // update the stencil buffer width and height
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencil);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    }
};

/**
 * Destroys this buffer
 */
Framebuffer.prototype.destroy = function()
{
    var gl = this.gl;

    //TODO
    if(this.texture)
    {
        this.texture.destroy();
    }

    gl.deleteFramebuffer(this.framebuffer);

    this.gl = null;

    this.stencil = null;
    this.texture = null;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createRGBA = function(gl, width, height, data)
{
    var texture = Texture.fromData(gl, null, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);
    //fbo.enableStencil(); // get this back on soon!

    //fbo.enableStencil(); // get this back on soon!

    fbo.unbind();

    return fbo;
};

/**
 * Creates a frame buffer with a texture containing the given data
 * @static
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param width {Number} the width of the drawing area of the frame buffer
 * @param height {Number} the height of the drawing area of the frame buffer
 * @param data {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} an array of data
 */
Framebuffer.createFloat32 = function(gl, width, height, data)
{
    // create a new texture..
    var texture = new Texture.fromData(gl, data, width, height);
    texture.enableNearestScaling();
    texture.enableWrapClamp();

    //now create the framebuffer object and attach the texture to it.
    var fbo = new Framebuffer(gl, width, height);
    fbo.enableTexture(texture);

    fbo.unbind();

    return fbo;
};

module.exports = Framebuffer;
