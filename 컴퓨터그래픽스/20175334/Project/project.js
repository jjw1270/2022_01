var gl;
var points = [];
var normals = [];
var texCoords = [];

var program0, program1, program2;        // 0:color, 1:phong, 2:texture mapping
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertCubeTri, vertPyraStart, numVertPyraTri, vertGroundStart, numVertGroundTri;
var vertBodyStart, numVertBodyTri;

var eyePos = vec3(0.0, 1.0, 50.0);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(0.0, 0.0, -0.7071);

var theta = 0;
var prevTime = new Date();

var isStart = false;
var isGroundCreate = false;
var isObjCreate = false;
var groundPosZ = 0;
var objPosZ = [];
var rand_obj = [];
var rand_x = [];
var pyraColor = [];
var objTex = [];

const objectPos = [
    vec3(-3, 0, -5),    vec3(3, 0, -5),
    vec3(-3, 0, -3),    vec3(3, 0, -3),
    vec3(-3, 0, -1),    vec3(3, 0, -1)
];

function detectCollision(newPosX, newPosZ){
    for(var index = 0; index<objectPos.length; index++){
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

    generateTexGround();
    generateTexCube();
    generateHexaPyramid();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);    //겹쳤을 때 선이 더 잘보이게끔
    gl.polygonOffset(0.01, 1);

    // Load shaders and initialize attribute buffers
    program0 = initShaders(gl, "colorVS", "colorFS");   //id로 찾는다
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

    /////////////////////////////////////////////////
    //program1 : phong shading

    program1 = initShaders(gl, "phongVS", "phongFS");
    gl.useProgram(program1);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program1, "vPosition");
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

    projectionMatrixLoc = gl.getUniformLocation(program1, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program1);

    //////////////////////////////////////////////////////////////////
    //program2 : texture mapping

    program2 = initShaders(gl, "texMapVS", "texMapFS");
    gl.useProgram(program2);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

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

    projectionMatrixLoc = gl.getUniformLocation(program2, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setLighting(program2);
    setTexture();

    // Event listeners for buttons
    document.getElementById("start").onclick = function () {
        if(!isStart){
            isStart = true;
        }
    };

    render();
};

