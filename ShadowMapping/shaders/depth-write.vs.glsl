
    attribute vec3 aVertexPosition;

    uniform mat4 uWorldMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying float vDepth;

    void main(void) {
        gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);

        // todo #4 convert clip space depth into NDC and remap from [-1, 1] to [0, 1]

    // Rescale depth (z value) from normalized device coordinates ([-1, 1]) to [0, 1]
        vDepth = (gl_Position.z + 1.0) * 0.5; 
    }

