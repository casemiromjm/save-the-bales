#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform vec3 grassColor;
uniform float timeFactor;

void main() {
    gl_FragColor =  vec4(grassColor, 1.0);
}