var mapType = require('./mapType');
var defaultValue = require('./defaultValue');

/**
 * Extracts the uniforms
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param program {WebGLProgram} The shader program to get the uniforms from
 * @return uniforms {Object}
 */
var extractUniforms = function(gl, program, locationMapping)
{
	var uniforms = {};

    var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (var i = 0; i < totalUniforms; i++)
    {
    	var uniformData = gl.getActiveUniform(program, i);
    	var name = uniformData.name.replace(/\[.*?\]/, "");
        var type = mapType(gl, uniformData.type );

        var location;
        if (locationMapping && (name in locationMapping))
        {
            location = locationMapping[name];
            gl.bindAttribLocation(program, location, name);
        }
        else
        {
            location = gl.getAttribLocation(program, name);
        }

    	uniforms[name] = {
    		type: type,
    		size: uniformData.size,
    		location: location,
    		value: defaultValue(type, uniformData.size)
    	};
    }

	return uniforms;
};

module.exports = extractUniforms;
