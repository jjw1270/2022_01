var gl;
var points = [];
var normals = [];
var texCoords = [];

var program0, program1, program2;        // 0:color, 1:phong, 2:texture mapping
var modelMatrixLoc0, viewMatrixLoc0, modelMatrixLoc1, viewMatrixLoc1, modelMatrixLoc2, viewMatrixLoc2;

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
var vertCubeStart, numVertCubeTri, vertPyraStart, numVertPyraTri, vertGroundStart, numVertGroundTri;
var vertBodyStart, numVertBodyTri;

var eyePos = vec3(0.0, 0.0, 0.0);
var atPos = vec3(0.0, 0.0, 0.0);
var upVec = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(0.0, 0.0, -0.7071);

var time;

var music = new Audio('music.mp3');

var isStart = false;
var isGameOver = false;
var backGroundColor = [0.0, 0.0, 0.0];
var speed = [];
var nodeCount = [];
var nodeNum;
var xPos = [];
var colorR = [];
var colorG = [];
var colorB = [];

var isCollision1 = false;
var isCollision2 = false;
var isCollision3 = false;

var hitPointColor = [vec4(0.0, 0.3, 1.0, 0.2), vec4(0.0, 0.3, 1.0, 0.2), vec4(0.0, 0.3, 1.0, 0.2)];

var comboScale = [0.35, 0.35, 0.35];
var comboColor;
var comboCount = 0;

var score = 0;

var objectPos = [];   //오브젝트 중심 위치

function detectCollision(newPosX, newPosY){
    for(var index = 0; index<objectPos.length; index++){
        if(Math.abs(newPosX-objectPos[index][0]) < 0.65 && Math.abs(newPosY-objectPos[index][1]) < 0.1)
            return [true, index];
    }
    return false;
};

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
        window.location.reload();
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
            time = 0;
            nodeNum = 0;
            isStart = true;
            music.loop = false;
            music.play();
        }
    };

    music.addEventListener("ended", function(){
        isStart = false;
        alert("Your Score : " + score);
    })

    render();
};

window.onkeydown = function(event) {
    switch (event.keyCode) {
        case 37:    // left arrow
            hitPointColor[0] = vec4(0.6, 0.6, 1.0, 0.3);
            if(detectCollision(-0.86, -1.5)[0]){
                //console.log("hit-1");
                xPos[detectCollision(-0.86, -1.55)[1]] = 99;
                comboCount++;
                score += 100;
                comboScale = [0.5, 0.5, 0.5];
                setTimeout(function () {
                    comboScale = [0.35, 0.35, 0.35];
                }, 100);
            }
            setTimeout(function () {
                hitPointColor[0] = vec4(0.0, 0.3, 1.0, 0.2);
            }, 50);
            break;
        case 40:    // down arrow
            hitPointColor[1] = vec4(0.6, 0.6, 1.0, 0.3);
            if(detectCollision(0, -1.5)[0]){
                //console.log("hit0");
                xPos[detectCollision(0, -1.55)[1]] = 99;
                comboCount++;
                score += 100;
                comboScale = [0.5, 0.5, 0.5];
                setTimeout(function () {
                    comboScale = [0.35, 0.35, 0.35];
                }, 100);
            }
            setTimeout(function () {
                hitPointColor[1] = vec4(0.0, 0.3, 1.0, 0.2);
            }, 50);
            break;
        case 39:    // right arrow
            hitPointColor[2] = vec4(0.6, 0.6, 1.0, 0.3);
            if(detectCollision(0.86, -1.55)[0]){
                //console.log("hit1");
                xPos[detectCollision(0.86, -1.5)[1]] = 99;
                comboCount++;
                score += 100;
                comboScale = [0.5, 0.5, 0.5];
                setTimeout(function () {
                    comboScale = [0.35, 0.35, 0.35];
                }, 100);
            }
            setTimeout(function () {
                hitPointColor[2] = vec4(0.0, 0.3, 1.0, 0.2);
            }, 50);
            break;
    }
};

function setLighting(program) {
    var lightSrc = [0.0, -2.0, 4.0, 0.0];
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

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), 30.0);
    gl.uniform3fv(gl.getUniformLocation(program, "eyePos"), flatten(eyePos));
};

