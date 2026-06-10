attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

// color/texture
uniform sampler2D uSampler1;
// roadMask
uniform sampler2D roadMask;

uniform float heightFactor;
uniform vec2 noiseOffset;

varying vec2 vTextureCoord;
varying float vNoiseValue;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

	// hermite curve for blending!!
	vec2 u = f * f * (3.0 - 2.0 * f);

	return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {

	vTextureCoord = aTextureCoord;

	float hillFrequency = 8.0;
	vec2 shiftedCoords = aTextureCoord + noiseOffset;
	float generatedNoise = noise(shiftedCoords * hillFrequency);

	vNoiseValue = generatedNoise;

	float baseHeight = generatedNoise * heightFactor;
	vec4 maskColor = texture2D(roadMask, aTextureCoord);

	float finalHeight = mix(baseHeight, 0.0, maskColor.r);

	vec3 offset = vec3(0.0, 0.0, finalHeight);
	vec3 newVertexPosition = aVertexPosition + offset;

	gl_Position = uPMatrix * uMVMatrix * vec4(newVertexPosition, 1.0);
}

