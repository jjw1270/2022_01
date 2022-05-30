var gl;
var points = [];
var normals = [];
var texCoords = [];

const groundScale = 10;

var program0, program1, program2; // 0 : color 1 : phong
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertCubeTri, vertPyraStart, numVertPyraTri, vertGroundStart, numVertGroundTri;

var eyePos = vec3(0.0, 3.0, 3.0);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(0.0, -0.7071, -0.7071); // 1.0/Math.sqrt(2.0)

const moveLeft = 0;
const moveRight = 1;
const moveUp = 2;
const moveDown = 3; 

var theta = 0;
var prevTime = new Date();

var jumping = false;

var objectPos = [];
var preXPos = 3;
var objectDirection = true;

function detectCollision(newPosX, newPosZ){
    if(newPosX < -groundScale || newPosX > groundScale || newPosZ < -groundScale || newPosZ > groundScale)
        return true;
    for(var index = 0; index < objectPos.length; index++){
        if(Math.abs(newPosX-objectPos[index][0]) < 1.0 && Math.abs(newPosZ-objectPos[index][2]) < 1.0)
        return true;
    }
    return false;
};

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateTexGround(groundScale);
    generateTexCube();
    generateHexaPyramid();

    // virtual trackball
    var trball = trackball(canvas.width, canvas.height);
    var mouseDown = false;

    canvas.addEventListener("mousedown", function (event) {
        trball.start(event.clientX, event.clientY);

        mouseDown = true;
    });

    canvas.addEventListener("mouseup", function (event) {
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function (event) {
        if (mouseDown) {
            trball.end(event.clientX, event.clientY);

            trballMatrix = mat4(trball.rotationMatrix);
        }
    });

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.01, 1);

        ////////////////////////////////////////////////////////////////////////////
    // Program0 : color start
    // Load shaders and initialize attribute buffers
    program0 = initShaders(gl, "colorVS", "colorFS");
    //program = initShaders(gl, "phongVS", "phongFS");
    gl.useProgram(program0);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program0, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    //var modelMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    modelMatrixLoc0 = gl.getUniformLocation(program0, "modelMatrix");
    //gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

    //var viewMatrix = lookAt(eyePos, atPos, upVec);
    viewMatrixLoc0 = gl.getUniformLocation(program0, "viewMatrix");
    //gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    /*
    // 3D orthographic viewing
    var viewLength = 2.0;
    var projectionMatrix;
    if (canvas.width > canvas.height) {
        var aspect = viewLength * canvas.width / canvas.height;
        projectionMatrix = ortho(-aspect, aspect, -viewLength, viewLength, -viewLength, 1000);
    }
    else {
        var aspect = viewLength * canvas.height / canvas.width;
        projectionMatrix = ortho(-viewLength, viewLength, -aspect, aspect, -viewLength, 1000);
    }
    */
    // 3D perspective viewing
    var aspect = canvas.width / canvas.height;
    var projectionMatrix = perspective(90, aspect, 0.1, 1000); 

    var projectionMatrixLoc = gl.getUniformLocation(program0, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    ///////////////////////////////////////////////////////////////////////////////////////////
    // program1 : Phong Shading
    program1 = initShaders(gl, "phongVS", "phongFS");
    gl.useProgram(program1);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    var nBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program1, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    
    modelMatrixLoc1 = gl.getUniformLocation(program1, "modelMatrix");
    viewMatrixLoc1 = gl.getUniformLocation(program1, "viewMatrix");
    
    var projectionMatrixLoc = gl.getUniformLocation(program1, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program1);

    ////////////////////////////////////////////////////////////////////////////
    // Program2: Texture Start

    program2 = initShaders(gl, "texMapVS", "texMapFS");
    gl.useProgram(program2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
    vNormal = gl.getAttribLocation(program2, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
     
    var tBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program2, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    modelMatrixLoc2 = gl.getUniformLocation(program2, "modelMatrix");
    viewMatrixLoc2 = gl.getUniformLocation(program2, "viewMatrix");
    
    var projectionMatrixLoc = gl.getUniformLocation(program2, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program2);
    setTexture();

    // Event listeners for buttons
    document.getElementById("left").onclick = function () {
        cameraMove(moveLeft);
    };
    document.getElementById("right").onclick = function () {
        cameraMove(moveRight);
    };
    document.getElementById("up").onclick = function () {
        cameraMove(moveUp);
    };
    document.getElementById("down").onclick = function () {
        cameraMove(moveDown);
    };

    render();
};
function cameraMove(direction){
    var sinTheta = Math.sin(0.1);
    var cosTheta = Math.cos(0.1);
    switch(direction){
        case moveLeft:
            var newVecX = cosTheta*cameraVec[0] + sinTheta*cameraVec[2];
            var newVecZ = -sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case moveRight:
            var newVecX = cosTheta*cameraVec[0] - sinTheta*cameraVec[2];
            var newVecZ = sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case moveUp:
            var newPosX = eyePos[0] + 0.5 * cameraVec[0];
            var newPosZ = eyePos[2] + 0.5 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }
            break;
        case moveDown:
            var newPosX = eyePos[0] - 0.5 * cameraVec[0];
            var newPosZ = eyePos[2] - 0.5 * cameraVec[2];
            if (!detectCollision(newPosX, newPosZ)) {
                eyePos[0] = newPosX;
                eyePos[2] = newPosZ;
            }
            break;     
    }
}

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:    // left arrow
        case 65:    // 'A'
        case 97:    // 'a'
            cameraMove(moveLeft);
            break;
        case 39:    // right arrow
        case 68:    // 'D'
        case 100:   // 'd'
            cameraMove(moveRight);
            break;
        case 38:    // up arrow
        case 87:    // 'W'
        case 119:   // 'w'
            cameraMove(moveUp);
            break;
        case 40:    // down arrow
        case 83:    // 'S'
        case 115:   // 's'
            cameraMove(moveDown);
            break;
        case 32:
            if(!jumping){
                eyePos[1] += 2.0;
                jumping = true;
            }
            break;
    }
    render();
};