function setTexture(){
    var image0 = new Image();
    image0.src = "../images/neon.bmp"

    var texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image0);

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
    
    var uColorLoc = gl.getUniformLocation(program0, "uColor");
    var diffuseProductLoc = gl.getUniformLocation(program1, "diffuseProduct");
    var textureLoc = gl.getUniformLocation(program2, "texture");

    //draw a backGround
    gl.useProgram(program2);
    gl.uniform1i(textureLoc, 0);
    modelMatrix = translate(-0.5, -1.5, 0);
    modelMatrix = mult(rotateX(-90), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc2, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);

    gl.useProgram(program1);
    gl.uniform4f(diffuseProductLoc, backGroundColor[0], backGroundColor[1], backGroundColor[2], 1.0);
    
    modelMatrix = mult(scalem(10,10,1), rotateX(-90));
    modelMatrix = mult(translate(-5, 0, -7), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertGroundStart, numVertGroundTri);

    //draw three hitPoints
    gl.useProgram(program0);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.uniform4fv(uColorLoc, hitPointColor[0]); 
    modelMatrix = mult(rotateY(-3), rotateX(20));
    modelMatrix = mult(scalem(1.75, 0.3, 0.2), modelMatrix);
    modelMatrix = mult(translate(-2, -3.5, -5), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    gl.uniform4fv(uColorLoc, hitPointColor[1]); 
    modelMatrix = mult(rotateY(0), rotateX(20));
    modelMatrix = mult(scalem(1.75, 0.3, 0.2), modelMatrix);
    modelMatrix = mult(translate(0, -3.5, -5), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    gl.uniform4fv(uColorLoc, hitPointColor[2]); 
    modelMatrix = mult(rotateY(3), rotateX(20));
    modelMatrix = mult(scalem(1.75, 0.3, 0.2), modelMatrix);
    modelMatrix = mult(translate(2, -3.5, -5), modelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc0, false, flatten(modelMatrix));
    gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    //GameStart
    if(isStart){
        time += 1;
        //console.log(time);
        

        //backGround Color
        if(time % 100 == 1){
            backGroundColor = [Math.random(), Math.random(), Math.random()];
        }

        switch(time){   //노가다~
            case 100:
                makeNode(-0.86);
                break;
            case 200:
                makeNode(0.86);
                break;
            case 300:
                makeNode(0.86);
                makeNode(0);
                break;
            case 350:
                makeNode(-0.86);
                break;
            case 400:
                makeNode(0);
                break;
            case 450:
                makeNode(-0.86);
                makeNode(0);
                makeNode(0.86);
                break;
            case 500:
                makeNode(-0.86);
                break;
            case 550:
                makeNode(0.86);
                makeNode(0);
                break;
            case 600:
                makeNode(0.86);
                break;
            case 650:
                makeNode(0);
                break;
            case 700:
                makeNode(-0.86);
                break;
            case 750:
                makeNode(0.86);
                makeNode(0);
                break;
            case 800:
                makeNode(0.86);
                makeNode(0);
                break;
            case 850:
                makeNode(-0.86);
                makeNode(0.86);
                makeNode(0);
                break;
            case 950:
                makeNode(0);
                break;
            case 1100:
                makeNode(-0.86);
                break;
            case 1300:
                makeNode(0.86);
                makeNode(0);
                break;
            case 1350:
                makeNode(-0.86);
                break;
            case 1400:
                makeNode(0);
                break;
            case 1450:
                makeNode(-0.86);
                makeNode(0);
                makeNode(0.86);
                break;
            case 1500:
                makeNode(-0.86);
                makeNode(0);
                break;
            case 1550:
                makeNode(-0.86);
                makeNode(0.86);
                break;
            case 1600:
                makeNode(-0.86);
                makeNode(0.86);
                break;
            case 1650:
                makeNode(0);
                makeNode(-0.86);
                break;
            case 1700:
                makeNode(-0.86);
                break;
            case 1750:
                makeNode(0.86);
                makeNode(0);
                break;
            case 1800:
                makeNode(-0.86);
                makeNode(0.86);
                break;
            case 1900:
                makeNode(0);
                break;
            case 2000:
                makeNode(0);
                makeNode(0.86);
                break;
            case 2000:
                makeNode(-0.86);
                break;
            case 2200:
                makeNode(0.86);
                break;
            case 2300:
                makeNode(0.86);
                makeNode(0);
                break;
            case 2350:
                makeNode(-0.86);
                break;
            case 2400:
                makeNode(0);
                break;
            case 2450:
                makeNode(-0.86);
                makeNode(0);
                makeNode(0.86);
                break;
            case 2500:
                makeNode(-0.86);
                break;
            case 2550:
                makeNode(0.86);
                makeNode(0);
                break;
            case 2600:
                makeNode(0.86);
                break;
            case 2650:
                makeNode(0);
                break;
            case 2700:
                makeNode(-0.86);
                break;
            case 2750:
                makeNode(0.86);
                makeNode(0);
                break;
            case 2800:
                makeNode(0.86);
                makeNode(0);
                break;
            case 2900:
                makeNode(-0.86);
                makeNode(0.86);
                makeNode(0);
                break;
            case 3000:
                makeNode(-0.86);
                makeNode(0.86);
                makeNode(0);
                break;
            case 3050:
                makeNode(0.86);
                break;
            case 3150:
                makeNode(0.86);
                break;
            case 3300:
                makeNode(0.86);
                makeNode(0);
                break;
            case 3350:
                makeNode(-0.86);
                break;
            case 3400:
                makeNode(0);
                break;
            case 3450:
                makeNode(0);
                makeNode(0.86);
                break;
            case 3500:
                makeNode(-0.86);
                break;
            case 3550:
                makeNode(0.86);
                makeNode(0);
                break;
            case 3600:
                makeNode(0.86);
                break;
            case 3650:
                makeNode(0);
                break;
            case 3700:
                makeNode(-0.86);
                break;
            case 3750:
                makeNode(0.86);
                makeNode(0);
                break;
            case 3800:
                makeNode(0.86);
                makeNode(0);
                break;
            case 3900:
                makeNode(-0.86);
                makeNode(0);
                break;
        }

        for(var i=0; i<speed.length; i++){
            if(time < 1500){
                speed[i] += 0.01;
            }
            else if(time < 2000){
                speed[i] += 0.0125;
            }
            else if(time < 2500){
                speed[i] += 0.015;
            }
            else if(time < 3000){
                speed[i] += 0.0175;
            }
            else if(time < 4000){
                speed[i] += 0.02;
            }
            else{
                time = 0;
            }
            objectPos[i] = vec2(xPos[i], 4-speed[i]);
        }

        //draw nodes
        gl.useProgram(program1);
        for(var i = 0; i<nodeNum; i++){
            gl.uniform4f(diffuseProductLoc, colorR[i], colorG[i], colorB[i], 1.0);
            modelMatrix = mult(translate(xPos[i], 4-speed[i], -2.2), scalem(0.7, 0.1, 0.1));
            gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
            gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
        }

        //fail
        if(detectCollision(-0.86, -2.2)[0] && !isCollision1){
            isCollision1 = true;
            comboCount=0;
            xPos[detectCollision(-0.86, -2.2)[1]] = 99;
        }
        if(detectCollision(0, -2.2)[0] && !isCollision2){
            isCollision2 = true;
            comboCount=0;
            xPos[detectCollision(0, -2.2)[1]] = 99;
        }
        if(detectCollision(0.86, -2.2)[0] && !isCollision3){
            isCollision3 = true;
            comboCount=0;
            xPos[detectCollision(-0.86, -2.2)[1]] = 99;
        }

        if(isCollision1){
            setTimeout(function () {
                isCollision1 = false;
            }, 250);
        }
        if(isCollision2){
            setTimeout(function () {
                isCollision2 = false;
            }, 250);
        }
        if(isCollision3){
            setTimeout(function () {
                isCollision3 = false;
            }, 250);
        }

        switch(comboCount){
            case 0:
                comboColor = vec4(1.0, 0.0, 0.0, 1.0);
                break;
            case 5:
                comboColor = vec4(1.0, 0.5, 0.0, 1.0);
                break;
            case 10:
                comboColor = vec4(1.0, 1.0, 0.0, 1.0);
                break;
            case 20:
                comboColor = vec4(0.5, 1.0, 0.0, 1.0);
                break;
            case 30:
                comboColor = vec4(0.0, 1.0, 0.0, 1.0);
                break;
            case 40:
                comboColor = vec4(0.0, 1.0, 0.5, 1.0);
                break;
            case 50:
                comboColor = vec4(0.0, 0.0, 1.0, 1.0);
                break;
            case 60:
                comboColor = vec4(0.5, 0.5, 1.0, 1.0);
                break;
        }

        gl.useProgram(program1);
        //draw combo
        gl.uniform4fv(diffuseProductLoc, comboColor);
        
        modelMatrix = scalem(comboScale[0], comboScale[1], comboScale[2]);
        modelMatrix = mult(translate(2.2, -2.5, -3), modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);

        modelMatrix = scalem(comboScale[0], comboScale[1], comboScale[2]);
        modelMatrix = mult(translate(-2.2, -2.5, -3), modelMatrix);
        gl.uniformMatrix4fv(modelMatrixLoc1, false, flatten(modelMatrix));
        gl.drawArrays(gl.TRIANGLES, vertCubeStart, numVertCubeTri);
    }

    window.requestAnimationFrame(render);
}

function makeNode(xpos){
    xPos[nodeNum] = xpos;
    speed[nodeNum] = 0;
    colorR[nodeNum] = Math.random();
    colorG[nodeNum] = Math.random();
    colorB[nodeNum] = Math.random();

    nodeNum++;
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
    for(var x=-1; x<=1; x++) {
        for(var z=-3; z<3; z++) {
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
