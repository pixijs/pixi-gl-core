
var mapType = require('./mapType');
var mapSize = require('./mapSize');

/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the attributes from
 * @return attributes {Object}
 */
var extractAttributes = function(gl, program)
{
    var attributes = {};

    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (var i = 0; i < totalAttributes; i++)
    {
        var attribData = gl.getActiveAttrib(program, i);
        var name = attribData.name.replace(/\[.*?\]/, "");
        var type = mapType(gl, attribData.type);
        var array = attribData.name.indexOf('[') > 0;

        attributes[name] = {
            type: type,
            size: mapSize(type),
            array: array,
            location: gl.getAttribLocation(program, name),
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
