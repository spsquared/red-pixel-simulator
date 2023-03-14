const pixels = {
    air: {
        name: 'Air',
        description: 'It\'s air... What else would it be?',
        draw: function (x, y, width, height, opacity, ctx) { },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: false,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'air',
        numId: 0
    },
    wall: {
        name: 'Wall',
        description: 'An immovable wall (good luck finding an unstoppable force-OH NO)',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'wall',
        numId: 0
    },
    dirt: {
        name: 'Dirt',
        description: 'Wash your hands after handling it, it\'s pretty dirty',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(125, 75, 0)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.MUD;
                return;
            }
            if (y < gridSize - 1 && (grid[y + 1][x] == pixNum.DIRT || grid[y + 1][x] == pixNum.GRASS || isPassableFluid(x, y + 1))) {
                fall(x, y, 1, 2, isPassableFluid);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 75, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 1,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'dirt',
        numId: 0
    },
    grass: {
        name: 'Grass',
        description: 'Go touch some',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(25, 175, 25)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let dead = random() < 0.1;
            if (dead) updateTouchingPixel(x, y, pixNum.AIR, function (actionX, actionY) {
                if (actionY <= y) dead = false;
            });
            if (!dead) dead = updateTouchingPixel(x, y, pixNum.LAVA);
            if (dead) {
                nextGrid[y][x] = pixNum.DIRT;
                return;
            }
            for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, gridSize - 1); i++) {
                for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, gridSize - 1); j++) {
                    if (grid[i][j] == pixNum.DIRT && (i != y || j != x) && random() < 0.2) {
                        let canGrow = false;
                        updateTouchingPixel(j, i, pixNum.AIR, function (actionX2, actionY2) {
                            if (actionY2 <= i) canGrow = true;
                        });
                        if (canGrow) {
                            nextGrid[i][j] = pixNum.GRASS;
                        }
                    }
                }
            }
            if (y < gridSize - 1 && (grid[y + 1][x] == pixNum.DIRT || grid[y + 1][x] == pixNum.GRASS || isPassableFluid(x, y + 1))) {
                fall(x, y, 1, 2, isPassableFluid);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 175, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'grass',
        numId: 0
    },
    mud: {
        name: 'Mud',
        description: 'Basically wet dirt',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(100, 60, 0)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(90, 50, 0)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(105, 70, 0, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let touchingMud = 1;
            updateTouchingPixel(x, y, pixNum.MUD, function (actionX, actionY) {
                touchingMud *= 2;
            });
            if (random() < 0.01 / touchingMud && !updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.DIRT;
                return;
            }
            fall(x, y, 3, 1, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 60, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 1,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'mud',
        numId: 0
    },
    sand: {
        name: 'Sand',
        description: 'Weird yellow powdery stuff that falls',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 225, 125)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            fall(x, y, 1, 1, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 225, 125)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'sand',
        numId: 0
    },
    wood: {
        name: 'Wood',
        description: 'Just some logs',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(175, 125, 75)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            for (let i = 0; i < width; i++) {
                fillPixel(x + i, y, 1 / 2, height, ctx);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(175, 125, 75)';
            ctx.fillRect(25, 0, 25, 50);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            ctx.fillRect(0, 0, 25, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 12,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'wood',
        numId: 0
    },
    leaves: {
        name: 'Leaves',
        description: 'Lush green leaves... or was it leafs?',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 220, 0)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WOOD)) return;
            let touchingLeaves = 0;
            let xmin = Math.max(0, Math.min(x - 1, gridSize - 1));
            let xmax = Math.max(0, Math.min(x + 1, gridSize - 1));
            let ymin = Math.max(0, Math.min(y - 1, gridSize - 1));
            let ymax = Math.max(0, Math.min(y + 1, gridSize - 1));
            for (let i = xmin; i <= xmax; i++) {
                for (let j = ymin; j <= ymax; j++) {
                    if (grid[j][i] == pixNum.LEAVES) touchingLeaves++;
                }
            }
            if (touchingLeaves < 4) {
                if (random() < 0.01) {
                    nextGrid[y][x] = pixNum.AIR;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(115, 220, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 18,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 11,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'leaves',
        numId: 0
    },
    ash: {
        name: 'Ash',
        description: 'Burnt stuff, doesn\'t burn easily',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(100, 110, 120)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(80, 85, 90)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(120, 130, 140, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let removedWater = false;
            if (updateTouchingPixel(x, y, pixNum.WATER, function (actionX, actionY) {
                if (!removedWater && validMovingPixel(actionX, actionY) && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.AIR;
                    removedWater = true;
                }
            })) {
                nextGrid[y][x] = pixNum.WET_ASH;
                return;
            }
            fall(x, y, 1, 2, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 110, 120)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 2,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'ash',
        numId: 0
    },
    wet_ash: {
        name: 'Wet Ash',
        description: 'Definitely not silt',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(80, 80, 90)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(70, 70, 80)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(85, 85, 90, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (fireGrid[y][x] && random() < 0.1) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            function isPassableAshFluid(x, y) {
                return isPassableFluid(x, y) || grid[y][x] == pixNum.ASH;
            };
            fall(x, y, 2, 1, isPassableAshFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(80, 80, 90)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 1,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'wet_ash',
        numId: 0
    },
    stone: {
        name: 'Stone',
        description: 'Very stony and hard',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(110, 110, 110)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y > 0) {
                if (grid[y - 1][x] == pixNum.LAVA) {
                    if (canMoveTo(x, y - 1) && random() < 0.25) {
                        nextGrid[y][x] = pixNum.LAVA;
                        nextGrid[y - 1][x] = pixNum.STONE;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(110, 110, 110)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 11,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'stone',
        numId: 0
    },
    water: {
        name: 'Water',
        description: 'Unrealistically flows and may or may not be wet',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(75, 100, 255)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(100, 175, 255)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(75, 50, 255, ${noise((x + i) / 4, (y + j) / 4, frameCount / 10) + 0.1})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            fireGrid[y][x] = false;
            if (updateTouchingPixel(x, y, pixNum.LAVA, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null) {
                    if (random() < 0.8) nextGrid[y][x] = pixNum.STEAM;
                    else nextGrid[y][x] = pixNum.AIR;
                    nextGrid[actionY][actionX] = pixNum.STONE;
                    return true;
                }
                return false;
            })) return;
            if (y < gridSize - 1) {
                flow(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 11,
        animatedNoise: true,
        animated: true,
        pickable: true,
        id: 'water',
        numId: 0
    },
    lava: {
        name: 'Lava',
        description: 'Try not to get burned, it also melts stuff and sets things on fire (and flows unrealistically)',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(255, 100, 0)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(255, 0, 0)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(255, 255, 0, ${noise((x + i) / 6, (y + j) / 6, frameCount / 30)})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel) return;
            updateTouchingPixel(x, y, pixNum.COLLAPSIBLE, function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = pixNum.SAND;
                }
            });
            updateTouchingPixel(x, y, pixNum.LASER_SCATTERER, function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = pixNum.SAND;
                }
            });
            updateTouchingPixel(x, y, pixNum.SAND, function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = pixNum.GLASS;
                }
            });
            let cooldownSpeed = 2;
            updateTouchingPixel(x, y, pixNum.LAVA, function (actionX, actionY) {
                cooldownSpeed--;
            });
            updateTouchingPixel(x, y, pixNum.AIR, function (actionX, actionY) {
                cooldownSpeed++;
            });
            if (random() < 0.0001 * cooldownSpeed) {
                nextGrid[y][x] = pixNum.STONE;
                return;
            }
            nextFireGrid[y][x] = true;
            if (y < gridSize - 1 && random() < 0.5) {
                flow(x, y);
            }
            if (y > 0) {
                if (random() < 0.125) {
                    let validSlidingPositions = [];
                    if (x > 0) {
                        if (grid[y][x - 1] == pixNum.STONE && grid[y - 1][x - 1] == pixNum.STONE) {
                            validSlidingPositions.push(-1);
                        }
                    }
                    if (x < gridSize - 1) {
                        if (grid[y][x + 1] == pixNum.STONE && grid[y - 1][x + 1] == pixNum.STONE) {
                            validSlidingPositions.push(1);
                        }
                    }
                    if (validSlidingPositions.length > 0) {
                        let slidePosition = validSlidingPositions[Math.floor(random(0, validSlidingPositions.length))];
                        if (nextGrid[y][x] == null && nextGrid[y - 1][x + slidePosition] == null) {
                            nextGrid[y][x] = grid[y - 1][x + slidePosition];
                            nextGrid[y - 1][x + slidePosition] = pixNum.LAVA;
                        }
                    }
                }
            }
            if (y > 0) {
                if (random() < 0.5) {
                    if (y == gridSize - 1 || grid[y + 1][x] == pixNum.LAVA) {
                        if (grid[y - 1][x] == pixNum.STONE) {
                            if (nextGrid[y][x] == null && nextGrid[y - 1][x] == null) {
                                nextGrid[y][x] = grid[y - 1][x];
                                nextGrid[y - 1][x] = pixNum.LAVA;
                            }
                        }
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 100, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 16,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 11,
        animatedNoise: true,
        animated: true,
        pickable: true,
        id: 'lava',
        numId: 0
    },
    steam: {
        name: 'Steam',
        description: 'Very hot steam that will give you second-degree burns if you\'re not careful',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(210, 210, 210)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(225, 225, 225)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(200, 200, 200, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (random() < 0.005) {
                if (random() < 0.5) nextGrid[y][x] = pixNum.WATER;
                else nextGrid[y][x] = pixNum.AIR;
                return;
            }
            if (updateTouchingAnything(x, y, function (actionX, actionY) {
                if (grid[actionY][actionX] != pixNum.WATER && random() < (numPixels[grid[actionY][actionX]] ?? numPixels[pixNum.MISSING]).flammability / 20) {
                    nextFireGrid[actionY][actionX] = true;
                    if (random() < 0.8) {
                        nextGrid[y][x] = pixNum.WATER;
                        return true;
                    }
                }
                return false;
            })) return;
            if (y == 0) return;
            function isNotSteamAir(x, y) {
                return grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.DELETER;
            };
            if (isNotSteamAir(x, y - 1)) {
                if (canMoveTo(x, y - 1)) {
                    move(x, y, x, y - 1);
                }
            } else {
                let left = x;
                let right = x;
                let slideLeft = 0;
                let slideRight = 0;
                let foundLeftDrop = false;
                let foundRightDrop = false;
                let incrementLeft = canMoveTo(x - 1, y) && isNotSteamAir(x - 1, y);
                let incrementRight = canMoveTo(x + 1, y) && isNotSteamAir(x + 1, y);
                while (incrementLeft) {
                    left--;
                    if (!isNotSteamAir(left, y)) {
                        if (grid[y][left] != pixNum.STEAM) slideLeft = x - left;
                        incrementLeft = false;
                    } else if (isNotSteamAir(left, y - 1) && isNotSteamAir(left, y)) {
                        slideLeft = x - left;
                        foundLeftDrop = true;
                        incrementLeft = false;
                    }
                    if (left < 0) {
                        slideLeft = x - left;
                        incrementLeft = false;
                    }
                }
                while (incrementRight) {
                    right++;
                    if (!isNotSteamAir(right, y)) {
                        if (grid[y][right] != pixNum.STEAM) slideRight = right - x;
                        incrementRight = false;
                    } else if (isNotSteamAir(right, y - 1) && isNotSteamAir(right, y)) {
                        slideRight = right - x;
                        foundRightDrop = true;
                        incrementRight = false;
                    }
                    if (right >= gridSize) {
                        slideRight = right - x;
                        incrementRight = false;
                    }
                }
                let toSlide = 0;
                if (foundLeftDrop && foundRightDrop) {
                    if (slideLeft < slideRight && slideLeft != 0) {
                        toSlide = -1;
                    } else if (slideLeft > slideRight && slideRight != 0) {
                        toSlide = 1;
                    } else {
                        if (ticks % 2 == 0) {
                            toSlide = -1;
                        } else {
                            toSlide = 1;
                        }
                    }
                } else if (foundLeftDrop) {
                    toSlide = -1;
                } else if (foundRightDrop) {
                    toSlide = 1;
                } else if (slideLeft < slideRight && slideLeft != 0) {
                    toSlide = -1;
                } else if (slideLeft > slideRight && slideRight != 0) {
                    toSlide = 1;
                } else if (slideLeft != 0 && slideRight != 0) {
                    if (ticks % 2 == 0) {
                        toSlide = -1;
                    } else {
                        toSlide = 1;
                    }
                }
                if (toSlide > 0) {
                    if (foundRightDrop && isNotSteamAir(x + 1, y - 1)) {
                        move(x, y, x + 1, y - 1);
                    } else {
                        move(x, y, x + 1, y);
                    }
                } else if (toSlide < 0) {
                    if (foundLeftDrop && isNotSteamAir(x - 1, y - 1)) {
                        move(x, y, x - 1, y - 1);
                    } else {
                        move(x, y, x - 1, y);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(210, 210, 210)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 10,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'steam',
        numId: 0
    },
    concrete_powder: {
        name: 'Concrete Powder',
        description: 'Like sand, but hardens into concrete when in contact with water',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(150, 150, 150)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.CONCRETE;
                return;
            }
            fall(x, y, 1, 2, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(150, 150, 150)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'concrete_powder',
        numId: 0
    },
    concrete: {
        name: 'Concrete',
        description: 'Hard stuff that doesn\'t move easily, behaves similarly to stone but does not melt',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 75, 75)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (y > 0) {
                if (grid[y - 1][x] == pixNum.LAVA) {
                    if (canMoveTo(x, y - 1) && random() < 0.25) {
                        nextGrid[y][x] = pixNum.LAVA;
                        nextGrid[y - 1][x] = pixNum.CONCRETE_POWDER;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 75, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 15,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'concrete',
        numId: 0
    },
    plant: {
        name: 'P.L.A.N.T.',
        description: '<span style="font-style: italic;">Persistent Loud Aesthetic Nail Tables.</span><br>No, it doesn\'t actually stand for anything. But it does consume concrete alarmingly fast',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let validPlant = updateTouchingPixel(x, y, pixNum.AIR) || updateTouchingPixel(x, y, pixNum.WATER);
            if (!validPlant) {
                nextGrid[y][x] = pixNum.WATER;
            }
            updateTouchingPixel(x, y, pixNum.CONCRETE, function (actionX, actionY) {
                nextGrid[y][x] = pixNum.WATER;
                nextGrid[actionY][actionX] = pixNum.PLANT;
            });
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1)) {
                    if (canMoveTo(x, y + 1) && (grid[y + 1][x] == pixNum.WATER) ? random() < 0.5 : true) {
                        move(x, y, x, y + 1);
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'plant',
        numId: 0
    },
    sponge: {
        name: 'S.P.O.N.G.E.',
        description: '<span style="font-style: italic;">Sample Providing Oceanic Nucleolic Green Egg</span><br>buh',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(225, 255, 75)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.WATER, function (actionX, actionY) {
                nextGrid[y][x] = pixNum.AIR;
                nextGrid[actionY][actionX] = pixNum.SPONGE;
            });
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) && (grid[y + 1][x] != pixNum.LAVA || random() < 0.25) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(225, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 10,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'sponge',
        numId: 0
    },
    fire: {
        name: 'Fire',
        description: 'AAAAAA! It burns!',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.globalAlpha = opacity / 2;
                ctx.fillStyle = 'rgb(255, 180, 0)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.globalAlpha = opacity / 3;
                ctx.fillStyle = 'rgb(255, 100, 0)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(255, 255, 0, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            let flammability = (numPixels[grid[y][x]] ?? numPixels[pixNum.MISSING]).flammability;
            let isLava = grid[y][x] == pixNum.LAVA;
            if (flammability == 0 && !isLava && (grid[y][x] != pixNum.AIR || random() < 0.3)) {
                nextFireGrid[y][x] = false;
                return;
            }
            updateTouchingPixel(x, y, pixNum.WATER, function (actionX, actionY) {
                nextFireGrid[y][x] = false;
            });
            let aerated = updateTouchingPixel(x, y, pixNum.AIR);
            if (random() < (20 - flammability) / (aerated ? 360 : 80)) {
                nextFireGrid[y][x] = false;
            }
            if (random() < flammability / 1200 && nextGrid[y][x] == null && !isLava) {
                if (grid[y][x] >= pixNum.LASER_UP && grid[y][x] <= pixNum.LASER_RIGHT) {
                    nextGrid[y][x] = pixNum.AIR;
                    explode(x, y, 5);
                } else if (grid[y][x] != pixNum.ASH && random() < 0.5) {
                    nextGrid[y][x] = pixNum.ASH;
                } else {
                    nextGrid[y][x] = pixNum.AIR;
                }
            }
            for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, gridSize - 1); i++) {
                for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, gridSize - 1); j++) {
                    if (nextFireGrid[j][i] || (i == x && j == y)) continue;
                    let flammability = (numPixels[grid[j][i]] ?? numPixels[pixNum.MISSING]).flammability;
                    if (random() < flammability / 20 + (j < y ? 0.4 : 0) - ((i != x && j != y) ? 0.4 : 0)) nextFireGrid[j][i] = true;
                    if (grid[j][i] == pixNum.WATER && random() < 0.5) nextGrid[j][i] = pixNum.STEAM;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 20,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'fire',
        numId: 0
    },
    gunpowder: {
        name: 'Gunpowder',
        description: 'A low explosive that explodes when lit on fire',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            if (noNoise) {
                ctx.fillStyle = 'rgb(50, 25, 25)';
                fillPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = 'rgb(30, 20, 20)';
                fillPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgb(55, 40, 40, ${noiseGrid[y + j][x + i]})`;
                        fillPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingPixel(x, y, pixNum.LAVA) || fireGrid[y][x];
            if (explosion) explode(x, y, 5, 1);
            else fall(x, y, 1, 1, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(50, 25, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'gunpowder',
        numId: 0
    },
    c4: {
        name: 'C-4',
        description: 'A high explosive that can only be triggered by other explosions',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(245, 245, 200)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(245, 245, 200)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'c4',
        numId: 0
    },
    cloner_left: {
        name: 'Copier (Left)',
        description: 'Copies pixels from its right to its left',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x + 1] != pixNum.AIR && (numPixels[grid[y][x + 1]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y][x + 1]] ?? numPixels[pixNum.MISSING]).cloneable && grid[y][x - 1] == pixNum.AIR && canMoveTo(x - 1, y)) {
                nextGrid[y][x - 1] = grid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updateStage: 7,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'cloner_left',
        numId: 0
    },
    cloner_up: {
        name: 'Copier (Up)',
        description: 'Copies pixels from below it to above it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y + 1][x] != pixNum.AIR && (numPixels[grid[y + 1][x]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y + 1][x]] ?? numPixels[pixNum.MISSING]).cloneable && grid[y - 1][x] == pixNum.AIR && canMoveTo(x, y - 1)) {
                nextGrid[y - 1][x] = grid[y + 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 50 / 6, 25, 50 / 6);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'cloner_up',
        numId: 0
    },
    cloner_right: {
        name: 'Copier (Right)',
        description: 'Copies pixels from its left to its right',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x - 1] != pixNum.AIR && (numPixels[grid[y][x - 1]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y][x - 1]] ?? numPixels[pixNum.MISSING]).cloneable && grid[y][x + 1] == pixNum.AIR && canMoveTo(x + 1, y)) {
                nextGrid[y][x + 1] = grid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updateStage: 8,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'cloner_right',
        numId: 0
    },
    cloner_down: {
        name: 'Copier (Down)',
        description: 'Copies pixels from above it to below it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y - 1][x] != pixNum.AIR && (numPixels[grid[y - 1][x]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y - 1][x]] ?? numPixels[pixNum.MISSING]).cloneable && grid[y + 1][x] == pixNum.AIR && canMoveTo(x, y + 1)) {
                nextGrid[y + 1][x] = grid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'cloner_down',
        numId: 0
    },
    push_cloner_left: {
        name: 'Cloner (Left)',
        description: 'Clones pixels from its right to its left, pushing pixels in the way',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x + 1] != pixNum.AIR && (numPixels[grid[y][x + 1]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y][x + 1]] ?? numPixels[pixNum.MISSING]).cloneable && canMoveTo(x - 1, y)) {
                let moveX = null;
                let lastCollapsible = null;
                for (let i = x - 1; i >= 0; i--) {
                    if (isAir(i, y)) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) {
                            moveX++;
                        }
                        break;
                    }
                    if (grid[y][i] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!(numPixels[grid[y][i]] ?? numPixels[pixNum.MISSING]).pushable || (grid[y][i] == pixNum.GOAL && targetGrid[y][i]) || grid[y][i] == pixNum.SLIDER_VERTICAL) {
                        break;
                    }
                }
                if (moveX == null && lastCollapsible != null) {
                    moveX = lastCollapsible;
                }
                if (moveX != null && moveX != x) {
                    for (let i = moveX; i < x; i++) {
                        if (!canMoveTo(i + 1, y)) return;
                    }
                    for (let i = moveX; i < x - 1; i++) {
                        nextGrid[y][i] = grid[y][i + 1];
                        fireGrid[y][i] = fireGrid[y][i + 1];
                    }
                    nextGrid[y][x - 1] = grid[y][x + 1];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixel(1 / 3, 2 / 5, 1 / 3, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        group: 1,
        rotation: 0,
        key: Infinity,
        updateStage: 7,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'push_cloner_left',
        numId: 0
    },
    push_cloner_up: {
        name: 'Cloner (Up)',
        description: 'Clones pixels from below it to above it, pushing pixels in the way',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y + 1][x] != pixNum.AIR && (numPixels[grid[y + 1][x]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y + 1][x]] ?? numPixels[pixNum.MISSING]).cloneable && canMoveTo(x, y - 1)) {
                let moveY = null;
                let lastCollapsible = null;
                for (let i = y - 1; i >= 0; i--) {
                    if (isAir(x, i)) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) {
                            moveY++;
                        }
                        break;
                    }
                    if (grid[i][x] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!(numPixels[grid[i][x]] ?? numPixels[pixNum.MISSING]).pushable || (grid[i][x] == pixNum.GOAL && targetGrid[i][x]) || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
                        break;
                    }
                }
                if (moveY == null && lastCollapsible != null) {
                    moveY = lastCollapsible;
                }
                if (moveY != null && moveY != y) {
                    for (let i = moveY; i < y; i++) {
                        if (!canMoveTo(x, i + 1)) return;
                    }
                    for (let i = moveY; i < y - 1; i++) {
                        nextGrid[i][x] = grid[i + 1][x];
                        fireGrid[i][x] = fireGrid[i + 1][x];
                    }
                    nextGrid[y - 1][x] = grid[y + 1][x];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 50 / 6, 25, 50 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixel(2 / 5, 1 / 3, 1 / 5, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        group: 1,
        rotation: 1,
        key: Infinity,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'push_cloner_up',
        numId: 0
    },
    push_cloner_right: {
        name: 'Cloner (Right)',
        description: 'Clones pixels from its left to its right, pushing pixels in the way',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x - 1] != pixNum.AIR && (numPixels[grid[y][x - 1]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y][x - 1]] ?? numPixels[pixNum.MISSING]).cloneable && canMoveTo(x + 1, y)) {
                let moveX = null;
                let lastCollapsible = null;
                for (let i = x + 1; i <= gridSize - 1; i++) {
                    if (isAir(i, y)) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) {
                            moveX--;
                        }
                        break;
                    }
                    if (grid[y][i] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!(numPixels[grid[y][i]] ?? numPixels[pixNum.MISSING]).pushable || (grid[y][i] == pixNum.GOAL && targetGrid[y][i]) || grid[y][i] == pixNum.SLIDER_VERTICAL) {
                        break;
                    }
                }
                if (moveX == null && lastCollapsible != null) {
                    moveX = lastCollapsible;
                }
                if (moveX != null && moveX != x) {
                    for (let i = moveX; i > x; i--) {
                        if (!canMoveTo(i - 1, y)) return;
                    }
                    for (let i = moveX; i > x + 1; i--) {
                        nextGrid[y][i] = grid[y][i - 1];
                        fireGrid[y][i] = fireGrid[y][i - 1];
                    }
                    nextGrid[y][x + 1] = grid[y][x - 1];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixel(1 / 3, 2 / 5, 1 / 3, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        group: 1,
        rotation: 2,
        key: Infinity,
        updateStage: 8,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'push_cloner_right',
        numId: 0
    },
    push_cloner_down: {
        name: 'Cloner (Down)',
        description: 'Clones pixels from above it to below it, pushing pixels in the way',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y - 1][x] != pixNum.AIR && (numPixels[grid[y - 1][x]] ?? numPixels[pixNum.MISSING]).pushable && (numPixels[grid[y - 1][x]] ?? numPixels[pixNum.MISSING]).cloneable && canMoveTo(x, y + 1)) {
                let moveY = null;
                let lastCollapsible = null;
                for (let i = y + 1; i <= gridSize - 1; i++) {
                    if (isAir(x, i)) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) {
                            moveY--;
                        }
                        break;
                    }
                    if (grid[i][x] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!(numPixels[grid[i][x]] ?? numPixels[pixNum.MISSING]).pushable || (grid[i][x] == pixNum.GOAL && targetGrid[i][x]) || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
                        break;
                    }
                }
                if (moveY == null && lastCollapsible != null) {
                    moveY = lastCollapsible;
                }
                if (moveY != null && moveY != y) {
                    for (let i = moveY; i > y; i--) {
                        if (!canMoveTo(x, i - 1)) return;
                    }
                    for (let i = moveY; i > y + 1; i--) {
                        nextGrid[i][x] = grid[i - 1][x];
                        fireGrid[i][x] = fireGrid[i - 1][x];
                    }
                    nextGrid[y + 1][x] = grid[y - 1][x];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixel(2 / 5, 1 / 3, 1 / 5, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        group: 1,
        rotation: 3,
        key: Infinity,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'push_cloner_down',
        numId: 0
    },
    super_cloner_left: {
        name: 'Super Copier (Left)',
        description: 'Copies pixels from its right to its left, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1) {
                nextGrid[y][x - 1] = grid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updateStage: 7,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'super_cloner_left',
        numId: 0
    },
    super_cloner_up: {
        name: 'Super Copier (Up)',
        description: 'Copies pixels from below it to above it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                nextGrid[y - 1][x] = grid[y + 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'super_cloner_up',
        numId: 0
    },
    super_cloner_right: {
        name: 'Super Copier (Right)',
        description: 'Copies pixels from its left to its right, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1) {
                nextGrid[y][x + 1] = grid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updateStage: 8,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'super_cloner_right',
        numId: 0
    },
    super_cloner_down: {
        name: 'Super Copier (Down)',
        description: 'Copies pixels from above it to below it, removing whatever was previously there',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1) {
                nextGrid[y + 1][x] = grid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixel(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';;
            fillPixel(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'super_cloner_down',
        numId: 0
    },
    piston_left: {
        name: 'Pusher (Left)',
        description: 'Pushes pixels in its path',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            let moveX = null;
            let lastCollapsible = null;
            for (let i = x - 1; i >= 0; i--) {
                if (isAir(i, y)) {
                    moveX = i;
                    if (grid[y][i] == pixNum.DELETER) {
                        moveX++;
                    }
                    break;
                }
                if (grid[y][i] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!(numPixels[grid[y][i]] ?? numPixels[pixNum.MISSING]).pushable || (grid[y][i] == pixNum.GOAL && targetGrid[y][i]) || grid[y][i] == pixNum.SLIDER_VERTICAL || grid[y][i] == pixNum.PISTON_RIGHT) {
                    break;
                }
            }
            if (moveX == null && lastCollapsible != null) {
                moveX = lastCollapsible;
            }
            if (moveX != null) {
                for (let i = moveX; i < x; i++) {
                    if (!canMoveTo(i + 1, y)) return;
                }
                for (let i = moveX; i < x; i++) {
                    nextGrid[y][i] = grid[y][i + 1];
                    fireGrid[y][i] = fireGrid[y][i + 1];
                }
                nextGrid[y][x] = pixNum.AIR;
                fireGrid[y][x] = false;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_left',
        numId: 0
    },
    piston_up: {
        name: 'Pusher (Up)',
        description: 'Pushes pixels in its path',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            let moveY = null;
            let lastCollapsible = null;
            for (let i = y - 1; i >= 0; i--) {
                if (isAir(x, i)) {
                    moveY = i;
                    if (grid[i][x] == pixNum.DELETER) {
                        moveY++;
                    }
                    break;
                }
                if (grid[i][x] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!(numPixels[grid[i][x]] ?? numPixels[pixNum.MISSING]).pushable || (grid[i][x] == pixNum.GOAL && targetGrid[i][x]) || grid[i][x] == pixNum.SLIDER_HORIZONTAL || grid[i][x] == pixNum.PISTON_DOWN) {
                    break;
                }
            }
            if (moveY == null && lastCollapsible != null) {
                moveY = lastCollapsible;
            }
            if (moveY != null) {
                for (let i = moveY; i < y; i++) {
                    if (!canMoveTo(x, i + 1)) return;
                }
                for (let i = moveY; i < y; i++) {
                    nextGrid[i][x] = grid[i + 1][x];
                    fireGrid[i][x] = fireGrid[i + 1][x];
                }
                nextGrid[y][x] = pixNum.AIR;
                fireGrid[y][x] = false;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_up',
        numId: 0
    },
    piston_right: {
        name: 'Pusher (Right)',
        description: 'Pushes pixels in its path',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            let moveX = null;
            let lastCollapsible = null;
            for (let i = x + 1; i <= gridSize - 1; i++) {
                if (isAir(i, y)) {
                    moveX = i;
                    if (grid[y][i] == pixNum.DELETER) {
                        moveX--;
                    }
                    break;
                }
                if (grid[y][i] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!(numPixels[grid[y][i]] ?? numPixels[pixNum.MISSING]).pushable || (grid[y][i] == pixNum.GOAL && targetGrid[y][i]) || grid[y][i] == pixNum.SLIDER_VERTICAL || grid[y][i] == pixNum.PISTON_LEFT) {
                    break;
                }
            }
            if (moveX == null && lastCollapsible != null) {
                moveX = lastCollapsible;
            }
            if (moveX != null) {
                for (let i = moveX; i > x; i--) {
                    if (!canMoveTo(i - 1, y)) return;
                }
                for (let i = moveX; i > x; i--) {
                    nextGrid[y][i] = grid[y][i - 1];
                    fireGrid[y][i] = fireGrid[y][i - 1];
                }
                nextGrid[y][x] = pixNum.AIR;
                fireGrid[y][x] = false;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_right',
        numId: 0
    },
    piston_down: {
        name: 'Pusher (Down)',
        description: 'Pushes pixels in its path',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            let moveY = null;
            let lastCollapsible = null;
            for (let i = y + 1; i <= gridSize - 1; i++) {
                if (isAir(x, i)) {
                    moveY = i;
                    if (grid[i][x] == pixNum.DELETER) {
                        moveY--;
                    }
                    break;
                }
                if (grid[i][x] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!(numPixels[grid[i][x]] ?? numPixels[pixNum.MISSING]).pushable || (grid[i][x] == pixNum.GOAL && targetGrid[i][x]) || grid[i][x] == pixNum.SLIDER_HORIZONTAL || grid[i][x] == pixNum.PISTON_UP) {
                    break;
                }
            }
            if (moveY == null && lastCollapsible != null) {
                moveY = lastCollapsible;
            }
            if (moveY != null) {
                for (let i = moveY; i > y; i--) {
                    if (!canMoveTo(x, i - 1)) return;
                }
                for (let i = moveY; i > y; i--) {
                    nextGrid[i][x] = grid[i - 1][x];
                    fireGrid[i][x] = fireGrid[i - 1][x];
                }
                nextGrid[y][x] = pixNum.AIR;
                fireGrid[y][x] = false;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_down',
        numId: 0
    },
    fan_left: {
        name: 'Fan (Down)',
        description: 'Pushes stuff in front of it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                return;
            }
            let moveY = null;
            let lastCollapsible = null;
            for (let i = y + 1; i <= gridSize - 1; i++) {
                if (isAir(x, i)) {
                    moveY = i;
                    if (grid[i][x] == pixNum.DELETER) {
                        moveY--;
                    }
                    break;
                }
                if (grid[i][x] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!(numPixels[grid[i][x]] ?? numPixels[pixNum.MISSING]).pushable || (grid[i][x] == pixNum.GOAL && targetGrid[i][x]) || grid[i][x] == pixNum.SLIDER_HORIZONTAL || grid[i][x] == pixNum.PISTON_UP) {
                    break;
                }
            }
            if (moveY == null && lastCollapsible != null) {
                moveY = lastCollapsible;
            }
            if (moveY != null) {
                for (let i = moveY; i > y; i--) {
                    if (!canMoveTo(x, i - 1)) return;
                }
                for (let i = moveY; i > y; i--) {
                    nextGrid[i][x] = grid[i - 1][x];
                    fireGrid[i][x] = fireGrid[i - 1][x];
                }
                nextGrid[y][x] = pixNum.AIR;
                fireGrid[y][x] = false;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'fan_left',
        numId: 0
    },
    rotator_left: {
        name: 'Rotator (Left)',
        description: 'Rotates directional pixels to face left',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 0,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'rotator_left',
        numId: 0
    },
    rotator_up: {
        name: 'Rotator (Up)',
        description: 'Rotates directional pixels to face up',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 1,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'rotator_up',
        numId: 0
    },
    rotator_right: {
        name: 'Rotator (Right)',
        description: 'Rotates directional pixels to face right',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 2,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'rotator_right',
        numId: 0
    },
    rotator_down: {
        name: 'Rotator (Down)',
        description: 'Rotates directional pixels to face down',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 3,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'rotator_down',
        numId: 0
    },
    rotator_clockwise: {
        name: 'Rotator (Clockwise)',
        description: 'Rotates directional pixels clockwise',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[Math.floor(frameCount / 10) % 4], ctx);
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.66)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.2)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(0, 0, 2 / 3, 1 / 3);
            fillPixel(1 / 3, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(1 / 3, 0, 2 / 3, 1 / 3);
            fillPixel(0, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(2 / 3, 0, 1 / 3, 2 / 3);
            fillPixel(0, 1 / 3, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(2 / 3, 1 / 3, 1 / 3, 2 / 3);
            fillPixel(0, 0, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'rotator_clockwise',
        numId: 0
    },
    rotator_counterclockwise: {
        name: 'Rotator (Counterclockwise)',
        description: 'Rotates directional pixels counterclockwise',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[Math.floor(frameCount / 10) % 4], ctx);
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX];
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL || pixel == pixNum.MIRROR_1 || pixel == pixNum.MIRROR_2) {
                    rotatePixel(actionX, actionY, 2);
                } else if ((pixel >= pixNum.CLONER_LEFT && pixel <= pixNum.PISTON_DOWN) || (pixel >= pixNum.LASER_LEFT && pixel <= pixNum.LASER_DOWN)) {
                    rotatePixel(actionX, actionY, 4);
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.66)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(75, 255, 255, 0.2)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(1 / 3, 0, 2 / 3, 1 / 3);
            fillPixel(0, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(0, 0, 2 / 3, 1 / 3);
            fillPixel(1 / 3, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(2 / 3, 1 / 3, 1 / 3, 2 / 3);
            fillPixel(0, 0, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixel(2 / 3, 0, 1 / 3, 2 / 3);
            fillPixel(0, 1 / 3, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 1,
        key: Infinity,
        updateStage: 14,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'rotator_counterclockwise',
        numId: 0
    },
    slider_horizontal: {
        name: 'Horizontal Slider',
        description: 'Can only be pushed left and right',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 180, 0)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            for (let i = 0; i < height; i++) {
                fillPixel(x, y + i + 1 / 4, width, 1 / 2, ctx);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(0, 25 / 2, 50, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'slider_horizontal',
        numId: 0
    },
    slider_vertical: {
        name: 'Vertical Slider',
        description: 'Can only be pushed up and down',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(250, 180, 0)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            for (let i = 0; i < width; i++) {
                fillPixel(x + i + 1 / 4, y, 1 / 2, height, ctx);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(25 / 2, 0, 25, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'slider_vertical',
        numId: 0
    },
    collapsible: {
        name: 'Collapsible Box',
        description: 'A box that will disintegrate when squished',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 120, 210)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(50 / 6, 50 / 6, 100 / 3, 100 / 3);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(0, -5, Math.sqrt(2) * 50, 10);
            ctx.resetTransform();
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(250, 180, 0)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            fillPixel(1 / 6, 1 / 6, 2 / 3, 2 / 3);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.rotate(Math.PI / 4);
            fillPixel(0, -0.1, Math.sqrt(2), 0.2);
            ctx.resetTransform();
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 1,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'collapsible',
        numId: 0
    },
    pump: {
        name: 'Water Pump',
        description: 'Violates the Laws of Thermodynamics to create water',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(25, 125, 75)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            fillPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, ctx);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            for (let i = 0; i < width - 1; i++) {
                fillPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, ctx);
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, pixNum.LAVA, function (actionX, actionY) {
                if (nextGrid[y][x] == null) {
                    nextGrid[y][x] = pixNum.WATER;
                }
            });
            updateTouchingPixel(x, y, pixNum.AIR, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.125) {
                    nextGrid[actionY][actionX] = pixNum.WATER;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: 12,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'pump',
        numId: 0
    },
    lava_generator: {
        name: 'Lava Heater',
        description: 'Violates the Laws of Thermodynamics to create lava',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(25, 125, 75)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            fillPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, ctx);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            for (let i = 0; i < width - 1; i++) {
                fillPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, ctx);
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, pixNum.WATER, function (actionX, actionY) {
                explode(x, y, 5);
            });
            updateTouchingPixel(x, y, pixNum.AIR, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
            });
            updateTouchingPixel(x, y, pixNum.STEAM, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
            });
            updateTouchingPixel(x, y, pixNum.STONE, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: 12,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'lava_generator',
        numId: 0
    },
    nuke_diffuser: {
        name: 'Nuke Diffuser',
        description: 'Doesn\'t cause diffusion, but will defuse nukes touching it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(175, 50, 0)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(225, 125, 0)';
            for (let i = 0; i < width; i++) {
                fillPixel(x + i + 1 / 3, y, 1 / 3, height, ctx);
            }
            for (let i = 0; i < height; i++) {
                fillPixel(x, y + i + 1 / 3, width, 1 / 3, ctx);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(175, 50, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            ctx.fillRect(0, 50 / 3, 50, 50 / 3);
            ctx.fillRect(50 / 3, 0, 50 / 3, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 19,
        flammability: 2,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'nuke_diffuser',
        numId: 0
    },
    laser_left: {
        name: 'L.A.S.E.R. (Left)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Leftwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            fillPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i, y + 1 / 3 + j, 1 / 2, 1 / 3, ctx);
                }
            }
            abovectx.globalAlpha = opacity;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            for (let i = 0; i < height; i++) {
                drawLaserPath(getLaserPath(x, y + i, 0));
            }
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 0);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridSize || last[3] < 0 || last[3] >= gridSize) return;
            if (random() < 0.2 - ((numPixels[grid[last[3]][last[2]]] ?? numPixels[pixNum.MISSING]).blastResistance / 100)) {
                if (grid[last[3]][last[2]] > pixNum.LASER_LEFT && grid[last[3]][last[2]] < pixNum.LASER_DOWN) explode(last[2], last[3], 5);
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) nextGrid[last[3]][last[2]] = pixNum.AIR;
                if (grid[last[3]][last[2]] < pixNum.LASER_LEFT || grid[last[3]][last[2]] > pixNum.LASER_DOWN) nextFireGrid[last[3]][last[2]] = true;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 2,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_left',
        numId: 0
    },
    laser_up: {
        name: 'L.A.S.E.R. (Up)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Upwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            fillPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + 1 / 3 + i, y + j, 1 / 3, 1 / 2, ctx);
                }
            }
            abovectx.globalAlpha = opacity;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            for (let i = 0; i < width; i++) {
                drawLaserPath(getLaserPath(x + i, y, 1));
            }
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 1);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridSize || last[3] < 0 || last[3] >= gridSize) return;
            if (random() < 0.2 - ((numPixels[grid[last[3]][last[2]]] ?? numPixels[pixNum.MISSING]).blastResistance / 100)) {
                if (grid[last[3]][last[2]] > pixNum.LASER_LEFT && grid[last[3]][last[2]] < pixNum.LASER_DOWN) explode(last[2], last[3], 5);
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) nextGrid[last[3]][last[2]] = pixNum.AIR;
                if (grid[last[3]][last[2]] < pixNum.LASER_LEFT || grid[last[3]][last[2]] > pixNum.LASER_DOWN) nextFireGrid[last[3]][last[2]] = true;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 2,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_up',
        numId: 0
    },
    laser_right: {
        name: 'L.A.S.E.R. (Right)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Rightwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            fillPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + 1 / 2 + i, y + 1 / 3 + j, 1 / 2, 1 / 3, ctx);
                }
            }
            abovectx.globalAlpha = opacity;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            for (let i = 0; i < height; i++) {
                drawLaserPath(getLaserPath(x + width - 1, y + i, 2));
            }
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 2);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridSize || last[3] < 0 || last[3] >= gridSize) return;
            if (random() < 0.2 - ((numPixels[grid[last[3]][last[2]]] ?? numPixels[pixNum.MISSING]).blastResistance / 100)) {
                if (grid[last[3]][last[2]] > pixNum.LASER_LEFT && grid[last[3]][last[2]] < pixNum.LASER_DOWN) explode(last[2], last[3], 5);
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) nextGrid[last[3]][last[2]] = pixNum.AIR;
                if (grid[last[3]][last[2]] < pixNum.LASER_LEFT || grid[last[3]][last[2]] > pixNum.LASER_DOWN) nextFireGrid[last[3]][last[2]] = true;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        group: 2,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_right',
        numId: 0
    },
    laser_down: {
        name: 'L.A.S.E.R. (Down)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Downwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            fillPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + 1 / 3 + i, y + 1 / 2 + j, 1 / 3, 1 / 2, ctx);
                }
            }
            abovectx.globalAlpha = opacity;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            for (let i = 0; i < width; i++) {
                drawLaserPath(getLaserPath(x + i, y + height - 1, 3));
            }
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 3);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridSize || last[3] < 0 || last[3] >= gridSize) return;
            if (random() < 0.2 - ((numPixels[grid[last[3]][last[2]]] ?? numPixels[pixNum.MISSING]).blastResistance / 100)) {
                if (grid[last[3]][last[2]] > pixNum.LASER_LEFT && grid[last[3]][last[2]] < pixNum.LASER_DOWN) explode(last[2], last[3], 5);
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) nextGrid[last[3]][last[2]] = pixNum.AIR;
                if (grid[last[3]][last[2]] < pixNum.LASER_LEFT || grid[last[3]][last[2]] > pixNum.LASER_DOWN) nextFireGrid[last[3]][last[2]] = true;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        group: 2,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_down',
        numId: 0
    },
    glass: {
        name: 'Glass',
        description: 'For some reason you can see it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(240, 240, 245)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(2, 12, 10, 10);
            ctx.fillRect(12, 2, 10, 10);
            ctx.fillRect(38, 28, 10, 10);
            ctx.fillRect(28, 38, 10, 10);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(25);
            ctx.fillStyle = 'rgb(240, 240, 245)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            fillPixel(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            fillPixel(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            fillPixel(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            fillPixel(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'glass',
        numId: 0
    },
    reinforced_glass: {
        name: 'Reinforced Glass',
        description: 'Really heavy glass',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(240, 240, 245)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(2, 12, 10, 10);
            ctx.fillRect(12, 2, 10, 10);
            ctx.fillRect(38, 28, 10, 10);
            ctx.fillRect(28, 38, 10, 10);
            ctx.fillStyle = 'rgb(220, 220, 230)';
            ctx.fillRect(0, 0, 50, 5);
            ctx.fillRect(45, 0, 5, 50);
            ctx.fillRect(0, 45, 50, 5);
            ctx.fillRect(0, 0, 5, 50);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(150);
            ctx.fillStyle = 'rgb(240, 240, 245)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            fillPixel(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            fillPixel(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            fillPixel(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            fillPixel(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            ctx.fillStyle = 'rgb(220, 220, 230)';
            fillPixel(0, 0, 1, 1 / 10);
            fillPixel(9 / 10, 0, 1 / 10, 1);
            fillPixel(0, 9 / 10, 1, 1 / 10);
            fillPixel(0, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'reinforced_glass',
        numId: 0
    },
    laser_scatterer: {
        name: 'Laser Scatterer',
        description: 'Scatters lasers that pass through it and makes them useless',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(220, 220, 255)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(210, 210, 220)';
            for (let i = 0; i < width; i++) {
                fillPixel(x + i, y, 1 / 4, height, ctx);
                fillPixel(x + i + 1 / 2, y, 1 / 4, height, ctx);
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(210, 210, 220)';
            ctx.fillRect(0, 0, 25 / 2, 50);
            ctx.fillRect(25, 0, 25 / 2, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'laser_scatterer',
        numId: 0
    },
    mirror_1: {
        name: 'Mirror',
        description: 'Be careful around lasers, as it will redirect those to who knows where',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            clearPixels(x, y, width, height, ctx);
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(25 / 3, 25, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(25, 25 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 25 / 3, 25 / 3);
            ctx.fillRect(125 / 3, 0, 25 / 3, 25 / 3);
            ctx.fillRect(125 / 3, 125 / 3, 25 / 3, 25 / 3);
            ctx.fillRect(0, 125 / 3, 25 / 3, 25 / 3);
            ctx.fillRect(0, 5 / 3, 50, 5);
            ctx.fillRect(130 / 3, 0, 5, 50);
            ctx.fillRect(0, 130 / 3, 50, 5);
            ctx.fillRect(5 / 3, 0, 5, 50);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(220, 220, 220)';
            fillPixel(0, 2 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 6, 1 / 2, 1 / 3, 1 / 3);
            fillPixel(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 2, 1 / 6, 1 / 3, 1 / 3);
            fillPixel(2 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1 / 6, 1 / 6);
            fillPixel(5 / 6, 0, 1 / 6, 1 / 6);
            fillPixel(5 / 6, 5 / 6, 1 / 6, 1 / 6);
            fillPixel(0, 5 / 6, 1 / 6, 1 / 6);
            fillPixel(0, 1 / 30, 1, 1 / 10);
            fillPixel(13 / 15, 0, 1 / 10, 1);
            fillPixel(0, 13 / 15, 1, 1 / 10);
            fillPixel(1 / 30, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'mirror_1',
        numId: 0
    },
    mirror_2: {
        name: 'Mirror',
        description: 'Be careful around lasers, as it will redirect those to who knows where',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            clearPixels(x, y, width, height, ctx);
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(25 / 3, 25 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(25, 25, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 25 / 3, 25 / 3);
            ctx.fillRect(125 / 3, 0, 25 / 3, 25 / 3);
            ctx.fillRect(125 / 3, 125 / 3, 25 / 3, 25 / 3);
            ctx.fillRect(0, 125 / 3, 25 / 3, 25 / 3);
            ctx.fillRect(0, 5 / 3, 50, 5);
            ctx.fillRect(130 / 3, 0, 5, 50);
            ctx.fillRect(0, 130 / 3, 50, 5);
            ctx.fillRect(5 / 3, 0, 5, 50);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(220, 220, 220)';
            fillPixel(0, 0, 1 / 3, 1 / 3);
            fillPixel(1 / 6, 1 / 6, 1 / 3, 1 / 3);
            fillPixel(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixel(1 / 2, 1 / 2, 1 / 3, 1 / 3);
            fillPixel(2 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1 / 6, 1 / 6);
            fillPixel(5 / 6, 0, 1 / 6, 1 / 6);
            fillPixel(5 / 6, 5 / 6, 1 / 6, 1 / 6);
            fillPixel(0, 5 / 6, 1 / 6, 1 / 6);
            fillPixel(0, 1 / 30, 1, 1 / 10);
            fillPixel(13 / 15, 0, 1 / 10, 1);
            fillPixel(0, 13 / 15, 1, 1 / 10);
            fillPixel(1 / 30, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        group: 2,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'mirror_2',
        numId: 0
    },
    music_1: generateMusicPixel(1, {
        name: 'Music Pixel (Square Wave C7 Major Triad Hit)',
        description: 'Makes funny C7 Major triad square wave sound that hurts your ears',
        color: 'rgb(100, 255, 0)',
        text: ''
    }),
    music_2: generateMusicPixel(2, {
        name: 'Music Pixel (Chip Noise)',
        description: 'Makes funny chip noise sound that hurts your ears',
        color: 'rgb(200, 200, 200)',
        text: ''
    }),
    music_3: generateMusicPixel(3, {
        name: 'Music Pixel (Square Wave C₄)',
        description: 'Makes funny C₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C4'
    }),
    music_4: generateMusicPixel(4, {
        name: 'Music Pixel (Square Wave C♯₄/D♭₄)',
        description: 'Makes funny C♯₄/D♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C♯4'
    }),
    music_5: generateMusicPixel(5, {
        name: 'Music Pixel (Square Wave D₄)',
        description: 'Makes funny D₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'D4'
    }),
    music_6: generateMusicPixel(6, {
        name: 'Music Pixel (Square Wave D♯₄/E♭₄)',
        description: 'Makes funny D♯₄/E♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E♭4'
    }),
    music_7: generateMusicPixel(7, {
        name: 'Music Pixel (Square Wave E₄)',
        description: 'Makes funny E₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E4'
    }),
    music_8: generateMusicPixel(8, {
        name: 'Music Pixel (Square Wave F₄)',
        description: 'Makes funny F₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F4'
    }),
    music_9: generateMusicPixel(9, {
        name: 'Music Pixel (Square Wave F♯₄/G♭₄)',
        description: 'Makes funny F♯₄/G♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F♯4'
    }),
    music_10: generateMusicPixel(10, {
        name: 'Music Pixel (Square Wave G₄)',
        description: 'Makes funny G₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'G4'
    }),
    music_11: generateMusicPixel(11, {
        name: 'Music Pixel (Square Wave G♯₄/A♭₄)',
        description: 'Makes funny G♯₄/A♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A♭4'
    }),
    music_12: generateMusicPixel(12, {
        name: 'Music Pixel (Square Wave A₄)',
        description: 'Makes funny A₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A4'
    }),
    music_13: generateMusicPixel(13, {
        name: 'Music Pixel (Square Wave A♯₄/B♭₄)',
        description: 'Makes funny A♯₄/B♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B♭4'
    }),
    music_14: generateMusicPixel(14, {
        name: 'Music Pixel (Square Wave B₄)',
        description: 'Makes funny B₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B4'
    }),
    music_15: generateMusicPixel(15, {
        name: 'Music Pixel (Square Wave C₅)',
        description: 'Makes funny C₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C5'
    }),
    music_16: generateMusicPixel(16, {
        name: 'Music Pixel (Square Wave C♯₅/D♭₅)',
        description: 'Makes funny C♯₅/D♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C♯5'
    }),
    music_17: generateMusicPixel(17, {
        name: 'Music Pixel (Square Wave D₅)',
        description: 'Makes funny D₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'D5'
    }),
    music_18: generateMusicPixel(18, {
        name: 'Music Pixel (Square Wave D♯₅/E♭₅)',
        description: 'Makes funny D♯₅/E♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E♭5'
    }),
    music_19: generateMusicPixel(19, {
        name: 'Music Pixel (Square Wave E₅)',
        description: 'Makes funny E₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E5'
    }),
    music_20: generateMusicPixel(20, {
        name: 'Music Pixel (Square Wave F₅)',
        description: 'Makes funny F₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F5'
    }),
    music_21: generateMusicPixel(21, {
        name: 'Music Pixel (Square Wave F♯₅/G♭₅)',
        description: 'Makes funny F♯₅/G♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F♯5'
    }),
    music_22: generateMusicPixel(22, {
        name: 'Music Pixel (Square Wave G₅)',
        description: 'Makes funny G₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'G5'
    }),
    music_23: generateMusicPixel(23, {
        name: 'Music Pixel (Square Wave G♯₅/A♭₅)',
        description: 'Makes funny G♯₅/A♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A♭5'
    }),
    music_24: generateMusicPixel(24, {
        name: 'Music Pixel (Square Wave A₅)',
        description: 'Makes funny A₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A5'
    }),
    music_25: generateMusicPixel(25, {
        name: 'Music Pixel (Square Wave A♯₅/B♭₅)',
        description: 'Makes funny A♯₅/B♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B♭5'
    }),
    music_26: generateMusicPixel(26, {
        name: 'Music Pixel (Square Wave B₅)',
        description: 'Makes funny B₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B5'
    }),
    music_27: generateMusicPixel(27, {
        name: 'Music Pixel (Square Wave C₆)',
        description: 'Makes funny C₆ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C6'
    }),
    music_28: generateMusicPixel(28, {
        name: 'Music Pixel (Sawtooth Wave C₄)',
        description: 'Makes funny C₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C4'
    }),
    music_29: generateMusicPixel(29, {
        name: 'Music Pixel (Sawtooth Wave C♯₄/D♭₄)',
        description: 'Makes funny C♯₄/D♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C♯4'
    }),
    music_30: generateMusicPixel(30, {
        name: 'Music Pixel (Sawtooth Wave D₄)',
        description: 'Makes funny D₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'D4'
    }),
    music_31: generateMusicPixel(31, {
        name: 'Music Pixel (Sawtooth Wave D♯₄/E♭₄)',
        description: 'Makes funny D♯₄/E♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E♭4'
    }),
    music_32: generateMusicPixel(32, {
        name: 'Music Pixel (Sawtooth Wave E₄)',
        description: 'Makes funny E₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E4'
    }),
    music_33: generateMusicPixel(33, {
        name: 'Music Pixel (Sawtooth Wave F₄)',
        description: 'Makes funny F₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F4'
    }),
    music_34: generateMusicPixel(34, {
        name: 'Music Pixel (Sawtooth Wave F♯₄/G♭₄)',
        description: 'Makes funny F♯₄/G♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F♯4'
    }),
    music_35: generateMusicPixel(35, {
        name: 'Music Pixel (Sawtooth Wave G₄)',
        description: 'Makes funny G₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'G4'
    }),
    music_36: generateMusicPixel(36, {
        name: 'Music Pixel (Sawtooth Wave G♯₄/A♭₄)',
        description: 'Makes funny G♯₄/A♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A♭4'
    }),
    music_37: generateMusicPixel(37, {
        name: 'Music Pixel (Sawtooth Wave A₄)',
        description: 'Makes funny A₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A4'
    }),
    music_38: generateMusicPixel(38, {
        name: 'Music Pixel (Sawtooth Wave A♯₄/B♭₄)',
        description: 'Makes funny A♯₄/B♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B♭4'
    }),
    music_39: generateMusicPixel(39, {
        name: 'Music Pixel (Sawtooth Wave B₄)',
        description: 'Makes funny B₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B4'
    }),
    music_40: generateMusicPixel(40, {
        name: 'Music Pixel (Sawtooth Wave C₅)',
        description: 'Makes funny C₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C5'
    }),
    music_41: generateMusicPixel(41, {
        name: 'Music Pixel (Sawtooth Wave C♯₅/D♭₅)',
        description: 'Makes funny C♯₅/D♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C♯5'
    }),
    music_42: generateMusicPixel(42, {
        name: 'Music Pixel (Sawtooth Wave D₅)',
        description: 'Makes funny D₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'D5'
    }),
    music_43: generateMusicPixel(43, {
        name: 'Music Pixel (Sawtooth Wave D♯₅/E♭₅)',
        description: 'Makes funny D♯₅/E♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E♭5'
    }),
    music_44: generateMusicPixel(44, {
        name: 'Music Pixel (Sawtooth Wave E₅)',
        description: 'Makes funny E₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E5'
    }),
    music_45: generateMusicPixel(45, {
        name: 'Music Pixel (Sawtooth Wave F₅)',
        description: 'Makes funny F₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F5'
    }),
    music_46: generateMusicPixel(46, {
        name: 'Music Pixel (Sawtooth Wave F♯₅/G♭₅)',
        description: 'Makes funny F♯₅/G♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F♯5'
    }),
    music_47: generateMusicPixel(47, {
        name: 'Music Pixel (Sawtooth Wave G₅)',
        description: 'Makes funny G₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'G5'
    }),
    music_48: generateMusicPixel(48, {
        name: 'Music Pixel (Sawtooth Wave G♯₅/A♭₅)',
        description: 'Makes funny G♯₅/A♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A♭5'
    }),
    music_49: generateMusicPixel(49, {
        name: 'Music Pixel (Sawtooth Wave A₅)',
        description: 'Makes funny A₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A5'
    }),
    music_50: generateMusicPixel(50, {
        name: 'Music Pixel (Sawtooth Wave A♯₅/B♭₅)',
        description: 'Makes funny A♯₅/B♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B♭5'
    }),
    music_51: generateMusicPixel(51, {
        name: 'Music Pixel (Sawtooth Wave B₅)',
        description: 'Makes funny B₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B5'
    }),
    music_52: generateMusicPixel(52, {
        name: 'Music Pixel (Sawtooth Wave C₆)',
        description: 'Makes funny C₆ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C6'
    }),
    nuke: {
        name: 'Nuke',
        description: 'TBH, kinda weak',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(0, 255, 125)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.NUKE) {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 10);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 255, 125)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'nuke',
        numId: 0
    },
    huge_nuke: {
        name: 'Huge Nuke',
        description: 'KABOOM!',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 60, 255)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.HUGE_NUKE) {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 20);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 60, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'huge_nuke',
        numId: 0
    },
    very_huge_nuke: {
        name: 'Very Huge Nuke',
        description: 'AAAAAAAAAAAAAAAAAAAAA',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 0, 70)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridSize - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.VERY_HUGE_NUKE) {
                    explosion = false;
                }
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                explode(x, y, 40);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 70)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'very_huge_nuke',
        numId: 0
    },
    deleter: {
        name: 'Deleter',
        description: 'undefined',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(x, y, width, height, ctx);
            let color = colorAnimate(200, 0, 255, 255, 0, 255, 96);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + 1 / 4 + i, y + 1 / 4 + j, 1 / 2, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 0, 255)';
            ctx.fillRect(50 / 4, 50 / 4, 25, 25);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'deleter',
        numId: 0
    },
    lag_spike_generator: {
        name: 'lag_spike_generator',
        description: 'Not that laggy',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    fillPixel(x + i, y + j, 1, 1, ctx);
                    ctx.fillStyle = `rgb(125, 255, 0, ${(random() * 0.6 + 0.4)})`;
                    fillPixel(x + i, y + j, 1, 1, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, pixNum.AIR, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = pixNum.LAG_SPIKE_GENERATOR;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.025) {
                    nextGrid[actionY][actionX] = pixNum.PUMP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.025) {
                    nextGrid[actionY][actionX] = pixNum.CLONER_DOWN;
                }
            });
            updateTouchingPixel(x, y, pixNum.LAG_SPIKE_GENERATOR, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.005) {
                    nextGrid[actionY][actionX] = pixNum.NUKE;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 255, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 15,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: 13,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'lag_spike_generator',
        numId: 0
    },
    corruption: {
        name: '�',
        description: '<span style="color: red">�</span>',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    for (let k = 0; k < random(1, 5); k++) {
                        let rotationAmount = Math.floor(random(0, 360));
                        ctx.translate((x + i + 1 / 2) * gridScale, (y + j + 1 / 2) * gridScale);
                        let translateX = random(-10 * gridScale, 10 * gridScale);
                        let translateY = random(-10 * gridScale, 10 * gridScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        ctx.translate(translateX, translateY);
                        ctx.rotate(rotationAmount);
                        ctx.save();
                        ctx.transform(1, skewY, skewX, 1, 0, 0);
                        let borkXScale = random(0, 4);
                        let borkYScale = random(0, 2);
                        ctx.fillStyle = 'rgb(0, 0, 0)';
                        fillPixel(0, 0, borkXScale, borkYScale, ctx);
                        ctx.fillStyle = `rgb(100, 255, 0, ${(random() * 0.6 + 0.4)})`;
                        fillPixel(0, 0, borkXScale, borkYScale, ctx);
                        ctx.restore();
                        ctx.rotate(-rotationAmount);
                        ctx.translate(-(x + i + 1 / 2) * gridScale - translateX, -(y + j + 1 / 2) * gridScale - translateY);
                    }
                    if (random(1, 5) < 1.2) {
                        for (let k = 0; k < random(1, 10); k++) {
                            let rotationAmount = Math.floor(random(0, 360));
                            ctx.translate((x + i + 1 / 2) * gridScale, (y + j + 1 / 2) * gridScale);
                            let translateX = random(-20 * gridScale, 20 * gridScale);
                            let translateY = random(-20 * gridScale, 20 * gridScale);
                            ctx.translate(translateX, translateY);
                            ctx.rotate(rotationAmount);
                            drawPixels(0, 0, 1, 1, pixNum.MISSING, opacity, ctx);
                            ctx.rotate(-rotationAmount);
                            ctx.translate(-(x + i + 1 / 2) * gridScale - translateX, -(y + j + 1 / 2) * gridScale - translateY);
                        }
                        let rotationAmount = Math.floor(random(0, 360));
                        ctx.translate((x + i + 1 / 2) * gridScale, (y + j + 1 / 2) * gridScale);
                        let translateX = random(-gridSize * gridScale, gridSize * gridScale);
                        let translateY = random(-gridSize * gridScale, gridSize * gridScale);
                        let skewX = random(-PI / 6, PI / 6);
                        let skewY = random(-PI / 6, PI / 6);
                        ctx.translate(translateX, translateY);
                        ctx.rotate(rotationAmount);
                        ctx.save();
                        ctx.transform(1, skewY, skewX, 1, 0, 0);
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                        ctx.fillRect(0, 0, 90, 90);
                        ctx.fillStyle = 'rgb(255, 255, 0)';
                        ctx.fillRect(10, 10, 70, 70);
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                        ctx.fillRect(40, 20, 10, 30);
                        ctx.fillRect(40, 60, 10, 10);
                        ctx.restore();
                        ctx.rotate(-rotationAmount);
                        ctx.translate(-(x + i + 1 / 2) * gridScale - translateX, -(y + j + 1 / 2) * gridScale - translateY);
                    }
                    abovectx.globalAlpha = opacity;
                    abovectx.fillStyle = 'rgb(255, 0, 0)';
                    for (let i = 0; i < width; i++) {
                        drawLaserPath(getLaserPath(x + i, y + j, Math.floor(Math.random() * 4)));
                    }
                }
            }
        },
        update: function (x, y) {
            function chaos(actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.CORRUPTION;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.WATER;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.MISSING;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.AIR;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUMP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LAVA_GENERATOR;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUSH_CLONER_DOWN;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUSH_CLONER_LEFT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUSH_CLONER_RIGHT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUSH_CLONER_UP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PISTON_LEFT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PISTON_RIGHT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PISTON_UP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PISTON_DOWN;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LASER_LEFT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LASER_UP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LASER_RIGHT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LASER_DOWN;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.MIRROR_1;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.MIRROR_2;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.05) {
                    nextGrid[actionY][actionX] = pixNum.NUKE;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.02) {
                    nextGrid[actionY][actionX] = pixNum.HUGE_NUKE;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.01) {
                    nextGrid[actionY][actionX] = pixNum.VERY_HUGE_NUKE;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.001) {
                    nextGrid[actionY][actionX] = pixNum.SPIN;
                }
                if (random() < 0.1) {
                    fireGrid[actionY][actionX] = true;
                }
                move(Math.min(Math.max(Math.round(random(x - 5, x + 5)), 0), gridSize - 1), Math.min(Math.max(Math.round(random(y - 5, y + 5)), 0), gridSize - 1), Math.min(Math.max(Math.round(random(x - 5, x + 5)), 0), gridSize - 1), Math.min(Math.max(Math.round(random(y - 5, y + 5)), 0), gridSize - 1));
            };
            updateTouchingPixel(x, y, pixNum.AIR, chaos);
            updateTouchingAnything(x, y, chaos);
            let path = getLaserPath(x, y, Math.floor(random() * 4));
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridSize || last[3] < 0 || last[3] >= gridSize) return;
            if (random() < 0.5 - ((numPixels[grid[last[3]][last[2]]] ?? numPixels[pixNum.MISSING]).blastResistance / 100)) {
                if (grid[last[3]][last[2]] > pixNum.LASER_LEFT && grid[last[3]][last[2]] < pixNum.LASER_DOWN) explode(last[2], last[3], 5);
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) nextGrid[last[3]][last[2]] = pixNum.AIR;
                if (grid[last[3]][last[2]] < pixNum.LASER_LEFT || grid[last[3]][last[2]] > pixNum.LASER_DOWN) nextFireGrid[last[3]][last[2]] = true;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(4, 4, 42, 42);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(22, 8, 6, 22);
            ctx.fillRect(22, 36, 6, 6);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: NaN,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: 13,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'corruption',
        numId: 0
    },
    spin: {
        name: 'Spin',
        description: 'SPINNY CARRIER GO WEEEEEEEEEEEEEEEEEEEEEEEEE!!',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    ctx.translate((x + i + 1 / 2) * gridScale, (y + j + 1 / 2) * gridScale);
                    let translateX = random(-10 * gridScale, 10 * gridScale);
                    let translateY = random(-10 * gridScale, 10 * gridScale);
                    ctx.translate(translateX, translateY);
                    let rotationAmount = Math.floor(random(0, 360));
                    ctx.rotate(rotationAmount);
                }
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        pickable: false,
        id: 'spin',
        numId: 0
    },
    placementUnRestriction: {
        name: 'Allow Placement',
        description: 'Remove placement restrictions in sandbox levels',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(5, 5, 40, 40);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: 5,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'placementUnRestriction',
        numId: 0
    },
    placementRestriction: {
        name: 'Prevent Placement',
        description: 'Prevents players from placing pixels in sandbox levels',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity * 0.2;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(240, 240, 240)';
            ctx.fillRect(5, 5, 40, 40);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(5, 5, 8, 8);
            ctx.fillRect(37, 5, 8, 8);
            ctx.fillRect(13, 13, 8, 8);
            ctx.fillRect(29, 13, 8, 8);
            ctx.fillRect(21, 21, 8, 8);
            ctx.fillRect(13, 29, 8, 8);
            ctx.fillRect(29, 29, 8, 8);
            ctx.fillRect(5, 37, 8, 8);
            ctx.fillRect(37, 37, 8, 8);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.rotate(-Math.PI / 4);
            fillPixel(-0.1, 0, 0.2, 0.1);
            fillPixel(-Math.sqrt(2) / 2, Math.sqrt(2) / 2 - 0.1, Math.sqrt(2), 0.2);
            fillPixel(-0.1, Math.sqrt(2) - 0.1, 0.2, 0.1);
            ctx.resetTransform();
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: 5,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'placementRestriction',
        numId: 0
    },
    monster: {
        name: 'Monster',
        description: 'The bad pixels in challenge puzzles',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) {
            if (grid[y][x] != pixNum.AIR) {
                grid[y][x] = pixNum.AIR;
                monsterGrid[y][x] = false;
                fireGrid[y][x] = false;
            } else if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1) && !monsterGrid[y + 1][x]) {
                if (grid[y + 1][x] == pixNum.DELETER) {
                    nextGrid[y][x] = pixNum.AIR;
                    monsterGrid[y][x] = false;
                    nextFireGrid[y][x] = false;
                } else {
                    nextGrid[y][x] = grid[y + 1][x];
                    nextGrid[y + 1][x] = grid[y][x];
                    monsterGrid[y + 1][x] = true;
                    monsterGrid[y][x] = false;
                    let fire = fireGrid[y + 1][x];
                    fireGrid[y + 1][x] = fireGrid[y][x];
                    fireGrid[y][x] = fire;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 20, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 30, 0)';
            ctx.fillRect(50 / 6, 50 / 6, 100 / 3, 100 / 3);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(50 / 6, 10, 10, 10);
            ctx.fillRect(950 / 30, 10, 10, 10);
            ctx.fillRect(50 / 4, 30, 25, 50 / 6);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(200, 20, 0)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 30, 0)';
            fillPixel(1 / 6, 1 / 6, 2 / 3, 2 / 3);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixel(1 / 6, 1 / 5, 1 / 5, 1 / 5);
            fillPixel(19 / 30, 1 / 5, 1 / 5, 1 / 5);
            fillPixel(1 / 4, 3 / 5, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 20,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: 5,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'monster',
        numId: 0
    },
    goal: {
        name: 'Goal',
        description: 'Must be pushed into targets in puzzles',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 200, 0)';
            fillPixel(x, y, width, height, ctx);
            ctx.fillStyle = 'rgb(255, 240, 0)';
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    fillPixel(x + i + 1 / 5, y + j + 1 / 5, 3 / 5, 3 / 5, ctx);
                }
            }
            abovectx.globalAlpha = opacity * 0.2;
            abovectx.fillStyle = 'rgb(255, 180, 0)';
            let margin = (Math.sin(frameCount * Math.PI / 120) + 1) / 4;
            fillPixel(x - margin, y - margin, width + margin * 2, height + margin * 2, abovectx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 200, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 240, 0)';
            ctx.fillRect(10, 10, 30, 30);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: false,
        rotateable: false,
        group: 5,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'goal',
        numId: 0
    },
    target: {
        name: 'Target',
        description: 'Goal pixels must be pushed into it in puzzles',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
            abovectx.globalAlpha = opacity * 0.2;
            abovectx.fillStyle = 'rgb(0, 255, 255)';
            let margin = (Math.sin(frameCount * Math.PI / 120) + 1) / 4;
            fillPixel(x - margin, y - margin, width + margin * 2, height + margin * 2, abovectx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 200, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(10, 10, 30, 30);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(5);
            ctx.fillStyle = 'rgb(0, 200, 255)';
            fillPixel(0, 0, 1, 1 / 5);
            fillPixel(0, 0, 1 / 5, 1);
            fillPixel(0, 4 / 5, 1, 1 / 5);
            fillPixel(4 / 5, 0, 1 / 5, 1);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: 5,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'target',
        numId: 0
    },
    remove: {
        name: 'Remove (brush only)',
        description: 'Unfortunately it\'s not THE red pixel',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: -1,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'remove',
        numId: 0
    },
    missing: {
        name: 'Missing Pixel',
        description: 'Check your save code, it probably has pixels that don\'t exist in it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            imagePixel(x, y, width, height, this.prerenderedFrames[0], ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 255)';
            ctx.fillRect(0, 0, 25, 25);
            ctx.fillRect(25, 25, 25, 25);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(2);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 255)';
            fillPixel(0, 0, 1 / 2, 1 / 2);
            fillPixel(1 / 2, 1 / 2, 1 / 2, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: -1,
        key: Infinity,
        updateStage: -1,
        animatedNoise: false,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'missing',
        numId: 0
    },
    red: {
        name: 'Red Pixel',
        description: 'What???',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, canvasResolution, canvasResolution);
        },
        update: function (x, y) {
            simulationPaused = true;
            modal('Red Pixel Simulator', '86 7A 91 7A 8A 26 7C 87 86 86 76 26 7C 81 91 7A 26 94 87 90 26 90 88', false).then(() => window.location.reload());
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        prerenderedFrames: [],
        blastResistance: undefined,
        flammability: undefined,
        pushable: false,
        cloneable: false,
        rotateable: false,
        group: -1,
        key: Infinity,
        updateStage: 0,
        animatedNoise: false,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'red',
        numId: 0
    }
};
const numPixels = {};
const pixNum = {};
const pixelAmounts = {};
const pixelSelectors = {};
function resetPixelAmounts() {
    for (let id in pixels) {
        pixelAmounts[id] = 0;
        updatePixelAmount(id, true);
    }
    pixelAmounts['air'] = Infinity;
    updatePixelAmount('air', true);
};
function updatePixelAmount(id, hideEmpty, forceShow) {
    if (pixelSelectors[id] != undefined) {
        if (sandboxMode) {
            pixelSelectors[id].count.innerText = '';
            pixelSelectors[id].box.classList.remove('pickerNoPixels');
            pixelSelectors[id].box.style.display = '';
        } else {
            pixelSelectors[id].count.innerText = pixelAmounts[id] == Infinity ? '∞' : pixelAmounts[id];
            if (pixelAmounts[id] == 0 || pixelAmounts[id] == Infinity) {
                pixelSelectors[id].box.classList.add('pickerNoPixels');
                if (hideEmpty && !forceShow) pixelSelectors[id].box.style.display = 'none';
                else if (forceShow) pixelSelectors[id].box.style.display = '';
            } else {
                pixelSelectors[id].box.classList.remove('pickerNoPixels');
                pixelSelectors[id].box.style.display = '';
            }
        }
    }
};
function generateMusicPixel(id, data) {
    return {
        name: data.name,
        description: data.description,
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.globalAlpha = opacity;
            for (let y1 = Math.max(y, 0); y1 < Math.min(y + height, gridSize); y1++) {
                for (let x1 = Math.max(x, 0); x1 < Math.min(x + width, gridSize); x1++) {
                    if (musicGrid[y1][x1]) imagePixel(x1, y1, 1, 1, this.prerenderedFrames[1], ctx);
                    else imagePixel(x1, y1, 1, 1, this.prerenderedFrames[0], ctx);
                }
            }
        },
        update: function (x, y) {
            if (updateTouchingAnything(x, y, function (actionX, actionY) {
                if (grid[actionY][actionX] >= pixNum.MUSIC_1 && grid[actionY][actionX] <= pixNum.MUSIC_52) return false;
                return true;
            })) musicGrid[y][x] = id;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 200)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 10);
            ctx.fillRect(40, 0, 10, 50);
            ctx.fillRect(0, 40, 50, 10);
            ctx.fillRect(0, 0, 10, 50);
            ctx.fillStyle = data.color;
            ctx.fillRect(10, 10, 30, 10);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '16px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(data.text, 25, 20);
        },
        prerender: function () {
            const { ctx, fillPixel, toImage } = new PreRenderer(120);
            ctx.fillStyle = 'rgb(200, 0, 180)';
            fillPixel(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixel(0, 0, 1, 1 / 5);
            fillPixel(4 / 5, 0, 1 / 5, 1);
            fillPixel(0, 4 / 5, 1, 1 / 5);
            fillPixel(0, 0, 1 / 5, 1);
            ctx.fillStyle = data.color;
            fillPixel(1 / 5, 1 / 5, 3 / 5, 1 / 5);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '40px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(data.text, 60, 48);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(255, 0, 255)';
            fillPixel(1 / 5, 2 / 5, 3 / 5, 2 / 5);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText(data.text, 60, 48);
            this.prerenderedFrames.push(toImage());
        },
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        musicPixel: 0,
        group: 3,
        key: Infinity,
        updateStage: 13,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: `music_${id}`,
        numId: 0
    }
};

window.addEventListener('DOMContentLoaded', (e) => {
    function generateDescription(id) {
        return `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}<br>Blast Resistance: ${pixels[id].blastResistance}/20<br>Flammability: ${pixels[id].flammability}/20<br>Pushable: ${pixels[id].pushable}<br>Rotateable: ${pixels[id].rotateable}`;
    };
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    let pixIndex = 0;``
    canvas2.width = 50;
    canvas2.height = 50;
    const groups = [];
    const groupNames = ['General', 'Mechanical', 'Lasers', 'Music', 'Destruction', 'Level Building'];
    for (const id in pixels) {
        const pixel = pixels[id];
        pixel.id = id;
        pixel.numId = pixIndex;
        pixNum[id.toUpperCase()] = pixIndex;
        numPixels[pixIndex++] = pixel;
        pixel.prerender();
        if (pixel.pickable) {
            const box = document.createElement('div');
            box.classList.add('pickerPixel');
            box.onclick = (e) => {
                brush.pixel = id;
                pixelPicker.children.forEach(g => g.children[1].children[0].children.forEach(div => div.classList.remove('pickerPixelSelected')));
                box.classList.add('pickerPixelSelected');
                pixelPickerDescription.innerHTML = generateDescription(id);
            };
            box.onmouseover = (e) => {
                pixelPickerDescription.innerHTML = generateDescription(id);
            };
            box.onmouseout = (e) => {
                pixelPickerDescription.innerHTML = generateDescription(brush.pixel);
            };
            pixel.drawPreview(ctx2);
            const img = new Image(50, 50);
            img.src = canvas2.toDataURL('image/png');
            box.appendChild(img);
            const count = document.createElement('div');
            count.classList.add('pickerCount');
            box.append(count);
            if (groups[pixel.group] === undefined) {
                const group = document.createElement('div');
                group.classList.add('pixelGroup');
                const groupHeader = document.createElement('div');
                groupHeader.classList.add('pixelGroupHeader');
                groupHeader.classList.add('bclick');
                const dropDown = document.createElement('div');
                dropDown.classList.add('pixelGroupHeaderDropdownIcon');
                groupHeader.appendChild(dropDown);
                const label = document.createElement('div');
                label.classList.add('pixelGroupHeaderLabel');
                label.innerText = groupNames[pixel.group];
                groupHeader.appendChild(label);
                group.appendChild(groupHeader);
                const groupBody = document.createElement('div');
                groupBody.classList.add('pixelGroupBody');
                const groupContents = document.createElement('div');
                groupContents.classList.add('pixelGroupContents');
                groupBody.appendChild(groupContents);
                group.appendChild(groupBody);
                let open = false;
                groupHeader.onclick = (e) => {
                    open = !open;
                    if (open) groupBody.style.maxHeight = groupContents.getBoundingClientRect().height + 'px';
                    else groupBody.style.maxHeight = '0px';
                };
                groups[pixel.group] = group;
            }
            groups[pixel.group].children[1].children[0].appendChild(box);
            pixelSelectors[id] = {
                box: box,
                count: count
            };
        }
    }
    for (const group of groups) {
        pixelPicker.appendChild(group);
    }
    pixelSelectors[brush.pixel].box.onclick();
    resetPixelAmounts();
    window.addEventListener('load', (e) => {
        for (const group of groups) {
            group.children[0].onclick();
        }
    });
});