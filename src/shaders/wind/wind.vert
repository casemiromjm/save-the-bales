attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;

void main() {


    float offset = aVertexPosition.y * 0.05 * sin(timeFactor);
    
	vec4 pos = uMVMatrix * vec4(aVertexPosition, 1.0);
    // do this after the to make the grass ignore the angles and just move on the x axis 
    pos.x += offset;

    gl_Position = uPMatrix * pos;
}

