#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform vec3 arrowColor;
uniform float timeFactor;

void main() {
    gl_FragColor =  vec4(arrowColor, 1.0);
}