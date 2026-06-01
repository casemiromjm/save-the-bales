#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vNoiseValue;

uniform sampler2D uSampler1;	// grass
uniform float timeFactor;
uniform sampler2D dirtTexture;	// dirt
uniform sampler2D roadMask;		// road

void main() {

	vec4 grassColor = texture2D(uSampler1, vTextureCoord);
	vec4 dirtColor = texture2D(dirtTexture, vTextureCoord);
	vec4 maskColor = texture2D(roadMask, vTextureCoord);

	float valleyDirt = 1.0 - smoothstep(0.0, 0.25, vNoiseValue);
	float finalDirtFactor = max(maskColor.r, valleyDirt);

	vec4 color = mix(grassColor, dirtColor, finalDirtFactor);

	gl_FragColor = color;
}