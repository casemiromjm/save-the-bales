#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float timeFactor;

void main() {

    float breathingSpeed = 0.3;

    float wave = (sin(timeFactor * breathingSpeed) + 1.0) / 2.0;

    float minScale = 0.8;
    float maxScale = 0.9;
    float currentScale = minScale + (wave * (maxScale - minScale));

    vec3 scaledPosition = vec3(aVertexPosition.x * currentScale, aVertexPosition.y * currentScale, aVertexPosition.z);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(scaledPosition, 1.0);
}
