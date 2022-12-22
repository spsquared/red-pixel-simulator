var pixelSimulator = function(processingInstance) {
    with (processingInstance) {
        size(600, 600);
        
        var maxFrameRate = 60;
        frameRate(maxFrameRate);
        
        // optimized options
        var optimizedLiquids = false;
        var optimizedLags = false;
        
        // fade effect
        var fadeEffect = 100;
        
        // replace the save code
        // NOTE: DO NOT USE DECIMAL GRID SIZES!
        var saveCode = "100;air-100:piston_rotator_right:air-10:piston_left:air:piston_rotator_left:nuke_diffuser-6:piston_rotator_right:piston_left:air-77:piston_rotator_left:piston_rotator_right:air-10:piston_left:air:piston_rotator_left:nuke_diffuser:nuke-4:nuke_diffuser:piston_rotator_right:piston_left:air-77:piston_rotator_left:piston_rotator_right:air-10:piston_left:air:piston_rotator_left:nuke_diffuser:cloner_down-4:nuke_diffuser:piston_rotator_right:piston_left:air-77:piston_rotator_left:air-2000:nuke_diffuser-20:air-80:{air:pump:}9|air:{nuke_diffuser:air-99:}2|nuke_diffuser:air-83:block-13:air-3:nuke_diffuser:air-83:block:lava-11:block:air-3:nuke_diffuser:air-83:block:cloner_down-11:block:air-3:nuke_diffuser:{air-83:block:air-11:block:air-3:nuke_diffuser:}4|{air-83:block:air-11:block:air-4:}3|air-83:{block:air-99:}56|";
        var startPaused = false;
        
        // variable setup
        
        var debugInfo = false;
        
        var animationTime = 0;
        var frames = [];
        var lastFpsList = 0;
        var fpsList = [];
        // textFont(createFont("monospace"), 10);
        
        var gridSize = 100;
        
        var xScale = width / gridSize;
        var yScale = height / gridSize;
        
        var grid = [];
        var nextGrid = [];
        var lastGrids = [];
        
        var gridPaused = startPaused;
        var simulatePaused = false;
        
        noiseDetail(3, 0.6);
        
        var createGrid = function () {
            xScale = width / gridSize;
            yScale = height / gridSize;
            grid = [];
            nextGrid = [];
            for (var i = 0; i < gridSize; i++) {
                grid.push([]);
                nextGrid.push([]);
                for (var j = 0; j < gridSize; j++) {
                    grid[i].push("air");
                    nextGrid[i].push(null);
                }
            }
        };
        createGrid();
        
        if (saveCode.length !== 0) {
            try {
                var x = 0;
                var y = 0;
                var incrementPosition = function () {
                    x += 1;
                    if (x === gridSize) {
                        x = 0;
                        y += 1;
                    }
                    if (y === gridSize) {
                        y -= 1;
                        x = gridSize - 1;
                    }
                };
                var parseSaveCode = function (inputSaveCode) {
                    var stringStartIndex = 0;
                    var string = "";
                    var numberStartIndex = 0;
                    var loopedSaveCodeStartIndex = 0;
                    var loopTimesStartIndex = 0;
                    var inLoop = 0;
                    for (var i = 0; i < inputSaveCode.length; i++) {
                        if (inputSaveCode[i] === ":" && inLoop === 0) {
                            if (string === "") {
                                string = inputSaveCode.substring(stringStartIndex, i);
                                grid[y][x] = string;
                                incrementPosition();
                                string = "";
                                stringStartIndex = i + 1;
                            }
                            else {
                                for (var j = 0; j < parseInt(inputSaveCode.substring(numberStartIndex, i), 10); j++) {
                                    grid[y][x] = string;
                                    incrementPosition();
                                }
                                string = "";
                                stringStartIndex = i + 1;
                            }
                        }
                        if (inputSaveCode[i] === "-" && inLoop === 0) {
                            string = inputSaveCode.substring(stringStartIndex, i);
                            numberStartIndex = i + 1;
                        }
                        if (inputSaveCode[i] === ";" && inLoop === 0) {
                            gridSize = parseInt(inputSaveCode.substring(0, i), 10);
                            createGrid();
                            string = "";
                            stringStartIndex = i + 1;
                        }
                        if (inputSaveCode[i] === "{") {
                            if (inLoop === 0) {
                                loopedSaveCodeStartIndex = i + 1;
                            }
                            inLoop += 1;
                        }
                        if (inputSaveCode[i] === "}") {
                            inLoop -= 1;
                            if (inLoop === 0) {
                                loopTimesStartIndex = i + 1;
                            }
                        }
                        if (inputSaveCode[i] === "|") {
                            if (inLoop === 0) {
                                var loopTimes = parseInt(inputSaveCode.substring(loopTimesStartIndex, i), 10);
                                for (var j = 0; j < loopTimes; j++) {
                                    parseSaveCode(inputSaveCode.substring(loopedSaveCodeStartIndex, loopTimesStartIndex - 1));
                                }
                                string = "";
                                stringStartIndex = i + 1;
                            }
                        }
                    }
                };
                parseSaveCode(saveCode);
            }
            catch (error) {
                throw "Invalid Save Code";
            }
        }
        
        var drawPixel = function (x, y, width, height) {
            rect(x * xScale, y * yScale, xScale * width, yScale * height);
        };
        var updateTouchingPixel = function (x, y, range, type, action) {
            var touchingPixel = false;
            for (var i = -range; i <= range; i++) {
                if (x + i >= 0 && x + i <= gridSize - 1) {
                    for (var j = -range; j <= range; j++) {
                        if (y + j >= 0 && y + j <= gridSize - 1) {
                            if (abs(i) + abs(j) <= range && abs(i) + abs(j) !== 0) {
                                if (grid[y + j][x + i] === type) {
                                    action(x + i, y + j);
                                    touchingPixel = true;
                                }
                            }
                        }
                    }
                }
            }
            return touchingPixel;
        };
        var updateTouchingAnything = function (x, y, range, action) {
            var touchingPixel = false;
            for (var i = -range; i <= range; i++) {
                if (x + i >= 0 && x + i <= gridSize - 1) {
                    for (var j = -range; j <= range; j++) {
                        if (y + j >= 0 && y + j <= gridSize - 1) {
                            if (abs(i) + abs(j) <= range && abs(i) + abs(j) !== 0) {
                                if (grid[y + j][x + i] !== "air") {
                                    action(x + i, y + j);
                                    touchingPixel = true;
                                }
                            }
                        }
                    }
                }
            }
            return touchingPixel;
        };
        
        // }
        
        var explode = function (x, y, size, chain) {
            nextGrid[y][x] = "air";
            grid[y][x] = "block";
            for (var i = -size; i <= size; i++) {
                for (var j = -size; j <= size; j++) {
                    if (x + i >= 0 && x + i < gridSize && y + j >= 0 && y + j < gridSize) {
                        if (random() < 1 - (dist(x, y, x + i, y + j) / (size * 1.2))) {
                            // if (grid[y + j][x + i] === "nuke" || nextGrid[y + j][x + i] === "nuke2") {
                            //     explode(x+i, y+j, 10/chain, chain + 0.5);
                            // } else if (nextGrid[y + j][x + i] === "huge_nuke") {
                            //     explode(x+i, y+j, 20/chain, chain + 0.5);
                            // } else if (nextGrid[y + j][x + i] === "very_huge_nuke") {
                            //     explode(x+i, y+j, 40/chain, chain + 0.5);
                            // } else {
                            nextGrid[y + j][x + i] = "air";
                            // }
                        }
                    }
                }
            }
        };
        
        var pixels = {
            "air": {
                draw: function (x, y, width, height, opacity) {
                    // noStroke();
                    // fill(255, 255, 255, opacity * 255);
                    // drawPixel(x,y,width,height);
                },
                update: function (x, y) {
        
                },
                key: 48,
            },
            "sand": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 225, 125, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "sand";
                            }
                        }
                        else if (grid[y + 1][x] === "water") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "water";
                                nextGrid[y + 1][x] = "sand";
                            }
                        }
                        else {
                            var validSlidingPositions = [];
                            if (x > 0) {
                                if (grid[y][x - 1] === "air" && grid[y + 1][x - 1] === "air") {
                                    validSlidingPositions.push(-1);
                                }
                            }
                            if (x < gridSize - 1) {
                                if (grid[y][x + 1] === "air" && grid[y + 1][x + 1] === "air") {
                                    validSlidingPositions.push(1);
                                }
                            }
                            if (validSlidingPositions.length > 0) {
                                var slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                                if (nextGrid[y][x] === null && nextGrid[y + 1][x + slidePosition] === null) {
                                    nextGrid[y][x] = "air";
                                    nextGrid[y + 1][x + slidePosition] = "sand";
                                }
                            }
                        }
                    }
                },
                key: 49,
            },
            "water": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    if (optimizedLiquids === true) {
                        fill(75, 50, 255, opacity * 255);
                        drawPixel(x, y, width, height);
                    }
                    else {
                        for (var i = 0; i < width; i++) {
                            for (var j = 0; j < height; j++) {
                                fill(125, 225, 255, opacity * 255);
                                drawPixel(x + i, y + j, 1, 1);
                                fill(125, 0, 125, round(noise((x + i) / 5, (y + j) / 5, animationTime / 20) * 255) * opacity);
                                drawPixel(x + i, y + j, 1, 1);
                            }
                        }
                    }
                },
                update: function (x, y) {
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "concrete";
                        }
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "water";
                            }
                        }
                        else if (grid[y + 1][x] !== "sponge") {
                            var validSlidingPositions = [];
                            var leftX = 0;
                            while (x + leftX > 0) {
                                if (grid[y][x + leftX - 1] === "air") {
                                    if (grid[y + 1][x + leftX - 1] === "air") {
                                        validSlidingPositions.push(leftX - 1);
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                                leftX -= 1;
                            }
                            var rightX = 0;
                            while (x + rightX < gridSize - 1) {
                                if (grid[y][x + rightX + 1] === "air") {
                                    if (grid[y + 1][x + rightX + 1] === "air") {
                                        validSlidingPositions.push(rightX + 1);
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                                rightX += 1;
                            }
                            if (validSlidingPositions.length > 0) {
                                var slidePosition;
                                for (var i = 0; i < validSlidingPositions.length; i++) {
                                    if (slidePosition === undefined) {
                                        slidePosition = validSlidingPositions[i];
                                    }
                                    else if (abs(validSlidingPositions[i]) < abs(slidePosition)) {
                                        slidePosition = validSlidingPositions[i];
                                    }
                                    else if (abs(validSlidingPositions[i]) === abs(slidePosition)) {
                                        if (random() < 0.5) {
                                            slidePosition = validSlidingPositions[i];
                                        }
                                    }
                                }
                                if (nextGrid[y][x] === null) {
                                    if (slidePosition === -1 && nextGrid[y + 1][x + slidePosition] === null) {
                                        nextGrid[y][x] = "air";
                                        nextGrid[y + 1][x + slidePosition] = "water";
                                    }
                                    else if (slidePosition === 1 && nextGrid[y + 1][x + slidePosition] === null) {
                                        nextGrid[y][x] = "air";
                                        nextGrid[y + 1][x + slidePosition] = "water";
                                    }
                                    else if (nextGrid[y][x + slidePosition / abs(slidePosition)] === null) {
                                        nextGrid[y][x] = grid[y][x + slidePosition / abs(slidePosition)];
                                        nextGrid[y][x + slidePosition / abs(slidePosition)] = "water";
                                    }
                                }
                            }
                        }
                    }
                },
                key: 50,
            },
            "lava": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    if (optimizedLiquids === true) {
                        fill(255, 125, 0, opacity * 255);
                        drawPixel(x, y, width, height);
                    }
                    else {
                        for (var i = 0; i < width; i++) {
                            for (var j = 0; j < height; j++) {
                                fill(255, 0, 0, opacity * 255);
                                drawPixel(x + i, y + j, 1, 1);
                                fill(255, 255, 0, round(noise((x + i) / 5, (y + j) / 5, animationTime / 20) * 255) * opacity);
                                drawPixel(x + i, y + j, 1, 1);
                            }
                        }
                    }
                },
                update: function (x, y) {
                    updateTouchingPixel(x, y, 1, "water", function (actionX, actionY) {
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "concrete";
                        }
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null && random() < 0.5) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "lava";
                            }
                        }
                        else {
                            var validSlidingPositions = [];
                            var leftX = 0;
                            while (x + leftX > 0) {
                                if (grid[y][x + leftX - 1] === "air" || grid[y][x + leftX - 1] === "concrete") {
                                    if (grid[y + 1][x + leftX - 1] === "air") {
                                        validSlidingPositions.push(leftX - 1);
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                                leftX -= 1;
                            }
                            var rightX = 0;
                            while (x + rightX < gridSize - 1) {
                                if (grid[y][x + rightX + 1] === "air" || grid[y][x + rightX + 1] === "concrete") {
                                    if (grid[y + 1][x + rightX + 1] === "air") {
                                        validSlidingPositions.push(rightX + 1);
                                        break;
                                    }
                                }
                                else {
                                    break;
                                }
                                rightX += 1;
                            }
                            if (validSlidingPositions.length > 0) {
                                var slidePosition;
                                for (var i = 0; i < validSlidingPositions.length; i++) {
                                    if (slidePosition === undefined) {
                                        slidePosition = validSlidingPositions[i];
                                    }
                                    else if (abs(validSlidingPositions[i]) < abs(slidePosition)) {
                                        slidePosition = validSlidingPositions[i];
                                    }
                                    else if (abs(validSlidingPositions[i]) === abs(slidePosition)) {
                                        if (random() < 0.5) {
                                            slidePosition = validSlidingPositions[i];
                                        }
                                    }
                                }
                                if (nextGrid[y][x] === null && random() < 0.5) {
                                    if (slidePosition === -1 && nextGrid[y + 1][x + slidePosition] === null) {
                                        nextGrid[y][x] = "air";
                                        nextGrid[y + 1][x + slidePosition] = "lava";
                                    }
                                    else if (slidePosition === 1 && nextGrid[y + 1][x + slidePosition] === null) {
                                        nextGrid[y][x] = "air";
                                        nextGrid[y + 1][x + slidePosition] = "lava";
                                    }
                                    else if (nextGrid[y][x + slidePosition / abs(slidePosition)] === null) {
                                        nextGrid[y][x] = grid[y][x + slidePosition / abs(slidePosition)];
                                        nextGrid[y][x + slidePosition / abs(slidePosition)] = "lava";
                                    }
                                }
                            }
                        }
                    }
                    if (y > 0) {
                        if (random() < 0.125) {
                            var validSlidingPositions = [];
                            if (x > 0) {
                                if ((grid[y][x - 1] === "concrete" || grid[y][x - 1] === "concrete_powder") && (grid[y - 1][x - 1] === "concrete" || grid[y - 1][x - 1] === "concrete_powder")) {
                                    validSlidingPositions.push(-1);
                                }
                            }
                            if (x < gridSize - 1) {
                                if ((grid[y][x + 1] === "concrete" || grid[y][x + 1] === "concrete_powder") && (grid[y - 1][x + 1] === "concrete" || grid[y - 1][x + 1] === "concrete_powder")) {
                                    validSlidingPositions.push(1);
                                }
                            }
                            if (validSlidingPositions.length > 0) {
                                var slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                                if (nextGrid[y][x] === null && nextGrid[y - 1][x + slidePosition] === null) {
                                    nextGrid[y][x] = grid[y - 1][x + slidePosition];
                                    nextGrid[y - 1][x + slidePosition] = "lava";
                                }
                            }
                        }
                    }
                    if (y > 0) {
                        if (random() < 0.5) {
                            if (y === gridSize - 1 || grid[y + 1][x] === "lava") {
                                if (grid[y - 1][x] === "concrete_powder" || grid[y - 1][x] === "concrete") {
                                    if (nextGrid[y][x] === null && nextGrid[y - 1][x] === null) {
                                        nextGrid[y][x] = grid[y - 1][x];
                                        nextGrid[y - 1][x] = "lava";
                                    }
                                }
                            }
                        }
                    }
                },
                key: 51,
            },
            "concrete_powder": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(150, 150, 150, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    if (y > 0) {
                        if (grid[y - 1][x] === "water") {
                            if (nextGrid[y][x] === null && nextGrid[y - 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y - 1][x] = "concrete";
                            }
                        }
                        else if (grid[y - 1][x] === "lava") {
                            if (nextGrid[y][x] === null && nextGrid[y - 1][x] === null && random() < 0.5) {
                                nextGrid[y][x] = "lava";
                                nextGrid[y - 1][x] = "concrete";
                            }
                        }
                    }
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "concrete_powder";
                            }
                        }
                    }
                    updateTouchingPixel(x, y, 1, "water", function (actionX, actionY) {
                        if (nextGrid[y][x] === null) {
                            nextGrid[y][x] = "concrete";
                        }
                    });
                    if (y < gridSize - 2) {
                        var validSlidingPositions = [];
                        if (x > 0) {
                            if (grid[y][x - 1] === "air" && grid[y + 1][x - 1] === "air" && grid[y + 2][x - 1] === "air") {
                                validSlidingPositions.push(-1);
                            }
                        }
                        if (x < gridSize - 1) {
                            if (grid[y][x + 1] === "air" && grid[y + 1][x + 1] === "air" && grid[y + 2][x + 1] === "air") {
                                validSlidingPositions.push(1);
                            }
                        }
                        if (validSlidingPositions.length > 0) {
                            var slidePosition = validSlidingPositions[floor(random(0, validSlidingPositions.length))];
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x + slidePosition] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x + slidePosition] = "concrete_powder";
                            }
                        }
                    }
                },
                key: 52,
            },
            "concrete": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(75, 75, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    if (y > 0) {
                        if (grid[y - 1][x] === "lava") {
                            if (nextGrid[y][x] === null && nextGrid[y - 1][x] === null && random() < 0.25) {
                                nextGrid[y][x] = "lava";
                                nextGrid[y - 1][x] = "concrete_powder";
                            }
                        }
                    }
                    // if(y < gridSize - 1){
                    //     if(grid[y + 1][x] === "water"){
                    //         if(nextGrid[y][x] === null && nextGrid[y + 1][x] === null){
                    //             nextGrid[y][x] = "water";
                    //             nextGrid[y + 1][x] = "concrete";
                    //         }
                    //     }
                    // }
                },
                key: 53,
            },
            "nuke": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(100, 255, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    var explosion = false;
                    var diffused = false;
                    updateTouchingPixel(x, y, 1, "nuke_diffuser", function (actionX, actionY) {
                        diffused = true;
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "nuke";
                            }
                        }
                    }
                    if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { }) === true) {
                        explosion = true;
                    }
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air" || grid[y + 1][x] === "nuke") {
                            explosion = false;
                        }
                    }
                    else {
                        explosion = true;
                    }
                    if (explosion === true && diffused === false) {
                        explode(x, y, 10);
                    }
                },
                key: 54,
            },
            "nuke2": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(100, 255, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "nuke2";
                            }
                        }
                        if (grid[y + 1][x] === "water") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "water";
                                nextGrid[y + 1][x] = "nuke2";
                            }
                        }
                        if (grid[y + 1][x] === "lava") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "lava";
                                nextGrid[y + 1][x] = "nuke2";
                            }
                        }
                        if (grid[y + 1][x] === "air" || grid[y + 1][x] === "water" || grid[y + 1][x] === "lava" || grid[y + 1][x] === "nuke") {
                            return;
                        }
                    }
                    else {
                        explode(x, y, 10, 1.5);
                    }
                    if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { }) === true) {
                        explode(x, y, 10, 1.5);
                    }
                },
                key: null,
            },
            "plant": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 255, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    var validPlant = false;
                    updateTouchingPixel(x, y, 1, "air", function (actionX, actionY) {
                        validPlant = true;
                    });
                    updateTouchingPixel(x, y, 1, "water", function (actionX, actionY) {
                        validPlant = true;
                    });
                    // updateTouchingPixel(x,y,1,"plant",function(actionX,actionY){
                    //     validPlant = true;
                    // });
                    // updateTouchingPixel(x,y,1,"lava",function(actionX,actionY){
                    //     validPlant = false;
                    // });
                    if (validPlant === false) {
                        if (nextGrid[y][x] === null) {
                            nextGrid[y][x] = "water";
                        }
                    }
                    updateTouchingPixel(x, y, 1, "concrete", function (actionX, actionY) {
                        nextGrid[y][x] = "water";
                        if (nextGrid[actionY][actionX] === null) {
                            nextGrid[actionY][actionX] = "plant";
                        }
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "plant";
                            }
                        }
                        if (random() < 0.5) {
                            if (grid[y + 1][x] === "water") {
                                if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                    nextGrid[y][x] = "water";
                                    nextGrid[y + 1][x] = "plant";
                                }
                            }
                        }
                    }
                },
                key: 55,
            },
            "sponge": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(225, 255, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    updateTouchingPixel(x, y, 1, "water", function (actionX, actionY) {
                        nextGrid[y][x] = "air";
                        if (nextGrid[actionY][actionX] === null) {
                            nextGrid[actionY][actionX] = "sponge";
                        }
                    });
                    var validSponge = false;
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "sponge";
                            }
                        }
                        if (random() < 0.25) {
                            if (grid[y + 1][x] === "lava") {
                                if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                    nextGrid[y][x] = "lava";
                                    nextGrid[y + 1][x] = "sponge";
                                }
                            }
                        }
                        if (grid[y + 1][x] === "sand") {
                            validSponge = true;
                        }
                    }
                    if (validSponge === false && random() < 0.125) {
                        if (nextGrid[y][x] === null) {
                            nextGrid[y][x] = "air";
                        }
                    }
                },
                key: 56,
            },
            "pump": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(25, 125, 75, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        if (nextGrid[y][x] === null) {
                            nextGrid[y][x] = "water";
                        }
                    });
                    updateTouchingPixel(x, y, 1, "air", function (actionX, actionY) {
                        if (nextGrid[actionY][actionX] === null && random() < 0.125) {
                            nextGrid[actionY][actionX] = "water";
                        }
                    });
                },
                key: 57,
            },
            "cloner_left": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        if (grid[y][x + 1] !== "air" && grid[y][x + 1] !== "cloner_left" && grid[y][x + 1] !== "cloner_up" && grid[y][x + 1] !== "cloner_right" && grid[y][x + 1] !== "cloner_down") {
                            if (grid[y][x - 1] === "air") {
                                if (nextGrid[y][x - 1] === null) {
                                    nextGrid[y][x - 1] = grid[y][x + 1];
                                }
                            }
                        }
                    }
                },
                key: 65
            },
            "cloner_up": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        if (grid[y + 1][x] !== "air" && grid[y + 1][x] !== "cloner_left" && grid[y + 1][x] !== "cloner_up" && grid[y + 1][x] !== "cloner_right" && grid[y + 1][x] !== "cloner_down") {
                            if (grid[y - 1][x] === "air") {
                                if (nextGrid[y - 1][x] === null) {
                                    nextGrid[y - 1][x] = grid[y + 1][x];
                                }
                            }
                        }
                    }
                },
                key: 87
            },
            "cloner_right": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        if (grid[y][x - 1] !== "air" && grid[y][x - 1] !== "cloner_left" && grid[y][x - 1] !== "cloner_up" && grid[y][x - 1] !== "cloner_right" && grid[y][x - 1] !== "cloner_down") {
                            if (grid[y][x + 1] === "air") {
                                if (nextGrid[y][x + 1] === null) {
                                    nextGrid[y][x + 1] = grid[y][x - 1];
                                }
                            }
                        }
                    }
                },
                key: 68
            },
            "cloner_down": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        if (grid[y - 1][x] !== "air" && grid[y - 1][x] !== "cloner_left" && grid[y - 1][x] !== "cloner_up" && grid[y - 1][x] !== "cloner_right" && grid[y - 1][x] !== "cloner_down") {
                            if (grid[y + 1][x] === "air") {
                                if (nextGrid[y + 1][x] === null) {
                                    nextGrid[y + 1][x] = grid[y - 1][x];
                                }
                            }
                        }
                    }
                },
                key: 83
            },
            "super_cloner_left": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        // if(grid[y][x + 1] !== "air"){
                        // if(grid[y][x - 1] === "air"){
                        if (nextGrid[y][x - 1] === null) {
                            nextGrid[y][x - 1] = grid[y][x + 1];
                        }
                        // }
                        // }
                    }
                },
                key: -1
            },
            "super_cloner_up": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        // if(grid[y + 1][x] !== "air"){
                        // if(grid[y - 1][x] === "air"){
                        if (nextGrid[y - 1][x] === null) {
                            nextGrid[y - 1][x] = grid[y + 1][x];
                        }
                        // }
                        // }
                    }
                },
                key: -1
            },
            "super_cloner_right": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        // if(grid[y][x - 1] !== "air"){
                        // if(grid[y][x + 1] === "air"){
                        if (nextGrid[y][x + 1] === null) {
                            nextGrid[y][x + 1] = grid[y][x - 1];
                        }
                        // }
                        // }
                    }
                },
                key: -1
            },
            "super_cloner_down": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(125, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 125, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                            fill(255, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    if (y > 0 && y < gridSize - 1) {
                        // if(grid[y - 1][x] !== "air"){
                        // if(grid[y + 1][x] === "air"){
                        if (nextGrid[y + 1][x] === null) {
                            nextGrid[y + 1][x] = grid[y - 1][x];
                        }
                        // }
                        // }
                    }
                },
                key: -1
            },
            "block": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(0, 0, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                },
                key: 187,
            },
            "piston_left": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(75, 255, 255, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(75, 125, 255, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    var validPiston = true;
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        validPiston = false;
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "air";
                            return;
                        }
                    });
                    if (validPiston === false) {
                        return;
                    }
                    var moveX = null;
                    for (var i = x; i >= 0; i -= 1) {
                        if (grid[y][i] === "air") {
                            moveX = i;
                            break;
                        }
                        if (i !== x && (grid[y][i] === "piston_left" || grid[y][i] === "piston_up" || grid[y][i] === "piston_right" || grid[y][i] === "piston_down" || grid[y][i] === "block")) {
                            break;
                        }
                    }
                    if (moveX !== null) {
                        var pistonPushed = false;
                        for (var i = moveX; i < x; i += 1) {
                            if (nextGrid[y][i] === null && nextGrid[y][i + 1] === null) {
                                nextGrid[y][i] = grid[y][i + 1];
                                pistonPushed = true;
                            }
                        }
                        if (pistonPushed === true && nextGrid[y][x] === null) {
                            nextGrid[y][x] = "air";
                        }
                    }
                    else {
                        if (updateTouchingPixel(x, y, 1, "piston_rotator_up", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_up";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_right", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_right";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_down", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_down";
                                return;
                            }
                        }
                    }
                },
                key: 74,
            },
            "piston_up": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(75, 255, 255, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(75, 125, 255, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    var validPiston = true;
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        validPiston = false;
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "air";
                            return;
                        }
                    });
                    if (validPiston === false) {
                        return;
                    }
                    var moveY = null;
                    for (var i = y; i >= 0; i -= 1) {
                        if (grid[i][x] === "air") {
                            moveY = i;
                            break;
                        }
                        if (i !== y && (grid[i][x] === "piston_left" || grid[i][x] === "piston_up" || grid[i][x] === "piston_right" || grid[i][x] === "piston_down" || grid[i][x] === "block")) {
                            break;
                        }
                    }
                    if (moveY !== null) {
                        var pistonPushed = false;
                        for (var i = moveY; i < y; i += 1) {
                            if (nextGrid[i][x] === null && nextGrid[i + 1][x] === null) {
                                nextGrid[i][x] = grid[i + 1][x];
                                pistonPushed = true;
                            }
                        }
                        if (pistonPushed === true && nextGrid[y][x] === null) {
                            nextGrid[y][x] = "air";
                        }
                    }
                    else {
                        if (updateTouchingPixel(x, y, 1, "piston_rotator_left", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_left";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_right", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_right";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_down", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_down";
                                return;
                            }
                        }
                    }
                },
                key: 73,
            },
            "piston_right": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(75, 255, 255, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(75, 125, 255, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    var validPiston = true;
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        validPiston = false;
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "air";
                            return;
                        }
                    });
                    if (validPiston === false) {
                        return;
                    }
                    var moveX = null;
                    for (var i = x; i <= gridSize - 1; i += 1) {
                        if (grid[y][i] === "air") {
                            moveX = i;
                            break;
                        }
                        if (i !== x && (grid[y][i] === "piston_left" || grid[y][i] === "piston_up" || grid[y][i] === "piston_right" || grid[y][i] === "piston_down" || grid[y][i] === "block")) {
                            break;
                        }
                    }
                    if (moveX !== null) {
                        var pistonPushed = false;
                        for (var i = moveX; i > x; i -= 1) {
                            if (nextGrid[y][i] === null && nextGrid[y][i - 1] === null) {
                                nextGrid[y][i] = grid[y][i - 1];
                                pistonPushed = true;
                            }
                        }
                        if (pistonPushed === true && nextGrid[y][x] === null) {
                            nextGrid[y][x] = "air";
                        }
                    }
                    else {
                        if (updateTouchingPixel(x, y, 1, "piston_rotator_left", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_left";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_up", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_up";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_down", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_down";
                                return;
                            }
                        }
                    }
                },
                key: 76,
            },
            "piston_down": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(75, 255, 255, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(75, 125, 255, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
                    var validPiston = true;
                    updateTouchingPixel(x, y, 1, "lava", function (actionX, actionY) {
                        validPiston = false;
                        if (nextGrid[y][x] === null && nextGrid[actionY][actionX] === null) {
                            nextGrid[y][x] = "air";
                            nextGrid[actionY][actionX] = "air";
                            return;
                        }
                    });
                    if (validPiston === false) {
                        return;
                    }
                    var moveY = null;
                    for (var i = y; i <= gridSize - 1; i += 1) {
                        if (grid[i][x] === "air") {
                            moveY = i;
                            break;
                        }
                        if (i !== y && (grid[i][x] === "piston_left" || grid[i][x] === "piston_up" || grid[i][x] === "piston_right" || grid[i][x] === "piston_down" || grid[i][x] === "block")) {
                            break;
                        }
                    }
                    if (moveY !== null) {
                        var pistonPushed = false;
                        for (var i = moveY; i > y; i -= 1) {
                            if (nextGrid[i][x] === null && nextGrid[i - 1][x] === null) {
                                nextGrid[i][x] = grid[i - 1][x];
                                pistonPushed = true;
                            }
                        }
                        if (pistonPushed === true && nextGrid[y][x] === null) {
                            nextGrid[y][x] = "air";
                        }
                    }
                    else {
                        if (updateTouchingPixel(x, y, 1, "piston_rotator_left", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_left";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_up", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_up";
                                return;
                            }
                        }
                        else if (updateTouchingPixel(x, y, 1, "piston_rotator_right", function (actionX, actionY) { }) === true) {
                            if (nextGrid[y][x] === null) {
                                nextGrid[y][x] = "piston_right";
                                return;
                            }
                        }
                    }
                },
                key: 75,
            },
            "piston_rotator_left": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(225, 255, 0, opacity * 255);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 70,
            },
            "piston_rotator_up": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(225, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 84,
            },
            "piston_rotator_right": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(225, 255, 0, opacity * 255);
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 72,
            },
            "piston_rotator_down": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 125, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(225, 255, 0, opacity * 255);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 71,
            },
            "nuke_diffuser": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(175, 50, 0, opacity * 255);
                    drawPixel(x, y, width, height);
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(225, 125, 0, opacity * 255);
                            drawPixel(x + i, y + j, 1 / 3, 1 / 3);
                            drawPixel(x + i + 2 / 3, y + j, 1 / 3, 1 / 3);
                            drawPixel(x + i, y + j + 2 / 3, 1 / 3, 1 / 3);
                            drawPixel(x + i + 2 / 3, y + j + 2 / 3, 1 / 3, 1 / 3);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 189,
            },
            "lag_spike_generator": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            fill(255, 255, 255, opacity * 255);
                            drawPixel(x + i, y + j, 1, 1);
                            fill(125, 255, 0, (random(225) + 30) * opacity);
                            drawPixel(x + i, y + j, 1, 1);
                        }
                    }
                },
                update: function (x, y) {
                    updateTouchingPixel(x, y, 1, "air", function (actionX, actionY) {
                        if (nextGrid[actionY][actionX] === null && random() < 0.5) {
                            nextGrid[actionY][actionX] = "lag_spike_generator";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.025) {
                            nextGrid[actionY][actionX] = "pump";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.025) {
                            nextGrid[actionY][actionX] = "cloner";
                        }
                    });
                    updateTouchingPixel(x, y, 1, "lag_spike_generator", function (actionX, actionY) {
                        if (nextGrid[actionY][actionX] === null && random() < 0.005) {
                            nextGrid[actionY][actionX] = "nuke";
                        }
                    });
                },
                key: 219,
            },
            "corruption": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            for (var k = 0; k < random(1, 5); k++) {
                                var rotationAmount = floor(random(0, 360));
                                translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                                var translateX = random(-10 * xScale, 10 * xScale);
                                var translateY = random(-10 * yScale, 10 * yScale);
                                translate(translateX, translateY);
                                rotate(rotationAmount);
                                var borkXScale = random(0, 4);
                                var borkYScale = random(0, 2);
                                fill(0, 0, 0, opacity * 255);
                                drawPixel(0, 0, borkXScale, borkYScale);
                                fill(100, 255, 0, (random(155) + 100) * opacity);
                                drawPixel(0, 0, borkXScale, borkYScale);
                                rotate(-rotationAmount);
                                translate(-(x + i + 1 / 2) * xScale - translateX, -(y + j + 1 / 2) * yScale - translateY);
                            }
                        }
                    }
                },
                update: function (x, y) {
                    var chaos = function (actionX, actionY) {
                        if (nextGrid[actionY][actionX] === null && random() < 0.4) {
                            nextGrid[actionY][actionX] = "corruption";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.2) {
                            nextGrid[actionY][actionX] = "lava";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "water";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.4) {
                            nextGrid[actionY][actionX] = "asdf";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.5) {
                            nextGrid[actionY][actionX] = "air";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "pump";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.2) {
                            nextGrid[actionY][actionX] = "cloner_down";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.2) {
                            nextGrid[actionY][actionX] = "cloner_left";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.2) {
                            nextGrid[actionY][actionX] = "cloner_right";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.2) {
                            nextGrid[actionY][actionX] = "cloner_up";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "piston_left";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "piston_right";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "piston_up";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.1) {
                            nextGrid[actionY][actionX] = "piston_down";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.03) {
                            nextGrid[actionY][actionX] = "nuke";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.02) {
                            nextGrid[actionY][actionX] = "huge_nuke";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.01) {
                            nextGrid[actionY][actionX] = "very_huge_nuke";
                        }
                        if (nextGrid[actionY][actionX] === null && random() < 0.001) {
                            nextGrid[actionY][actionX] = "spin";
                        }
                    };
        
                    updateTouchingPixel(x, y, 2, "air", chaos);
                    updateTouchingAnything(x, y, 2, chaos);
                    if (!optimizedLags) {
                        for (var i = 0; i < gridSize; i++) {
                            var string = "";
                            var number = 0;
                            for (var j = 0; j < gridSize; j++) {
                                number += 1;
                                if (grid[i][j] !== string) {
                                    if (string !== "" && number !== 0) {
                                        if (random() < 0.00) {
                                            // drawPixels(j - number,i,number,1,string);
                                        }
                                        string = grid[i][j];
                                        number = 0;
                                    }
                                }
                                number += 1;
                                if (string !== "" && number !== 0) {
                                    if (random() < 0.00) {
                                        // drawPixels(j - number,i,number,1,string);
                                    }
                                }
                            }
                        }
                    }
                },
                key: 221
            },
            "huge_nuke": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(225, 120, 112, 255 * opacity);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    var explosion = false;
                    var diffused = false;
                    updateTouchingPixel(x, y, 1, "nuke_diffuser", function (actionX, actionY) {
                        diffused = true;
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "huge_nuke";
                            }
                        }
                    }
                    if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { }) === true) {
                        explosion = true;
                    }
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air" || grid[y + 1][x] === "huge_nuke") {
                            explosion = false;
                        }
                    }
                    else {
                        explosion = true;
                    }
                    if (explosion === true && diffused === false) {
                        explode(x, y, 20, 1.5);
                    }
                },
                key: 220
            },
            "very_huge_nuke": {
                draw: function (x, y, width, height, opacity) {
                    noStroke();
                    fill(255, 0, 70, 255 * opacity);
                    drawPixel(x, y, width, height);
                },
                update: function (x, y) {
                    var explosion = false;
                    var diffused = false;
                    updateTouchingPixel(x, y, 1, "nuke_diffuser", function (actionX, actionY) {
                        diffused = true;
                    });
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air") {
                            if (nextGrid[y][x] === null && nextGrid[y + 1][x] === null) {
                                nextGrid[y][x] = "air";
                                nextGrid[y + 1][x] = "very_huge_nuke";
                            }
                        }
                    }
                    if (updateTouchingAnything(x, y, 1, function (actionX, actionY) { }) === true) {
                        explosion = true;
                    }
                    if (y < gridSize - 1) {
                        if (grid[y + 1][x] === "air" || grid[y + 1][x] === "very_huge_nuke") {
                            explosion = false;
                        }
                    }
                    else {
                        explosion = true;
                    }
                    if (explosion === true && diffused === false) {
                        explode(x, y, 40, 1.5);
                    }
                },
                key: -1
            },
            "spin": {
                draw: function (x, y, width, height, opacity) {
                    for (var i = 0; i < width; i++) {
                        for (var j = 0; j < height; j++) {
                            translate((x + i + 1 / 2) * xScale, (y + j + 1 / 2) * yScale);
                            var translateX = random(-10 * xScale, 10 * xScale);
                            var translateY = random(-10 * yScale, 10 * yScale);
                            translate(translateX, translateY);
                            var rotationAmount = floor(random(0, 360));
                            rotate(rotationAmount);
                        }
                    }
                },
                update: function (x, y) {
        
                },
                key: 192,
            }
        };
        
        // create your own pixels
        var createPixel = function (type, drawFunction, updateFunction, key) {
            pixels[type] = {
                draw: drawFunction,
                update: updateFunction,
                key: key,
            };
        };
        
        var drawPixels = function (x, y, width, height, type, opacity) {
            if (pixels[type]) {
                pixels[type].draw(x, y, width, height, opacity);
            }
            else {
                noStroke();
                for (var i = 0; i < width; i++) {
                    for (var j = 0; j < height; j++) {
                        fill(255, 0, 255, opacity * 255);
                        drawPixel(x + i, y + j, 1 / 2, 1 / 2);
                        drawPixel(x + 1 / 2 + i, y + 1 / 2 + j, 1 / 2, 1 / 2);
                        fill(0, 0, 0, opacity * 255);
                        drawPixel(x + 1 / 2 + i, y + j, 1 / 2, 1 / 2);
                        drawPixel(x + i, y + 1 / 2 + j, 1 / 2, 1 / 2);
                    }
                }
            }
        };
        var updatePixel = function (x, y) {
            if (pixels[grid[y][x]]) {
                pixels[grid[y][x]].update(x, y);
            }
        };
        
        var clickPixel = "air";
        var clickSize = 5;
        var runTicks = 0;
        
        keyPressed = function () {
            for (var i in pixels) {
                if (pixels[i].key === keyCode) {
                    clickPixel = i;
                }
            }
            if (keyCode === 38) {
                clickSize += 1;
                clickSize = min(gridSize / 2 + 1, clickSize);
            }
            if (keyCode === 40) {
                clickSize -= 1;
                clickSize = max(1, clickSize);
            }
            if (keyCode === 82) {
                for (var i = 0; i < gridSize; i++) {
                    if (grid[0][i] === "air" && random() < 0.25) {
                        grid[0][i] = "water";
                    }
                }
            }
            if (keyCode === 69) {
                for (var i = 0; i < gridSize; i++) {
                    if (grid[0][i] === "air" && random() < 0.25) {
                        grid[0][i] = "lava";
                    }
                }
            }
            if (keyCode === 66) {
                for (var i = 0; i < gridSize; i++) {
                    grid[0][i] = "nuke";
                }
            }
            if (keyCode === 78) {
                for (var i = 0; i < gridSize; i += 5) {
                    for (var j = 0; j < gridSize; j += 5) {
                        grid[j][i] = "very_huge_nuke";
                    }
                }
            }
            if (keyCode === 10) {
                runTicks = 1;
            }
        };
        keyReleased = function () {
            if (keyCode === 90) {
                for (var i = 0; i < gridSize; i++) {
                    for (var j = 0; j < gridSize; j++) {
                        grid[i][j] = lastGrids[lastGrids.length - 1][i][j];
                    }
                }
                lastGrids.pop();
            }
            if (keyCode === 18) {
                debugInfo = !debugInfo;
            }
            if (keyCode === 80) {
                gridPaused = !gridPaused;
                simulatePaused = false;
                frameRate(60);
            }
            if (keyCode === 90) {
                println("SAVE CODE:");
                var printedSaveCode = "";
                var string = "";
                var number = 0;
                printedSaveCode += gridSize + ";";
                for (var i = 0; i < gridSize; i++) {
                    for (var j = 0; j < gridSize; j++) {
                        number += 1;
                        if (grid[i][j] !== string) {
                            if (string !== "" && number !== 0) {
                                if (number === 1) {
                                    printedSaveCode += string + ":";
                                }
                                else {
                                    printedSaveCode += string + "-" + number + ":";
                                }
                            }
                            string = grid[i][j];
                            number = 0;
                        }
                    }
                }
                if (string !== "" && number !== 0) {
                    if (number === 1) {
                        printedSaveCode += string + ":";
                    }
                    else {
                        printedSaveCode += string + "-" + number + ":";
                    }
                }
                println(printedSaveCode);
            }
            if (keyCode === 16) {
                simulatePaused = !simulatePaused;
                if (simulatePaused && gridPaused) {
                    frameRate(240);
                } else {
                    frameRate(60);
                }
            }
        };
        
        var clickLine = function (startX, startY, endX, endY) {
            var x = startX;
            var y = startY;
            var angle = atan2(endY - startY, endX - startX);
            var distance = sqrt(pow(endX - startX, 2) + pow(endY - startY, 2));
            for (var i = 0; i <= distance; i++) {
                var gridX = floor(x);
                var gridY = floor(y);
                for (var j = gridX - clickSize + 1; j <= gridX + clickSize - 1; j++) {
                    if (j >= 0 && j <= gridSize - 1) {
                        for (var k = gridY - clickSize + 1; k <= gridY + clickSize - 1; k++) {
                            if (k >= 0 && k <= gridSize - 1) {
                                grid[k][j] = clickPixel;
                            }
                        }
                    }
                }
                x += cos(angle);
                y += sin(angle);
            }
        };
        
        draw = function () {
            if (mousePressed && (!gridPaused || !simulatePaused)) {
                lastGrids.push([]);
                for (var i = 0; i < gridSize; i++) {
                    lastGrids[lastGrids.length - 1].push([]);
                    for (var j = 0; j < gridSize; j++) {
                        lastGrids[lastGrids.length - 1][i].push(grid[i][j]);
                    }
                }
                if (lastGrids.length > 20) {
                    lastGrids.shift(1);
                }
                clickLine(floor(mouseX * gridSize / width), floor(mouseY * gridSize / height), floor(pmouseX * gridSize / width), floor(pmouseY * gridSize / height));
            }
            if ((gridPaused && !simulatePaused) || !gridPaused) {
                fill(255, 255, 255, 255 - fadeEffect);
                rect(0, 0, width, height);
                for (var i = 0; i < gridSize; i++) {
                    var string = "";
                    var number = 0;
                    for (var j = 0; j < gridSize; j++) {
                        number += 1;
                        if (grid[i][j] !== string) {
                            if (string !== "" && string !== "air" && number !== 0) {
                                drawPixels(j - number, i, number, 1, string, 1);
                            }
                            string = grid[i][j];
                            number = 0;
                        }
                    }
                    number += 1;
                    if (string !== "" && number !== 0) {
                        drawPixels(j - number, i, number, 1, string, 1);
                    }
                }
            }
            if (gridPaused === false || runTicks > 0 || simulatePaused) {
                runTicks--;
                if (random() < 0.5) {
                    for (var i = 0; i < gridSize; i++) {
                        for (var j = 0; j < gridSize; j++) {
                            updatePixel(j, i);
                        }
                    }
                }
                else {
                    for (var i = 0; i < gridSize; i++) {
                        for (var j = gridSize - 1; j >= 0; j--) {
                            updatePixel(j, i);
                        }
                    }
                }
            }
        
            if (!gridPaused || !simulatePaused) {
                var x1 = max(0, floor(mouseX * gridSize / width) - clickSize + 1);
                var x2 = min(gridSize - 1, floor(mouseX * gridSize / width) + clickSize - 1);
                var y1 = max(0, floor(mouseY * gridSize / height) - clickSize + 1);
                var y2 = min(gridSize - 1, floor(mouseY * gridSize / height) + clickSize - 1);
                drawPixels(x1, y1, x2 - x1 + 1, y2 - y1 + 1, clickPixel, 0.5);
            }
        
            frames.push(millis());
            while (frames[0] + 1000 < millis()) {
                frames.shift(1);
            }
            if (gridPaused && simulatePaused) {
                fill(255, 255, 255);
                rect(1, 3, 100, 14);
                if (debugInfo) {
                    rect(5, 0, 200, 120);
                }
            }
            fill(0, 0, 0);
            textFont("Arial", 14);
            textAlign(LEFT, TOP);
            text("FPS: " + frames.length, 3, 1);
            if (lastFpsList + 100 < millis()) {
                lastFpsList = millis();
                fpsList.push(frames.length);
                while (fpsList.length > 100) {
                    fpsList.shift(1);
                }
            }
            if (debugInfo === true) {
                fill(0, 0, 0, 75);
                rect(5, 20, 200, 100);
                for (var i = 0; i < 100; i++) {
                    fill(0, 0, 0);
                    rect(5 + i * 2, 120 - fpsList[i], 2, fpsList[i]);
                }
                text("Last 10 seconds:", 10, 22);
            }
            textAlign(RIGHT, TOP);
            text("Brush Size: " + clickSize, width - 3, 1);
            text("Brush Pixel: " + clickPixel, width - 3, 16);
            if (gridPaused === true) {
                fill(0, 0, 0);
                text("PAUSED", width - 3, 33);
                if (simulatePaused) {
                    textAlign(CENTER, CENTER);
                    textFont("Arial", 40);
                    text("SIMULATING...", width / 2, height / 2);
                }
            }
        
            for (var i = 0; i < gridSize; i++) {
                for (var j = 0; j < gridSize; j++) {
                    if (nextGrid[i][j] !== null) {
                        grid[i][j] = nextGrid[i][j];
                        nextGrid[i][j] = null;
                    }
                }
            }
        
            animationTime += 1;
        };

    };
};

var processingInstance = new Processing(document.getElementById('canvas'), pixelSimulator)