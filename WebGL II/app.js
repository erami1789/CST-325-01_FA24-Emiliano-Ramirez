'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new Camera(appInput);

// var sphereGeometry = null; // this will be created after loading from a file
var groundGeometry = null;
var sphereGeometry = null;

var projectionMatrix = new Matrix4();

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var colorProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    unlitColorVS: null, unlitColorFS: null,
    sphereJSON: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();

    // load assets, wait for the process to complete, and then execute the code inside (createXXX)
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        // camera.cameraPosition.set(0, 1, 10);

        // kick off the render loop
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

        // specify what portion of the canvas we want to draw to (all of it, full width and height)
        gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

        // todo enable depth testing
        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/color.unlit.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/color.unlit.fs.glsl').then((response) => { return response.text(); }),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.unlitColorVS = values[0];
        loadedAssets.unlitColorFS = values[1];
        loadedAssets.sphereJSON = values[2];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    colorProgram = createCompiledAndLinkedShaderProgram(loadedAssets.unlitColorVS, loadedAssets.unlitColorFS);
    gl.useProgram(colorProgram);

    colorProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(colorProgram, "aVertexPosition"),
        vertexColorsAttribute: gl.getAttribLocation(colorProgram, "aVertexColor"),
    };

    colorProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(colorProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(colorProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(colorProgram, "uProjectionMatrix"),
        colorUniform: gl.getUniformLocation(colorProgram, "uColor")
    };
}

// -------------------------------------------------------------------------
function createScene() {
    groundGeometry = new WebGLGeometryQuad(gl);
    groundGeometry.create();

    // todo #1 - translate the quad so you can see it
    // groundGeometry.worldMatrix...

    let scaleMatrix = new Matrix4().makeScale(10, 10, 10);
    let rotationMatrix = new Matrix4().makeRotationX(-90); 
    let translationMatrix = new Matrix4().makeTranslation(0, -1, -10);

    groundGeometry.worldMatrix 
    .multiply(translationMatrix)  
    .multiply(rotationMatrix)    
    .multiply(scaleMatrix);


    // todo #3 - create the sphere geometry

    // sphereGeometry = ?
    // sphereGeometry.create(?);
    sphereGeometry = new WebGLGeometryJSON(gl);
    sphereGeometry.create(loadedAssets.sphereJSON);

    let sphereScaleMatrix = new Matrix4().makeScale(0.01, 0.01, 0.01);
    let sphereTranslationMatrix = new Matrix4().makeTranslation(0, 0, -5);
    sphereGeometry.worldMatrix
        .multiply(sphereTranslationMatrix) 
        .multiply(sphereScaleMatrix); 


    // todo #4 - scale and translate the sphere
    // sphere.Geometry.worldMatrix...
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    time.update();
    camera.update(time.deltaTime);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix.makePerspective(45, aspectRatio, 0.1, 1000);

    gl.useProgram(colorProgram);

    // render ground
    gl.uniform4f(colorProgram.uniforms.colorUniform, 0.5, 0.5, 0.5, 1.0);
    groundGeometry.render(camera, projectionMatrix, colorProgram);
    

   
    // todo #4 - change color for the sphere
    // todo #9 - animate the color of there sphere
    // todo #10 - animate the color with non-grayscale values
    let timeValue = time.secondsElapsedSinceStart;
    let red = (Math.sin(timeValue) + 1) / 2;          // Oscillates between 0 and 1
    let green = (Math.sin(timeValue + Math.PI / 2) + 1) / 2; // Offset by 90 degrees for green
    let blue = (Math.sin(timeValue + Math.PI) + 1) / 2;
    gl.uniform4f(colorProgram.uniforms.colorUniform, red, green, blue, 1.0);
    sphereGeometry.render(camera, projectionMatrix, colorProgram);

    // todo #3 - render the sphere
}