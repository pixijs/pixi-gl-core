
var mapType = require('./mapType');
var mapSize = require('./mapSize');

var extractAttributes = function(gl, program)
{
    var attributes = {};

    var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (var i = 0; i < totalAttributes; i++) 
    {
        var attribData = gl.getActiveAttrib(program, i);
        var type = mapType(gl, attribData.type);

        attributes[attribData.name] = {
            type:type,
            size:mapSize(type),
            location:gl.getAttribLocation(program, attribData.name),
            //TODO - make an attribute object
            pointer:function(type, normalized, stride, start){

             //   console.log(this.location)
                gl.vertexAttribPointer(this.location,this.size, type, normalized, stride, start); 

            }
        }
    };

    return attributes;  
}

module.exports = extractAttributes;

