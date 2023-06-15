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
uniform float u_rndPos;
uniform sampler2D u_bufferTexture;
uniform float u_aspectRatio;
uniform float pixelDensity;
const int numBubbles = 2;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float snoise(vec2 v, vec4 C)
{
  v += u_rndPos;
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
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

float worley(vec2 P) {
  float d = 1e30;
  for (int xo = -1; xo <= 1; ++xo)
  for (int yo = -1; yo <= 1; ++yo) {
      vec2 tp = floor(P) + vec2(xo, yo);
      d = min(d, length(P - tp - random(vec2(tp))));
  }
  return 1.0 - d;
}

float turbulence(vec2 P)
{
  float t = -0.5;
  float maxTurbulence = 0.2;  // Maximum turbulence value
  for (float f = 1.0; f <= 10.0; f++)
  {
    float power = pow(5.0, f);
    float timing = u_time / 10.0;
  
    vec4 turbulencePermutations = vec4(0.211324865405187, 0.366095403784439, -0.576350269189626, 0.024590243902439);
    t += abs(snoise(P * power * (1.0 + snoise(vec2(timing / 10.0), turbulencePermutations)), turbulencePermutations) / power*2.);
    if (t > maxTurbulence)
      break;  // Stop increasing turbulence beyond the maximum limit
  }
  return t;
}

void main() {

  vec2 st = gl_FragCoord.xy / u_canvasSize.xy / pixelDensity;

  st.y = 1.0 - st.y;
  float aspectRatio = u_canvasSize.x / u_canvasSize.y;
  st.x *= aspectRatio / u_aspectRatio;

  float timeAdjusted = u_time / (100.0 + sin(u_time / 50.0) * 50.0);
  vec2 distort = vec2(snoise(vec2(timeAdjusted / 10.0), vec4(0.211324865405187,
                      0.366095403784439,
                      -0.576350269189626,
                      0.024590243902439)), snoise(vec2(timeAdjusted / 20.0), vec4(0.136324865405187,
                      0.776095403784439,
                      0.676350269189626,
                      0.124590243902439)));
  float noiseValue = mix(snoise(st + distort, vec4(0.211324865405187,
                      0.366095403784439,
                      -0.576350269189626,
                      0.024590243902439)), snoise(st + distort, vec4(0.136324865405187,
                      0.776095403784439,
                      0.676350269189626,
                      0.124590243902439)), 0.5);
  
  vec2 offset = vec2(cos(noiseValue + timeAdjusted), sin(noiseValue + timeAdjusted));

  vec2 bigScaleOffset = vec2(cos(turbulence(st)), sin(turbulence(st))) * timeAdjusted;
  offset += bigScaleOffset;


  vec4 originalColor = texture2D(u_image, st);
vec4 bufferColor = texture2D(u_bufferTexture, st);
originalColor = mix(originalColor, bufferColor, bufferColor.a);

  // Create the two layers of distortion
  vec2 offsetLayer1 = vec2(snoise(st + 2.1*distort, vec4(0.211324865405187,
                    0.366095403784439,
                    -0.576350269189626,
                    0.024590243902439)), snoise(st + 2.1*distort, vec4(0.136324865405187,
                    0.776095403784439,
                    0.676350269189626,
                    0.124590243902439)));
  
  vec2 offsetLayer2 = vec2(snoise(st + 0.01*distort, vec4(0.211324865405187,
                    0.366095403784439,
                    -0.576350269189626,
                    0.024590243902439)), snoise(st + 0.01*distort, vec4(0.136324865405187,
                    0.776095403784439,
                    0.676350269189626,
                    0.124590243902439)));
  
  // Combine the layers by averaging
  vec2 combinedOffset = 0.5 * offsetLayer1 + 0.5 * offsetLayer2;

  vec2 mixOffsets = mix(offset, combinedOffset, 0.5);

  for (int i = 0; i < numBubbles; ++i) {
    vec2 bubblePos = vec2(
      0.5 + 0.2 * sin(u_time / 15.0 + float(i)), 
      0.5 + 0.2 * cos(u_time / 18.0 + float(i)));
    // Increase the frequency of the sin function to make the bubbles appear and disappear faster
    float bubbleSize = 0.1 + 0.5 * sin(u_time + float(i));
    float bubbleInfl = smoothstep(0.8, 0.0, bubbleSize) * smoothstep(0.9, 0.0, bubbleSize);
    
    vec2 dir = st - bubblePos;
    float dist = length(dir);
    if (dist < bubbleSize) {
      bubbleInfl *= smoothstep(0.2, 0.0, dist / bubbleSize);
      mixOffsets += bubbleInfl * normalize(dir);
    }
  }

  // Use the scaled offset to fetch the colors
  vec4 colorOne = texture2D(u_image, fract(st + mixOffsets));
  vec4 colorTwo = texture2D(u_image, fract(st - mixOffsets));
  
  
  vec4 finalColor;
  if (noiseValue > 0.5) {
    finalColor = vec4(colorTwo.rgb * colorTwo.a, colorTwo.a);
  } else {
    finalColor = vec4(colorOne.rgb * colorOne.a, colorOne.a);
  }

  
  // fade in
  float inflTime = u_time / 20.0;
  float influence = min(inflTime * inflTime, 1.0);

  gl_FragColor = mix(originalColor, finalColor, influence);
}

`;


var paperRough = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_canvasSize;

const float PI = 3.14159265359;

// Simplex noise functions
vec3 permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

float noise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,
                      0.366015403784439,
                      -0.576350169189626,
                      0.024590243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
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

// Calculate the normal of the surface
vec3 calculateNormal(vec3 st) {
  vec2 eps = vec2(0.01, 0.);

  vec2 stXY = st.xy * 350.0;

  vec2 stCenter = stXY;
  vec2 stLeft = (stXY - vec2(eps.x, 0.0));
  vec2 stRight = (stXY + vec2(eps.x, 0.0));
  vec2 stDown = (stXY - vec2(0.0, eps.x));
  vec2 stUp = (stXY + vec2(0.0, eps.x));

  float heightCenter = noise(stCenter);
  float heightLeft = noise(stLeft);
  float heightRight = noise(stRight);
  float heightDown = noise(stDown);
  float heightUp = noise(stUp);
vec3 normal = vec3(heightLeft - heightRight, heightDown - heightUp, eps.x);
  normal = normalize(normal * 45.0 - 1.0);

  return normal;
}

const int OCTAVES = 10;

float turbulence(vec2 v){
    float turb = 0.0;
    float freq = 30.0, amp = 1.;

    for(int i = 0; i < OCTAVES; i++){
        turb += abs(noise(v*freq))*amp;
        freq *= 0.50;
        amp *= 0.6;
    }

    return turb;
}

float random(vec2 st) {
    // Hash function
    vec2 i = floor(st);
    vec3 g = vec3(0.1031, 0.11369, 0.13787);
    vec2 offset = vec2(dot(g.xy, i), dot(g.yz, i));
    return fract(sin(offset.x + offset.y) * 43758.5453);
}

float stipple(vec2 st) {
    // Create a grid of cells
    vec2 grid = floor(st);
    vec2 fract_st = fract(st);

    // Calculate the distance from the center of the cell
    vec2 center = fract_st - 0.5;
    float d = length(center);

    // Generate a random threshold based on the cell's position
    float threshold = random(grid);

    // Draw a dot if the distance is less than the threshold
// Invert the distance and threshold comparison to draw the dot for distances greater than the threshold
    return step(threshold, 1.1 - d);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    float maxCanvasDimension = max(u_canvasSize.x, u_canvasSize.y);
    vec2 scaledSt = st * maxCanvasDimension / max(u_resolution.x, u_resolution.y);

    // Use turbulence function
    float n = turbulence(scaledSt * 13.0);

    // Add tiny dots with randomized sizes
   const int numInstances = 5;

  float scalingFactors[numInstances];
  scalingFactors[0] = 50.0;
  scalingFactors[1] = 30.0;
  scalingFactors[2] = 70.0;
  scalingFactors[3] = 100.0;
  scalingFactors[4] = 60.0;

  for (int i = 0; i < numInstances; i++) {
    float dots = stipple(scaledSt * scalingFactors[i]);
  // Blend turbulence and dots, adjust this factor to your liking
    n += dots * 0.08;
  }

    float greyscale = (n + 1.0) / 2.0;
    vec3 color = vec3(greyscale);

    vec3 normal = calculateNormal(vec3(scaledSt, u_time));
    normal = normal * 0.5 + 0.5;

    vec3 lightDirection = normalize(vec3(0.1, 0.9, 0.1));
    vec3 viewDirection = normalize(vec3(0.5, 0.3, 1.0));

    // Diffuse lighting
    float diffuse = max(dot(normal, lightDirection), 0.5);

    // Specular lighting
    float specular = pow(max(dot(viewDirection, reflect(-lightDirection, normal)), 0.0), 50.0);

    // Ambient light
    vec3 ambient = vec3(0.3);

    // Apply lighting to the final color
    vec3 finalColor = (color * (diffuse + ambient) + specular * 0.9);

    gl_FragColor = vec4(finalColor, 1.);
}
`;

var paperSoft = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_canvasSize;

const float PI = 3.14159265359;

// Simplex noise functions
vec3 permute(vec3 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

float noise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,
                      0.366015403784439,
                      -0.576350169189626,
                      0.024590243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
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

// Calculate the normal of the surface
vec3 calculateNormal(vec3 st) {
  vec2 eps = vec2(0.01, 0.);

  vec2 stXY = st.xy * 50.0;

  vec2 stCenter = stXY;
  vec2 stLeft = (stXY - vec2(eps.x, 0.0));
  vec2 stRight = (stXY + vec2(eps.x, 0.0));
  vec2 stDown = (stXY - vec2(0.0, eps.x));
  vec2 stUp = (stXY + vec2(0.0, eps.x));

  float heightCenter = noise(stCenter);
  float heightLeft = noise(stLeft);
  float heightRight = noise(stRight);
  float heightDown = noise(stDown);
  float heightUp = noise(stUp);
vec3 normal = vec3(heightLeft - heightRight, heightDown - heightUp, eps.x);
  normal = normalize(normal * 11.0 - 1.0);

  return normal;
}

const int OCTAVES = 10;

float turbulence(vec2 v){
    float turb = 0.0;
    float freq = 90.0, amp = 1.;

    for(int i = 0; i < OCTAVES; i++){
        turb += abs(noise(v*freq))*amp;
        freq *= 0.50;
        amp *= 0.6;
    }

    return turb;
}

float random(vec2 st) {
    // Hash function
    vec2 i = floor(st);
    vec3 g = vec3(0.1031, 0.11369, 0.13787);
    vec2 offset = vec2(dot(g.xy, i), dot(g.yz, i));
    return fract(sin(offset.x + offset.y) * 43758.5453);
}

float stipple(vec2 st) {
    // Create a grid of cells
    vec2 grid = floor(st);
    vec2 fract_st = fract(st);

    // Calculate the distance from the center of the cell
    vec2 center = fract_st - 0.5;
    float d = length(center);

    // Generate a random threshold based on the cell's position
    float threshold = random(grid);

    // Draw a dot if the distance is less than the threshold
// Invert the distance and threshold comparison to draw the dot for distances greater than the threshold
    return step(threshold, 1.1 - d);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    float maxCanvasDimension = max(u_canvasSize.x, u_canvasSize.y);
    vec2 scaledSt = st * maxCanvasDimension / max(u_resolution.x, u_resolution.y);

    // Use turbulence function
    float n = turbulence(scaledSt * 13.0);

    // Add tiny dots with randomized sizes
   const int numInstances = 5;

  float scalingFactors[numInstances];
  scalingFactors[0] = 50.0;
  scalingFactors[1] = 30.0;
  scalingFactors[2] = 70.0;
  scalingFactors[3] = 100.0;
  scalingFactors[4] = 60.0;

  for (int i = 0; i < numInstances; i++) {
    float dots = stipple(scaledSt * scalingFactors[i]);
  // Blend turbulence and dots, adjust this factor to your liking
    n += dots * 0.05;
  }

    float greyscale = (n + 1.0) / 2.0;
    vec3 color = vec3(greyscale);

    vec3 normal = calculateNormal(vec3(scaledSt, u_time));
    normal = normal * 0.5 + 0.5;

    vec3 lightDirection = normalize(vec3(0.1, 0.9, 0.1));
    vec3 viewDirection = normalize(vec3(0.5, 0.3, 1.0));

    // Diffuse lighting
    float diffuse = max(dot(normal, lightDirection), 0.5);

    // Specular lighting
    float specular = pow(max(dot(viewDirection, reflect(-lightDirection, normal)), 0.0), 50.0);

    // Ambient light
    vec3 ambient = vec3(0.4);

    // Apply lighting to the final color
    vec3 finalColor = (color * (diffuse + ambient) + specular * 0.9);

    gl_FragColor = vec4(finalColor, 1.);
}
`;