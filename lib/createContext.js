
/**
 * Helper class to create a webGL Context
 *
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext}
 */

var CONTEXT_UID = 0;

var createContext = function(canvas, options)
{
    gl = canvas.getContext('webgl', options) || 
    	 canvas.getContext('experimental-webgl', options);

    if (!gl)
    {
        // fail, not able to get a context
        throw new Error('This browser does not support webGL. Try using the canvas renderer');
    }

    // might want to phase this out?
    gl.id = CONTEXT_UID++;

    return gl;
}

module.exports = createContext;

