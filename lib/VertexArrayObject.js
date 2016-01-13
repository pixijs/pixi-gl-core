
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

//	this.nativeVaoExtension = null;

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
}

VertexArrayObject.prototype.unbind = function()
{
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(null);
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
		
		gl.enableVertexAttribArray(attrib.attribute.location);
	};

	this.indexBuffer.bind();
}

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
	})

	this.dirty = true;
}


VertexArrayObject.prototype.addIndex = function(buffer, options)
{
    this.indexBuffer = buffer;

    this.dirty = true;
}



