/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String}
 * @return {Number}
 */
var setPrecision = function(src, precision)
{
    if(src.substring(0, 9) !== 'precision')
    {
        return 'precision ' + precision + ' float;\n' + src;
    }

    return src;
};

module.exports = setPrecision;
