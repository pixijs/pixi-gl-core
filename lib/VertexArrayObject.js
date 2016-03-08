
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

	return this;
}

VertexArrayObject.prototype.unbind = function()
{
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(null);
	}

	return this;
}

VertexArrayObject.prototype.activate = function()
{
	var gl = this.gl;

	for (var i = 0; i < this.attributes.length; i++) 
	{
		var attrib = this.attributes[i];
		attrib.buffer.bind();	

		//attrib.attribute.pointer(attrib.type, attrib.normalized, attrib.stride, attrib.start); 
		gl.vertexAttribPointer(attrib.attribute.location,
							   attrib.attribute.size, attrib.type || gl.FLOAT, 
							   attrib.normalized || false, 
							   attrib.stride || 0, 
							   attrib.start || 0);
		
		gl.enableVertexAttribArray(attrib.attribute.location);
	};

	this.indexBuffer.bind();

	return this;
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

	return this;
}


VertexArrayObject.prototype.addIndex = function(buffer, options)
{
    this.indexBuffer = buffer;

    this.dirty = true;

    return this;
}

VertexArrayObject.prototype.clear = function()
{
	// TODO - should this function unbind after clear?
	// for now, no but lets see what happens in the real world!
	if(this.nativeVao)
	{
		this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao);  
	}

	for (var i = 0; i < this.attributes.length; i++) 
	{
		var attrib = this.attributes[i];
		gl.disableVertexAttribArray(attrib.attribute.location);
	};

	this.attributes.length = 0;
	this.indexBuffer = null;
	
	return this;
}

VertexArrayObject.prototype.draw = function(type, size, start)
{
	var gl = this.gl;
	gl.drawElements(type, size, gl.UNSIGNED_SHORT, start || 0);

	return this;
}

