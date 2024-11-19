precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;
uniform sampler2D uTexture;

varying vec2 vTexcoords;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main(void) {
    // diffuse contribution
    // todo #1 normalize the light direction and store in a separate variable

    //vec3 lightDirection = normalize(uLightPosition - vWorldPosition);

    
    vec3 lightDirection = normalize(vWorldPosition - uLightPosition);
    


    // todo #2 normalize the world normal and store in a separate variable

     vec3 normalizedNormal = normalize(vWorldNormal);

    // todo #3 calculate the lambert term
    
    float lambertTerm = max(dot(normalizedNormal, lightDirection), 0.01);
    vec3 grayscale = vec3(lambertTerm);

    // specular contribution
    // todo #4 in world space, calculate the direction from the surface point to the eye (normalized)

    vec3 eyeVector = normalize(uCameraPosition - vWorldPosition);

    // todo #5 in world space, calculate the reflection vector (normalized)

    vec3 reflectionVector = normalize(reflect(lightDirection, normalizedNormal));

    // todo #6 calculate the phong term

    float phongTerm = pow(max(dot(eyeVector, reflectionVector), 0.0), 64.0);
    vec3 phongGrayscale = vec3(phongTerm);

    // combine
    // todo #7 apply light and material interaction for diffuse value by using the texture color as the material

    vec3 baseColor = texture2D(uTexture, vTexcoords).rgb;
    vec3 diffuseColor = baseColor * lambertTerm;

    // todo #8 apply light and material interaction for phong, assume phong material color is (0.3, 0.3, 0.3)

    vec3 specularMaterialColor = vec3(0.3, 0.3, 0.3);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 specularColor = specularMaterialColor * lightColor * phongTerm;



    vec3 albedo = texture2D(uTexture, vTexcoords).rgb;

    float valueofalbedo = 0.1;
    vec3 ambient = albedo * valueofalbedo;
    // vec3 ambient = albedo * lambertTerm ;
    

    // vec3 diffuseColor = todo
    // vec3 specularColor = todo

    // todo #9
    // add "diffuseColor" and "specularColor" when ready
    //vec3 finalColor = ambient + diffuseColor + specularColor;
    vec3 finalColor = ambient + diffuseColor + specularColor;

    gl_FragColor = vec4(finalColor, 1.0);

    
}

// EOF 00100001-10