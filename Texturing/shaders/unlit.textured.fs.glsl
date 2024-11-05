 precision mediump float;

varying vec2 vTexCoords; // Texture coordinates from the vertex shader
uniform sampler2D uTexture; // Texture sampler
uniform float uAlpha; // Alpha value for blending

void main(void) {
    // Sample the color from the texture at the given coordinates
    vec4 textureColor = texture2D(uTexture, vTexCoords);

    // Set the final fragment color, using uAlpha for the alpha channel
    gl_FragColor = vec4(textureColor.rgb, uAlpha);
}

// EOF 00100001-10
