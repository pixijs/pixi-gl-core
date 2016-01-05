/**
 * Generic Mask Stack data structure
 * @class
 * @memberof PIXI
 */

var GL_MAP = {};


var setVertexAttribArrays = function (gl, attribs, state)
{	
	var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
	
	var data = GL_MAP[gl];

	if(!data)
	{
		data = GL_MAP[gl] = {tempAttribState:new Array(maxAttribs)
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

    for (i = 0; i < attribState.length; i++)
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