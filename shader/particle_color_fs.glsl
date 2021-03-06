//##FilterBegin## ##Particle##
uniform float uniform_colorTransform[40];
//压缩过的颜色,rg.b的格式
vec3 unpack_color(float rgb_data)
{
    vec3 res;
    res.z = fract( rgb_data );
    rgb_data -= res.z;
    
    rgb_data = rgb_data/256.0;
    res.y = fract( rgb_data );
    rgb_data -= res.y;
    
    res.x = rgb_data/256.0;
    return res;
}

void main() {
    float startColor ;
    float startSegment ;
    
    float nextColor ;
    float nextSegment ;

    float startAlpha;
	float nextAlpha;

    float progress = varying_particleData.x/varying_particleData.y;
	const int maxColorCount = 20;
	const int loopCount = 20;
    for( int i = 1 ; i < loopCount ; i++ ){
       if( progress >= fract(uniform_colorTransform[i+maxColorCount-1]) ){
          startColor = uniform_colorTransform[i-1] ;
          startSegment = fract(uniform_colorTransform[i+maxColorCount-1]) ;
          nextColor = uniform_colorTransform[i];
          nextSegment = fract(uniform_colorTransform[i+maxColorCount]) ;

		  startAlpha = uniform_colorTransform[i+maxColorCount-1] - startSegment;
		  nextAlpha = uniform_colorTransform[i+maxColorCount] - nextSegment;
       }else{
          break;
       }
    } 
    
    float len = nextSegment - startSegment ;
    float ws = ( progress - startSegment ) / len ;
	ws = clamp(ws,0.0,1.0);
    globalColor = mix(vec4(unpack_color(startColor).xyz,startAlpha / 256.0),vec4(unpack_color(nextColor).xyz, nextAlpha / 256.0),ws) ;
	globalColor = clamp(globalColor,0.0,1.0);
}
//##FilterEnd##