precision mediump float;

attribute vec3 aVertexPosition; // Vertex position
attribute vec2 aTexCoords; // Texture coordinates

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoords; // Passes texture coordinates to the fragment shader

void main(void) {
    vTexCoords = aTexCoords; // Pass texture coordinates to fragment shader
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0); // Calculate vertex position
}

// EOF 00100001-10