window.onkeydown = function(event) {
    var sinTheta = Math.sin(0.1);
    var cosTheta = Math.cos(0.1);
    switch (event.keyCode) {
        case 37:    // left arrow
        case 65:    // 'A'
        case 97:    // 'a'
            if(eyePos[0] > -3)
                eyePos[0] -= 1;
            break;
        case 39:    // right arrow
        case 68:    // 'D'
        case 100:   // 'd'
            if(eyePos[0] < 3)
                eyePos[0] += 1;
            break;
        case 32:  //space
            if(!isStart){
                isStart = true;
            }
            break;
        // case 38:    // up arrow
        // case 87:    // 'W'
        // case 119:   // 'w'
        //     var newPosX = eyePos[0] + 0.5 * cameraVec[0];
        //     var newPosZ = eyePos[2] + 0.5 * cameraVec[2];
        //     //if (newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10 && !detectCollision(newPosX, newPosZ)) {
        //         eyePos[0] = newPosX;
        //         eyePos[2] = newPosZ;
        //     //}
        //     break;
        // case 40:    // down arrow
        // case 83:    // 'S'
        // case 115:   // 's'
        //     var newPosX = eyePos[0] - 0.5 * cameraVec[0];
        //     var newPosZ = eyePos[2] - 0.5 * cameraVec[2];
        //     //if (newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10 && !detectCollision(newPosX, newPosZ)) {
        //         eyePos[0] = newPosX;
        //         eyePos[2] = newPosZ;
        //     //}
            // break;
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
};

function setTexture(){
    var image0 = new Image();
    image0.src = "../images/brick2.bmp"

    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var image1 = new Image();
    image1.src = "../images/crate.bmp"

    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var image2 = new Image();
    image2.src = "../images/pocket.bmp"

    var texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var image3 = new Image();
    image3.src = "../images/logo.bmp"

    var texture3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    atPos[0] = eyePos[0] + cameraVec[0];    //경과시간 만큼만 이동하도록 시간을 곱해야함
    atPos[1] = eyePos[1] + cameraVec[1];
    atPos[2] = eyePos[2] + cameraVec[2];
    var viewMatrix = lookAt(eyePos, atPos, upVec);
    gl.useProgram(program0);
    gl.uniformMatrix4fv(viewMatrixLoc0, false, flatten(viewMatrix));
    gl.useProgram(program1);
    gl.uniformMatrix4fv(viewMatrixLoc1, false, flatten(viewMatrix));
    gl.useProgram(program2);
    gl.uniformMatrix4fv(viewMatrixLoc2, false, flatten(viewMatrix));

    let currTime = new Date();
    let elapsedTime = currTime.getTime() - prevTime.getTime();
    theta += (elapsedTime / 10);
    prevTime = currTime;

    if(isStart){
        eyePos[2] = eyePos[2] - elapsedTime/100;    //앞으로 이동
        var rMatrix = mult(rotateX(5*theta), rotateZ(180));
    }
    else{
        var rMatrix = rotateZ(180);
    }
    
    var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");
    
    // draw the ground infin
    if(parseInt(theta)/100 % 3 == 0 && isStart){
        if(!isGroundCreate){
            isGroundCreate = true;
            console.log("adfadf");
            groundPosZ = eyePos[2]-25;
        }
    }
    else isGroundCreate = false;

    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 0);
    // gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(trballMatrix));
    // gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);
    modelMatrix = translate(0, -1, groundPosZ);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);
    
    // // draw a cube
    // gl.useProgram(program2);
    // gl.uniform1i(textureLoc, 1);
    // //gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0);    // red
    // //gl.uniform4f(diffuseProductLoc, 1.0, 0.0, 0.0,  1.0);

    // var rMatrix = mult(rotateY(theta), rotateZ(45));
    // modelMatrix = mult(translate(-2.5, 0, 45), rMatrix);
    // modelMatrix = mult(trballMatrix, modelMatrix);
    // gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    // gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    // var rMatrix = mult(rotateY(theta), rotateZ(45));
    // modelMatrix = mult(translate(0, 0, 40), rMatrix);
    // modelMatrix = mult(trballMatrix, modelMatrix);
    // gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    // gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    // var rMatrix = mult(rotateY(theta), rotateZ(45));
    // modelMatrix = mult(translate(2.5, 0, 45), rMatrix);
    // modelMatrix = mult(trballMatrix, modelMatrix);
    // gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    // gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    
    if(isStart){
        if(parseInt(theta)/100 % 6 == 0){
            //obstacle pos
            for(var i=0; i<5; i++){
                rand_x[i] = Math.floor(Math.random() * 3 + 1);  //1~3
                switch(rand_x[i]){
                    case 1:
                        rand_x[i] = -2.5;
                        break;
                    case 2:
                        rand_x[i] = 0;
                        break;
                    case 3:
                        rand_x[i] = 2.5;
                        break;
                }
                    objPosZ[i] = eyePos[2]-20-i*10;
                    rand_obj[i] = Math.floor(Math.random() * 2 + 1);  //1~2
                    pyraColor = [Math.random(), Math.random(), Math.random()];
                    objTex[i] = Math.floor(Math.random() * 3 + 1);
            }
            
            
        }
        //draw obstacle
        for(var i = 0; i<5; i++){
            if(rand_obj[i] == 1){
                // draw a cube
                gl.useProgram(program2);
                gl.uniform1i(textureLoc, objTex[i]);
                //gl.uniform4f(uColorLoc, 1.0, 0.0, 0.0, 1.0);    // red
                //gl.uniform4f(diffuseProductLoc, 1.0, 0.0, 0.0,  1.0);

                var rMatrix2 = mult(rotateY(theta), rotateZ(45));
                modelMatrix = mult(translate(rand_x[i], 0, objPosZ[i]), rMatrix2);
                gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
                gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
            }
            else if(rand_obj[i] == 2){
                // draw a hexa-pyramid
                gl.useProgram(program0);
                //gl.useProgram(program1);
                gl.uniform4f(uColorLoc, pyraColor[0], pyraColor[1], pyraColor[2], 1.0);    //translucent blue
                //gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0);
                
                modelMatrix = mult(translate(rand_x[i], 0, objPosZ[i]), rotateZ(180));
                gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
                gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

            }
        }
        
    } 

    //Player
    // draw a ears
    gl.useProgram(program1);
    //gl.useProgram(program1);
    //gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    //translucent blue
    gl.uniform4f(diffuseProductLoc, 0.7, 1.0, 1.0, 1.0);
    
    modelMatrix = rotateZ(150);
    modelMatrix = mult(scalem(0.2,0.2,0.2), modelMatrix);
    modelMatrix = mult(translate(eyePos[0]-0.4, eyePos[1]-0.7, eyePos[2]-1.7), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    modelMatrix = rotateZ(-150);
    modelMatrix = mult(scalem(0.2,0.2,0.2), modelMatrix);
    modelMatrix = mult(translate(eyePos[0]+0.4, eyePos[1]-0.7, eyePos[2]-1.7), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    // draw a leg
    gl.useProgram(program1);
    //gl.useProgram(program1);
    //gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    //translucent blue
    gl.uniform4f(diffuseProductLoc, 1.0, 1.0, 0.0, 1.0);
    
    modelMatrix = rMatrix;
    modelMatrix = mult(scalem(0.4,0.6,1.0), modelMatrix);
    modelMatrix = mult(translate(eyePos[0]-0.4, eyePos[1]-1.8, eyePos[2]-2.5), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    modelMatrix = rMatrix;
    modelMatrix = mult(scalem(0.4,0.6,1.0), modelMatrix);
    modelMatrix = mult(translate(eyePos[0]+0.4, eyePos[1]-1.8, eyePos[2]-2.5), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    // draw a body
    gl.useProgram(program1);
    //gl.useProgram(program1);
    //gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    //translucent blue
    gl.uniform4f(diffuseProductLoc, 1.0, 0.6, 0.6, 1.0);

    modelMatrix = rotateX(180);
    modelMatrix = mult(scalem(0.8,0.4,0.8), modelMatrix);
    modelMatrix = mult(translate(eyePos[0], eyePos[1]-1, eyePos[2]-2), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    // draw a life_count
    gl.useProgram(program0);
    //gl.useProgram(program1);
    gl.uniform4f(uColorLoc, 0.0, 0.0, 1.0, 0.5);    //translucent blue
    //gl.uniform4f(diffuseProductLoc, 0.0, 0.0, 1.0, 1.0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    modelMatrix = mult(translate(rand_x[i], 0, objPosZ[i]), rotateZ(180));
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertPyraStart, numVertPyraTri);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

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
        vec2(0,0),
        vec2(0,1),
        vec2(1,1),
        vec2(1,0)
    ];

    // two triangles: (a, b, c) and (a, c, d)
    //solid colored faces
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

function generateTexGround() {
    vertGroundStart = points.length;
    numVertGroundTri = 0;
    for(var x=-4.5; x<4.5; x++) {
        for(var z=-100; z<100; z++) {
            // two triangles
            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0,0));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0,1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1,1));
            numVertGroundTri++;

            points.push(vec4(x, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(0,0));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z+1, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1,1));
            numVertGroundTri++;

            points.push(vec4(x+1, -1.0, z, 1.0));
            normals.push(vec4(0.0, 1.0, 0.0, 0.0));
            texCoords.push(vec2(1,0));
            numVertGroundTri++;
        }
    }
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