function setLighting(program) {
    var lightSrc = [0.0, 1.0, 0.0, 0.0];
    var lightAmbient = [0.0, 0.0, 0.0, 1.0];
    var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
    var lightSpecular = [1.0, 1.0, 1.0, 1.0];
    
    var matAmbient = [1.0, 1.0, 1.0, 1.0];
    var matDiffuse = [1.0, 1.0, 1.0, 1.0];
    var matSpecular = [1.0, 1.0, 1.0, 1.0];
    
    var ambientProduct = mult(lightAmbient, matAmbient);
    var diffuseProduct = mult(lightDiffuse, matDiffuse);
    var specularProduct = mult(lightSpecular, matSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "lightSrc"), lightSrc);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), specularProduct);

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), 100.0);
    gl.uniform3fv(gl.getUniformLocation(program, "eyePos"), flatten(eyePos));

    gl.uniform1f(gl.getUniformLocation(program, "fogStart"), 2.0);
    gl.uniform1f(gl.getUniformLocation(program, "fogEnd"), 10.0);
    gl.uniform4f(gl.getUniformLocation(program, "fogColor"), 0.0, 0.0, 0.0, 1.0);
};

function setTexture(){
    var image0 = new Image();
    image0.src = "../images/logo.bmp";

    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FLITER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FLITER, gl.LINEAR);

    var image1 = new Image();
    image1.src = "../images/brick.bmp";

    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FLITER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FLITER, gl.LINEAR); 
}
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    atPos[0] = eyePos[0] + cameraVec[0];
    atPos[1] = eyePos[1] + cameraVec[1];
    atPos[2] = eyePos[2] + cameraVec[2];
    var viewMatrix = lookAt(eyePos, atPos, upVec);
    gl.useProgram(program0);
    gl.uniformMatrix4fv(viewMatrixLoc0, false, flatten(viewMatrix));
    gl.useProgram(program1);
    gl.uniformMatrix4fv(viewMatrixLoc1, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program1, "eyePos"), flatten(eyePos));
    gl.useProgram(program2);
    gl.uniformMatrix4fv(viewMatrixLoc2, false, flatten(viewMatrix));
    gl.uniform3fv(gl.getUniformLocation(program2, "eyePos"), flatten(eyePos));
    
    let currTime = new Date();
    let elapsedTime = currTime.getTime() - prevTime.getTime();
    theta += (elapsedTime / 10);
    prevTime = currTime;
    
    if(jumping){
        if(eyePos[1] > 3.0){
            eyePos[1] -= elapsedTime/100;
            if(eyePos[1] < 3.0){
                eyePos[1] = 3.0;
            }
        }
        else{
            jumping = false;
        }
    }

    //var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");

    
    // draw the ground
    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 0);
    //gl.uniform4f(uColorLoc, 0.8, 0.8, 0.8, 1.0);    // gray
    //gl.uniform4f(diffuseProductLoc, 0.8, 0.8, 0.8, 1.0);

    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(trballMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);
    /*
    gl.useProgram(program0);
    gl.uniform4f(uColorLoc, 0.0, 0.0, 0.0, 1.0);    // black
    //gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(trballMatrix));
    gl.drawArrays(gl.LINES, numVertCubeTri+numVertPyraTri+numVertGroundTri, numVertGroundLine);
    */

    objectPos = [];
    var xPos;
    if(objectDirection)
        xPos = preXPos + elapsedTime/1000;
    else
        xPos = preXPos - elapsedTime / 1000;
    if(xPos > (groundScale-1))
        objectDirection = false;
    else if(xPos < 1)
        objectDirection = true;
    preXPos = xPos;

    for (var z=-7; z<0; z+=3) {
        // draw a cube
        gl.useProgram(program2);
        gl.uniform1i(textureLoc, 1);
        //gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0);    // red
        //gl.uniform4f(diffuseProductLoc, 1.0, 0.0, 0.0, 1.0);

        var rMatrix = mult(rotateY(theta), rotateZ(45));
        modelMatrix = mult(translate(-xPos, 1.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        objectPos.push(vec3(-xPos, 0, z));

        modelMatrix = mult(translate(xPos, 1.3, z), rMatrix);
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        objectPos.push(vec3(xPos, 0, z));

        // draw a hexa-pyramid
        //gl.useProgram(program0);
        gl.useProgram(program1);
        //gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    // blue
        gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0);

        //gl.disable(gl.DEPTH_TEST);
        //gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        modelMatrix = mult(translate(-xPos, -0.5, z), rotateZ(180));
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

        modelMatrix = mult(translate(xPos, -0.5, z), rotateZ(180));
        modelMatrix = mult(trballMatrix, modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

        //gl.disable(gl.BLEND);
        //gl.enable(gl.DEPTH_TEST);
    }

    window.requestAnimationFrame(render);
}

function generateTexCube() {
    vertCubeStart = points.length;
    numVertCubeTri = 0;
    texQuad(1, 0, 3, 2);
    texQuad(2, 3, 7, 6);
    texQuad(3, 0, 4, 7);
    texQuad(4, 5, 6, 7);
    texQuad(5, 4, 0, 1);
    texQuad(6, 5, 1, 2);
}

function texQuad(a, b, c, d) {
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0)
    ];

    vertexNormals = [
        vec4(-0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735, -0.57735, -0.57735, 0.0),
        vec4( 0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735,  0.57735, -0.57735, 0.0),
        vec4(-0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735, -0.57735,  0.57735, 0.0),
        vec4( 0.57735,  0.57735,  0.57735, 0.0),
        vec4(-0.57735,  0.57735,  0.57735, 0.0)
    ];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];

    // two triangles: (a, b, c) and (a, c, d)
    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[b]);
    normals.push(vertexNormals[b]);
    texCoords.push(texCoord[1]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[a]);
    normals.push(vertexNormals[a]);
    texCoords.push(texCoord[0]);
    numVertCubeTri++;

    points.push(vertexPos[c]);
    normals.push(vertexNormals[c]);
    texCoords.push(texCoord[2]);
    numVertCubeTri++;

    points.push(vertexPos[d]);
    normals.push(vertexNormals[d]);
    texCoords.push(texCoord[3]);
    numVertCubeTri++;
}

