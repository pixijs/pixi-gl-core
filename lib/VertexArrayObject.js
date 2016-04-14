
// state object//
var setVertexAttribArrays = require( './setVertexAttribArrays' );

/**
 * Helper class to work with WebGL VertexArrayObjects (vaos)
 * Only works if WebGL extensions are enabled (they usually are)
 *
 * @class
 * @memberof pixi.gl
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 */
function VertexArrayObject(gl, state)
{

	this.nativeVaoExtension = (
      gl.getExtension('OES_vertex_array_object') ||
      gl.getExtension('MOZ_OES_vertex_array_object') ||
      gl.getExtension('WEBKIT_OES_vertex_array_object')
    );

	this.nativeState = state;

	if(this.nativeVaoExtension)
	{
		this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();
		
		var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		
		// VAO - overwrite the state..
		this.nativeState = {
            tempAttribState: new Array(maxAttribs),
			attribState: new Array(maxAttribs)
        };
	}

	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	this.gl = gl;

	/**
	 * An array of attributes ? @mat
	 *
	 * @member {Array}
	 */
	this.attributes = [];

	/**
	 * @mat
	 *
	 * @member {Array}
	 */
	this.indexBuffer = null;

	/**
	 * A boolean flag
	 *
	 * @member {Boolean}
	 */
	this.dirty = false;
}

VertexArrayObject.prototype.constructor = VertexArrayObject;
module.exports = VertexArrayObject;


/**
 * Binds the buffer
 */
VertexArrayObject.prototype.bind = function()
{
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);

		if(this.dirty)
		{
			this.dirty = false;
			this.activate();
		}
	}
	else
	{
		
		this.activate();
	}

	return this;
};

/**
 * Unbinds the buffer
 */
VertexArrayObject.prototype.unbind = function()
{
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(null);
	}

	return this;
};

/**
 * Uses this vao
 */
VertexArrayObject.prototype.activate = function()
{
	
	var gl = this.gl;
	var lastBuffer = null;

	for (var i = 0; i < this.attributes.length; i++)
	{
		var attrib = this.attributes[i];

		if(lastBuffer !== attrib.buffer)
		{
			attrib.buffer.bind();
			lastBuffer = attrib.buffer;
		}

		//attrib.attribute.pointer(attrib.type, attrib.normalized, attrib.stride, attrib.start);
		gl.vertexAttribPointer(attrib.attribute.location,
							   attrib.attribute.size, attrib.type || gl.FLOAT,
							   attrib.normalized || false,
							   attrib.stride || 0,
							   attrib.start || 0);


	}

	setVertexAttribArrays(gl, this.attributes, this.nativeState);
	
	this.indexBuffer.bind();

	return this;
};

/**
 *
 * @param buffer     {WebGLBuffer}
 * @param attribute  {[type]}
 * @param type       {[type]}
 * @param normalized {[type]}
 * @param stride     {Number}
 * @param start      {Number}
 */
VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, normalized, stride, start)
{
    this.attributes.push({
    	buffer: 	buffer,
    	attribute: 	attribute,

    	location: 	attribute.location,
	 	type: 		type || this.gl.FLOAT,
	 	normalized: normalized || false,
	 	stride: 	stride || 0,
	 	start: 		start || 0
	});

	this.dirty = true;

	return this;
};

/**
 *
 * @param buffer   {WebGLBuffer}
 * @param options  {Object}
 */
VertexArrayObject.prototype.addIndex = function(buffer, options)
{
    this.indexBuffer = buffer;

    this.dirty = true;

    return this;
};

/**
 * Unbinds this vao and disables it
 */
VertexArrayObject.prototype.clear = function()
{
	var gl = this.gl;

	// TODO - should this function unbind after clear?
	// for now, no but lets see what happens in the real world!
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);
	}

	this.attributes.length = 0;
	this.indexBuffer = null;

	return this;
};

/**
 * @mat
 * @param type  {Number}
 * @param size  {Number}
 * @param start {Number}
 */
VertexArrayObject.prototype.draw = function(type, size, start)
{
	var gl = this.gl;
	gl.drawElements(type, size, gl.UNSIGNED_SHORT, start || 0);

	return this;
};

/**
 * Destroy this vao
 */
VertexArrayObject.prototype.destroy = function()
{
	// lose references
	this.gl = null;
	this.indexBuffer = null;
	this.attributes = null;
	this.nativeState = null;

	if(this.nativeVao)
	{
		this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao);
	}

	this.nativeVaoExtension = null;
	this.nativeVao = null;
};
