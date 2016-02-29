var GL_MAP = {};

/**
 * @mat
 * @param gl {WebGLRenderingContext} The current WebGL context
 * @param attribs {[type]}
 */
var setVertexAttribArrays = function (gl, attribs)
{
   // console.log(gl.id)
    var data = GL_MAP[gl.id];

    if(!data)
    {
	   var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		data = GL_MAP[gl.id] = {tempAttribState:new Array(maxAttribs)
				 	 		   ,attribState:new Array(maxAttribs)};
	}

    var i,
    	tempAttribState = data.tempAttribState,
    	attribState = data.attribState;

    for (i = 0; i < tempAttribState.length; i++)
    {
        tempAttribState[i] = false;
    }

    // set the new attribs
    for (i in attribs)
    {
        tempAttribState[attribs[i].location] = true;
    }

    for (i = 1; i < attribState.length; i++)
    {
        if (attribState[i] !== tempAttribState[i])
        {
            attribState[i] = tempAttribState[i];

            if (data.attribState[i])
            {
                gl.enableVertexAttribArray(i);
            }
            else
            {
                gl.disableVertexAttribArray(i);
            }
        }
    }
};

module.exports = setVertexAttribArrays;
