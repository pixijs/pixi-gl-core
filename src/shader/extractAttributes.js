
var mapType = require('./mapType');
var mapSize = require('./mapSize');

var gl;

/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param _gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the attributes from
 * @return attributes {Object}
 */
var extractAttributes = function(_gl, program)
{
    gl = _gl;

    var attributes = {};

    var totalAttributes = _gl.getProgramParameter(program, _gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < totalAttributes; i++)
    {
        var attribData = _gl.getActiveAttrib(program, i);
        var type = mapType(_gl, attribData.type);

        attributes[attribData.name] = {
            type:type,
            size:mapSize(type),
            location:_gl.getAttribLocation(program, attribData.name),
            //TODO - make an attribute object
            pointer: pointer
        };
    }

    return attributes;
};

var pointer = function(type, normalized, stride, start){
    // console.log(this.location)
    gl.vertexAttribPointer(this.location,this.size, type || gl.FLOAT, normalized || false, stride || 0, start || 0);
};

module.exports = extractAttributes;
