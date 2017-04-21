const int max_directLight = 0 ;
uniform float uniform_directLightSource[10*max_directLight] ;
varying vec4 varying_mvPose; 
uniform mat4 uniform_ViewMatrix;
mat4 normalMatrix ;
struct DirectLight{
    vec3 direction;
	vec3 diffuse;
	vec3 ambient;
    float intensity;
    // float halfIntensity;
};

mat4 transpose(mat4 inMatrix) {
    vec4 i0 = inMatrix[0];
    vec4 i1 = inMatrix[1];
    vec4 i2 = inMatrix[2];
    vec4 i3 = inMatrix[3];

    mat4 outMatrix = mat4(
                 vec4(i0.x, i1.x, i2.x, i3.x),
                 vec4(i0.y, i1.y, i2.y, i3.y),
                 vec4(i0.z, i1.z, i2.z, i3.z),
                 vec4(i0.w, i1.w, i2.w, i3.w)
                 );

    return outMatrix;
}

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

vec4 calculateDirectLight( MaterialSource materialSource ){ 
    float lambertTerm , specular ; 
    vec3 dir ,viewDir = normalize(varying_mvPose.xyz/varying_mvPose.w); 
    diffuseColor = vec4(0.0,0.0,0.0,1.0);
    for(int i = 0 ; i < max_directLight ; i++){ 
        DirectLight directLight ; 
        directLight.direction = (normalMatrix * vec4(uniform_directLightSource[i*10],uniform_directLightSource[i*10+1],uniform_directLightSource[i*10+2],1.0)).xyz; 
		directLight.diffuse = vec3(uniform_directLightSource[i*10+3],uniform_directLightSource[i*10+4],uniform_directLightSource[i*10+5]); 
		directLight.ambient = vec3(uniform_directLightSource[i*10+6],uniform_directLightSource[i*10+7],uniform_directLightSource[i*10+8]); 
		directLight.intensity = uniform_directLightSource[i*10+9] ; 
		dir = normalize(directLight.direction) ; 
		diffuseColor += LightingBlinnPhong(dir,directLight.diffuse,directLight.ambient,s.Normal,viewDir,directLight.intensity); 
    } 
    return diffuseColor ;
}

void main() {
	normalMatrix = inverse(uniform_ViewMatrix);
	normalMatrix = transpose(normalMatrix);
	light += calculateDirectLight( materialSource ).xyzw ; 
}
