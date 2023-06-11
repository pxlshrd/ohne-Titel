var vert = `
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

attribute vec3 aPosition;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

var frag = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_canvasSize;
uniform float u_time;

// Noise functions (simple Perlin noise)
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 120.0); }
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 120.0); }

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                      -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 120.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float bigScaleSnoise(vec2 v) {
  v *= 1.;  // lower frequency for larger scale movement
  return snoise(v);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_canvasSize.xy;

  // Flip along the Y-axis
  st.y = 1.0 - st.y;
  
  // Adjust aspect ratio
  float aspectRatio = u_canvasSize.x / u_canvasSize.y;
  st.x *= aspectRatio * 1.333;

  float noiseValue = snoise(st * 800. + vec2(u_time));
  
  // Increase offset over time, leading to more pixelated look
  vec2 offset = vec2(cos(noiseValue), sin(noiseValue)) * u_time / 500.0;

  // Apply large scale noise
  vec2 bigScaleOffset = vec2(cos(bigScaleSnoise(st)), sin(bigScaleSnoise(st))) * u_time / 500.0;
  offset += bigScaleOffset;

  // Ensure that texture coordinates stay within the valid range
  vec4 colorOne = texture2D(u_image, fract(st + offset));
  vec4 colorTwo = texture2D(u_image, fract(st - offset));
  vec4 colorThree = texture2D(u_image, fract(st - offset));

  if (noiseValue > 0.25) {
    gl_FragColor = vec4(colorTwo.rgb * colorTwo.a, colorTwo.a);
  } else if (noiseValue < 0.5) {
    gl_FragColor = vec4(colorOne.rgb * colorOne.a, colorOne.a);
  } else {
    gl_FragColor = vec4(colorThree.rgb * colorThree.a, colorThree.a);
  }
}

`;

//use this as grain or texture
// var grain = `
// precision mediump float;

// uniform sampler2D u_image;
// uniform vec2 u_canvasSize;
// uniform float u_time;

// // Noise functions (simple Perlin noise)
// vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
// vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

// vec4 taylorInvSqrt(vec4 r)
// {
//   return 1.79284291400159 - 0.85373472095314 * r;
// }

// float snoise(vec2 v)
// {
//   const vec4 C = vec4(0.211324865405187,
//                       0.366025403784439,
//                       -0.577350269189626,
//                       0.024390243902439);
//   vec2 i  = floor(v + dot(v, C.yy) );
//   vec2 x0 = v -   i + dot(i, C.xx);

//   vec2 i1;
//   i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//   vec4 x12 = x0.xyxy + C.xxzz;
//   x12.xy -= i1;

//   i = mod(i, 289.0);
//   vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
//     + i.x + vec3(0.0, i1.x, 1.0 ));

//   vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
//     dot(x12.zw,x12.zw)), 0.0);
//   m = m*m ;
//   m = m*m ;

//   vec3 x = 2.0 * fract(p * C.www) - 1.0;
//   vec3 h = abs(x) - 0.5;
//   vec3 ox = floor(x + 0.5);
//   vec3 a0 = x - ox;

//   m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

//   vec3 g;
//   g.x  = a0.x  * x0.x  + h.x  * x0.y;
//   g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//   return 130.0 * dot(m, g);
// }

// void main() {
//   vec2 st = gl_FragCoord.xy / u_canvasSize.xy;

//   // Flip along the Y-axis
//   st.y = 1.0 - st.y;
  
//   // Adjust aspect ratio
//   float aspectRatio = u_canvasSize.x / u_canvasSize.y;
//   st.x *= aspectRatio * 1.333;

//   float noiseValue = snoise(st * 5000. + vec2(u_time));
  
//   // Increase offset over time, leading to more pixelated look
//   vec2 offset = vec2(cos(noiseValue), sin(noiseValue)) * u_time / 5000.0;

//   vec4 colorOne = texture2D(u_image, st + offset);
//   vec4 colorTwo = texture2D(u_image, st - offset);

//   if (noiseValue > 0.5) {
//     gl_FragColor = vec4(colorTwo.rgb * colorTwo.a, colorTwo.a);
//   } else {
//     gl_FragColor = vec4(colorOne.rgb * colorOne.a, colorOne.a);
//   }
// }
// `;