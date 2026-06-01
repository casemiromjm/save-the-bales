#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vPosition;
// color/texture
uniform sampler2D uSampler1;

// heightmap
uniform sampler2D cloudTexture;

uniform sampler2D sunTexture;

uniform float timeFactor;
uniform vec2 uSunCenter;

void main() {

    vec4 color = texture2D(uSampler1, vTextureCoord);

    vec2 offset = vec2(timeFactor*0.001, 0);
    vec4 cloud = texture2D(cloudTexture, vTextureCoord + offset);

	color = color + (cloud.r * 0.5);
    
    vec2 sunCenter = uSunCenter;
    float sunSize = 0.1;

    float left = sunCenter.x - sunSize;
    float right = sunCenter.x + sunSize;
    float bottom = sunCenter.y - sunSize;
    float top = sunCenter.y + sunSize;

    if ( vTextureCoord.x > left && vTextureCoord.x < right && vTextureCoord.y > bottom && vTextureCoord.y < top){
        float sunU = (vTextureCoord.x - left) / (right - left); // para fazer o valor de 0 a 1 da coordenada da textura
        float sunV = (vTextureCoord.y - bottom) / (top - bottom);
        
        vec4 sun = texture2D(sunTexture, vec2(sunU, sunV));

        color.rgb = color.rgb * (1.0 - sun.a) + sun.rgb * sun.a;
    }
    
    gl_FragColor = color;

    
}