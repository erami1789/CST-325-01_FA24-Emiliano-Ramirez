'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput);

var sphereGeometry = null; // this will be created after loading from a file
var groundGeometry = null;
var barrelGeometry = null;

var projectionMatrix = new Matrix4();
var lightPosition = new Vector3(4, 1.5, 0);

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var phongShaderProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    phongTextVS: null, phongTextFS: null,
    sphereJSON: null,
    marbleImage: null,
    crackedMudImage: null,
    barrelJSON: null,
    barrelImage: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/phong.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/phong.pointlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }), 
        loadImage('./data/marble.jpg'),
        loadImage('./data/crackedMud.png'),
        fetch('./data/barrel.json').then((response) => { return response.json(); }),
        loadImage('./data/barrel.png')
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.phongTextVS = values[0];
        loadedAssets.phongTextFS = values[1];
        loadedAssets.sphereJSON = values[2];
        loadedAssets.marbleImage = values[3];
        loadedAssets.crackedMudImage = values[4];
        loadedAssets.barrelJSON = values[5]; 
        loadedAssets.barrelImage = values[6];

    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    phongShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.phongTextVS, loadedAssets.phongTextFS);

    phongShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(phongShaderProgram, "aVertexPosition"),
        vertexNormalsAttribute: gl.getAttribLocation(phongShaderProgram, "aNormal"),
        vertexTexcoordsAttribute: gl.getAttribLocation(phongShaderProgram, "aTexcoords")
    };

    phongShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(phongShaderProgram, "uProjectionMatrix"),
        lightDirectionUniform: gl.getUniformLocation(phongShaderProgram, "uLightPosition"),
        cameraPositionUniform: gl.getUniformLocation(phongShaderProgram, "uCameraPosition"),
        textureUniform: gl.getUniformLocation(phongShaderProgram, "uTexture"),
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl, phongShaderProgram);
    groundGeometry.create(loadedAssets.crackedMudImage);

    var scale = new Matrix4().makeScale(10.0, 10.0, 10.0);

    // compensate for the model being flipped on its side
    var rotation = new Matrix4().makeRotationX(-90);

    groundGeometry.worldMatrix.makeIdentity();
    groundGeometry.worldMatrix.multiply(rotation).multiply(scale);

    sphereGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    sphereGeometry.create(loadedAssets.sphereJSON, loadedAssets.marbleImage);

    // Scaled it down so that the diameter is 3
    var scale = new Matrix4().makeScale(0.03, 0.03, 0.03);

    // raise it by the radius to make it sit on the ground
    var translation = new Matrix4().makeTranslation(0, 1.5, 0);

    sphereGeometry.worldMatrix.makeIdentity();
    sphereGeometry.worldMatrix.multiply(translation).multiply(scale);

    barrelGeometry = new WebGLGeometryJSON(gl, phongShaderProgram);
    barrelGeometry.create(loadedAssets.barrelJSON, loadedAssets.barrelImage);

    // Apply scale and translation to position the barrel near a corner of the ground plane
    var barrelScale = new Matrix4().makeScale(0.3, 0.3, 0.3);
    var barrelTranslation = new Matrix4().makeTranslation(-5, 2, -5);
    barrelGeometry.worldMatrix.makeIdentity();
    barrelGeometry.worldMatrix.multiply(barrelTranslation).multiply(barrelScale);

}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    // todo #10
    // add keyboard controls for changing light direction here

    var rotationSpeed = 0.02; // Adjust rotation speed as needed
    var cosAngle, sinAngle;
    var cosAngle = Math.cos(rotationSpeed);
    var sinAngle = Math.sin(rotationSpeed);

// Apply rotation around the origin in the xz-plane
    var x = lightPosition.x;
    var z = lightPosition.z;
    lightPosition.x = cosAngle * x - sinAngle * z;
    lightPosition.z = sinAngle * x + cosAngle * z;
    lightPosition.y = 1.5; 

    // if (appInput.left) {
    //     cosAngle = Math.cos(rotationSpeed);
    //     sinAngle = Math.sin(rotationSpeed);
    //     var newX = cosAngle * lightPosition.x - sinAngle * lightPosition.z;
    //     var newZ = sinAngle * lightPosition.x + cosAngle * lightPosition.z;
    //     lightPosition.x = newX;
    //     lightPosition.z = newZ;
    // }
    // if (appInput.right) {
    //     cosAngle = Math.cos(-rotationSpeed);
    //     sinAngle = Math.sin(-rotationSpeed);
    //     var newX = cosAngle * lightPosition.x - sinAngle * lightPosition.z;
    //     var newZ = sinAngle * lightPosition.x + cosAngle * lightPosition.z;
    //     lightPosition.x = newX;
    //     lightPosition.z = newZ;
    // }
    
    // // Rotate the light vertically when 'up' or 'down' arrow keys are pressed
    // if (appInput.up) {
    //     cosAngle = Math.cos(rotationSpeed);
    //     sinAngle = Math.sin(rotationSpeed);
    //     var newY = cosAngle * lightPosition.y - sinAngle * lightPosition.z;
    //     var newZ = sinAngle * lightPosition.y + cosAngle * lightPosition.z;
    //     lightPosition.y = newY;
    //     lightPosition.z = newZ;
    // }
    // if (appInput.down) {
    //     cosAngle = Math.cos(-rotationSpeed);
    //     sinAngle = Math.sin(-rotationSpeed);
    //     var newY = cosAngle * lightPosition.y - sinAngle * lightPosition.z;
    //     var newZ = sinAngle * lightPosition.y + cosAngle * lightPosition.z;
    //     lightPosition.y = newY;
    //     lightPosition.z = newZ;
    // }


    time.update();
    camera.update(time.deltaTime);

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(phongShaderProgram);
    var uniforms = phongShaderProgram.uniforms;
    var cameraPosition = camera.getPosition();
    gl.uniform3f(uniforms.lightPositionUniform, lightPosition.x, lightPosition.y, lightPosition.z);
    gl.uniform3f(uniforms.cameraPositionUniform, cameraPosition.x, cameraPosition.y, cameraPosition.z);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);
    groundGeometry.render(camera, projectionMatrix, phongShaderProgram);
    sphereGeometry.render(camera, projectionMatrix, phongShaderProgram);
    barrelGeometry.render(camera, projectionMatrix, phongShaderProgram);
}

// EOF 00100001-10