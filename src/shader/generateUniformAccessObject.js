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
    return function() {
        return this.data[name].value;
    };
};

var glslSetSingle = function glslSetSingle(gl, location, type, value) {
    switch(type) {
        case 'float':
            gl.uniform1f(location, value);
            break;
        case 'vec2':
            gl.uniform2f(location, value[0], value[1]);
            break;
        case 'vec3':
            gl.uniform3f(location, value[0], value[1], value[2]);
            break;
        case 'vec4':
            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            break;
        case 'int':
            gl.uniform1i(location, value);
            break;
        case 'ivec2':
            gl.uniform2i(location, value[0], value[1]);
            break;
        case 'ivec3':
            gl.uniform3i(location, value[0], value[1], value[2]);
            break;
        case 'ivec4':
            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            break;
        case 'bool':
            gl.uniform1i(location, value);
            break;
        case 'bvec2':
            gl.uniform2i(location, value[0], value[1]);
            break;
        case 'bvec3':
            gl.uniform3i(location, value[0], value[1], value[2]);
            break;
        case 'bvec4':
            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            break;

        case 'mat2':
            gl.uniformMatrix2fv(location, false, value);
            break;
        case 'mat3':
            gl.uniformMatrix3fv(location, false, value);
            break;
        case 'mat4':
            gl.uniformMatrix4fv(location, false, value);
            break;
        case 'sampler2D':
            gl.uniform1i(location, value);
            break;
    }
};

var glslSetArray = function glslSetArray(gl, location, type, value) {
    switch(type) {
        case 'float':
            gl.uniform1fv(location, value);
            break;
        case 'vec2':
            gl.uniform2fv(location, value);
            break;
        case 'vec3':
            gl.uniform3fv(location, value);
            break;
        case 'vec4':
            gl.uniform4fv(location, value);
            break;
        case 'int':
            gl.uniform1iv(location, value);
            break;
        case 'ivec2':
            gl.uniform2iv(location, value);
            break;
        case 'ivec3':
            gl.uniform3iv(location, value);
            break;
        case 'ivec4':
            gl.uniform4iv(location, value);
            break;
        case 'bool':
            gl.uniform1iv(location, value);
            break;
        case 'bvec2':
            gl.uniform2iv(location, value);
            break;
        case 'bvec3':
            gl.uniform3iv(location, value);
            break;
        case 'bvec4':
            gl.uniform4iv(location, value);
            break;
        case 'sampler2D':
            gl.uniform1iv(location, value);
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
            glslSetSingle(this.gl, location, uniform.type, value);
        }
        else
        {
            glslSetArray(this.gl, location, uniform.type, value);
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
