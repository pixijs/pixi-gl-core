
var setVertexAttribArrays = require('./setVertexAttribArrays');

/**
 * Generic Mask Stack data structure
 * @class
 * @memberof PIXI
 */

// state object//


function VertexArrayObject(gl)
{
	
	this.nativeVaoExtension = (
      gl.getExtension('OES_vertex_array_object') ||
      gl.getExtension('MOZ_OES_vertex_array_object') ||
      gl.getExtension('WEBKIT_OES_vertex_array_object')
    );


	if(this.nativeVaoExtension)
	{
		this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();  
	}

	this.gl = gl;

	this.attributes = [];

	this.indexBuffer = null;

	this.dirty = false;

	
}

VertexArrayObject.prototype.constructor = VertexArrayObject;
module.exports = VertexArrayObject;

VertexArrayObject.prototype.update = function()
{
	this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);  
   
	this.activate();

	this.nativeVaoExtension.bindVertexArrayOES(null);  
}

VertexArrayObject.prototype.bind = function()
{
	if(this.nativeVao)
	{
		if(this.dirty)
		{
			this.dirty = false;
			this.update();
		}

		this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);  
	}
	else
	{
		this.activate();
	}
}

VertexArrayObject.prototype.activate = function()
{
	var gl = this.gl;

	for (var i = 0; i < this.attributes.length; i++) 
	{
		var attrib = this.attributes[i];
		attrib.buffer.bind();	

		attrib.attribute.pointer(attrib.type, attrib.normalized, attrib.stride, attrib.start); 
	};

	setVertexAttribArrays(gl, this.attributes);

	this.indexBuffer.bind();
}

VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, stride, normalized, start)
{
    this.attributes.push({
    	buffer: 	buffer,
    	attribute: 	attribute,

    	location: 	attribute.location,
	 	type: 		type || this.gl.FLOAT,
	 	stride: 	stride || 0,
	 	normalized: normalized || false,
	 	start: 		start || 0
	})

	this.dirty = true;
}


VertexArrayObject.prototype.addIndex = function(buffer, options)
{
    this.indexBuffer = buffer;

    this.dirty = true;
}



