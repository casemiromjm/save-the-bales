#ifdef GL_ES
precision highp float;
#endif

uniform vec4 circleColor;

void main() {

    gl_FragColor = circleColor;
}