function generateTexGround(scale) {
    vertGroundStart = points.length;
    numVertGroundTri = 0;
    for(var x=-scale; x<scale; x++) {
        for(var z=-scale; z<scale; z++) {
            // two triangles
            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0,0));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0, 1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1, 1));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0, 0));
            numVertGroundTri++;
            
            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1,1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1, 0));
            numVertGroundTri++;
        }
    }
    /*
    numVertGroundLine = 0;
    // grid lines
    for(var x=-scale; x<=scale; x++) {
        points.push(vec4(x, -1.0, -scale, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
        points.push(vec4(x, -1.0, scale, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
    }
    for(var z=-scale; z<=scale; z++) {
        points.push(vec4(-scale, -1.0, z, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
        points.push(vec4(scale, -1.0, z, 1.0));
        normals.push(vec4(0.0, 0.0, 0.0, 0.0));
        numVertGroundLine++;
    }
    */
}

function generateHexaPyramid() {
    vertPyraStart = points.length;
    numVertPyraTri = 0;
    const vertexPos = [
        vec4(0.0, 0.5, 0.0, 1.0),
        vec4(1.0, 0.5, 0.0, 1.0),
        vec4(0.5, 0.5, -0.866, 1.0),
        vec4(-0.5, 0.5, -0.866, 1.0),
        vec4(-1.0, 0.5, 0.0, 1.0),
        vec4(-0.5, 0.5, 0.866, 1.0),
        vec4(0.5, 0.5, 0.866, 1.0),
        vec4(0.0, -1.0, 0.0, 1.0)
    ];

    const vertexNormal = [
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.5, 0.0, -0.866, 0.0),
        vec4(-0.5, 0.0, -0.866, 0.0),
        vec4(-1.0, 0.0, 0.0, 0.0),
        vec4(-0.5, 0.0, 0.866, 0.0),
        vec4(0.5, 0.0, 0.866, 0.0),
        vec4(0.0, -1.0, 0.0, 0.0)
    ];

    numVertPyraTri = 0;
    for (var i=1; i<6; i++) {
        points.push(vertexPos[0]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;
        points.push(vertexPos[i+1]);
        normals.push(vertexNormal[0]);
        numVertPyraTri++;

        points.push(vertexPos[7]);
        normals.push(vertexNormal[7]);
        numVertPyraTri++;
        points.push(vertexPos[i+1]);
        normals.push(vertexNormal[i+1]);
        numVertPyraTri++;
        points.push(vertexPos[i]);
        normals.push(vertexNormal[i]);
        numVertPyraTri++;
    }
    points.push(vertexPos[0]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormal[0]);
    numVertPyraTri++;

    points.push(vertexPos[7]);
    normals.push(vertexNormal[7]);
    numVertPyraTri++;
    points.push(vertexPos[1]);
    normals.push(vertexNormal[1]);
    numVertPyraTri++;
    points.push(vertexPos[6]);
    normals.push(vertexNormal[6]);
    numVertPyraTri++;
}
