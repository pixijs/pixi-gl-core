/**
 * Extracts the attributes
 * @class
 * @memberof PIXI.glCore.shader
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 * @param uniforms {Array} @mat ?
 * @return attributes {Object}
 */
var generateUniformAccessObject = function(gl, uniformData)
{
    // this is the object we will be sending back.
    // an object hierachy will be created for structs
    var uniforms = {data:{}};

    uniforms.gl = gl;

    var uniformKeys= Object.keys(uniformData);

    for (var i = 0; i < uniformKeys.length; i++)
    {
        var fullName = uniformKeys[i];

        var nameTokens = fullName.split('.');
        var name = nameTokens[nameTokens.length - 1];


        var uniformGroup = getUniformGroup(nameTokens, uniforms);

        var uniform =  uniformData[fullName];
        uniformGroup.data[name] = uniform;

        uniformGroup.gl = gl;

        Object.defineProperty(uniformGroup, name, {
            get: generateGetter(name),
            set: generateSetter(name, uniform)
        });
    }

    return uniforms;
};

var generateGetter = function(name)
{
	var template = getterTemplate.replace('%%', name);
    return function() {
        return this.data[name].value;
    };
};

var glslSetSingle = function glslSetSingle(location, type, value) {
    switch(uniform.type) {
        case 'float':
            uniform1f(location, value);
            break;
        case 'vec2':
            uniform2f(location, value[0], value[1]);
            break;
        case 'vec3':
            uniform3f(location, value[0], value[1], value[2]);
            break;
        case 'vec4':
            uniform4f(location, value[0], value[1], value[2], value[3]);
            break;
        case 'int':
            uniform1i(location, value);
            break;
        case 'ivec2':
            uniform2i(location, value[0], value[1]);
            break;
        case 'ivec3':
            uniform3i(location, value[0], value[1], value[2]);
            break;
        case 'ivec4':
            uniform4i(location, value[0], value[1], value[2], value[3]);
            break;
        case 'bool':
            uniform1i(location, value);
            break;
        case 'bvec2':
            uniform2i(location, value[0], value[1]);
            break;
        case 'bvec3':
            uniform3i(location, value[0], value[1], value[2]);
            break;
        case 'bvec4':
            uniform4i(location, value[0], value[1], value[2], value[3]);
            break;

        case 'mat2':
            uniformMatrix2fv(location, false, value);
            break;
        case 'mat3':
            uniformMatrix3fv(location, false, value);
            break;
        case 'mat4':
            uniformMatrix4fv(location, false, value);
            break;
        case 'sampler2D':
            uniform1i(location, value);
            break;
    }
};

var glslSetArray = function glslSetArray(location, type, value) {
    switch(type) {
        case 'float':
            uniform1fv(location, value);
            break;
        case 'vec2':
            uniform2fv(location, value);
            break;
        case 'vec3':
            uniform3fv(location, value);
            break;
        case 'vec4':
            uniform4fv(location, value);
            break;
        case 'int':
            uniform1iv(location, value);
            break;
        case 'ivec2':
            uniform2iv(location, value);
            break;
        case 'ivec3':
            uniform3iv(location, value);
            break;
        case 'ivec4':
            uniform4iv(location, value);
            break;
        case 'bool':
            uniform1iv(location, value);
            break;
        case 'bvec2':
            uniform2iv(location, value);
            break;
        case 'bvec3':
            uniform3iv(location, value);
            break;
        case 'bvec4':
            uniform4iv(location, value);
            break;
        case 'sampler2D':
            uniorm1iv(location, value);
            break;
    }
};

var generateSetter = function(name, uniform)
{
    return function(value) {
        this.data[name].value = value;
        var location = this.data[name].location;
        if (uniform.size === 1)
        {
            glslSetSingle(location, uniform.type, value);
        }
        else
        {
            glslSetArray(location, uniform.type, value);
        }
    };
};

var getUniformGroup = function(nameTokens, uniform)
{
    var cur = uniform;

    for (var i = 0; i < nameTokens.length - 1; i++)
    {
        var o = cur[nameTokens[i]] || {data:{}};
        cur[nameTokens[i]] = o;
        cur = o;
    }

    return cur;
};


module.exports = generateUniformAccessObject;
