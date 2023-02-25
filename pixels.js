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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: false,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(125, 75, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 1,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
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
            ctx.fillStyle = `rgba(25, 175, 25, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 15,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
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
            ctx.fillStyle = `rgba(100, 60, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            if (noNoise) {
                ctx.fillStyle = `rgba(100, 60, 0, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(90, 50, 0, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(105, 70, 0, ${noiseGrid[y + j][x + i] * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
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
        flammability: 1,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
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
            ctx.fillStyle = `rgba(255, 225, 125, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
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
            ctx.fillStyle = `rgba(175, 125, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(150, 100, 75, ${opacity})`;
            for (let i = 0; i < width; i++) {
                drawPixel(x + i, y, 1 / 2, height, ctx);
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
        flammability: 12,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(100, 220, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 18,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 11,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'leaves',
        numId: 0
    },
    // add stone, replace lava melting concrete with lava melting stone (remember to change description)
    concrete_powder: {
        name: 'Concrete Powder',
        description: 'Like sand, but hardens into concrete when in contact with water',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.CONCRETE;
                return;
            }
            if (y > 0 && grid[y - 1][x] == pixNum.LAVA) {
                if (canMoveTo(x, y - 1) && random() < 0.5) {
                    nextGrid[y][x] = pixNum.LAVA;
                    nextGrid[y - 1][x] = pixNum.CONCRETE;
                }
            }
            fall(x, y, 1, 2, isPassableNonLavaFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(150, 150, 150)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'concrete_powder',
        numId: 0
    },
    concrete: {
        name: 'Concrete',
        description: 'Hard stuff that doesn\'t move easily',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(75, 75, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 11,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'concrete',
        numId: 0
    },
    water: {
        name: 'Water',
        description: 'Unrealistically flows and may or may not be wet',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.fillStyle = `rgba(75, 100, 255, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(100, 175, 255, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(75, 50, 255, ${noise((x + i) / 4, (y + j) / 4, animationTime / 10) * opacity + 0.1})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            fireGrid[y][x] = false;
            updateTouchingPixel(x, y, pixNum.LAVA, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = pixNum.AIR;
                    nextGrid[actionY][actionX] = pixNum.CONCRETE;
                }
            });
            if (y < gridSize - 1) {
                flow(x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 11,
        animatedNoise: true,
        animated: true,
        pickable: true,
        id: 'water',
        numId: 0
    },
    lava: {
        name: 'Lava',
        description: 'Try not to get burned, it also melts stuff and sets things on fire (and hardens into... concrete?)',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.fillStyle = `rgba(255, 100, 0, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(255, 255, 0, ${noise((x + i) / 6, (y + j) / 6, animationTime / 30) * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, pixNum.COLLAPSIBLE, function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = pixNum.AIR;
                    nextGrid[actionY][actionX] = pixNum.SAND;
                }
            });
            updateTouchingPixel(x, y, pixNum.LASER_SCATTERER, function (actionX, actionY) {
                if (nextGrid[y][x] == null && nextGrid[actionY][actionX] == null) {
                    nextGrid[y][x] = pixNum.AIR;
                    nextGrid[actionY][actionX] = pixNum.SAND;
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
                nextGrid[y][x] = pixNum.CONCRETE_POWDER;
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
                        if ((grid[y][x - 1] == pixNum.CONCRETE || grid[y][x - 1] == pixNum.CONCRETE_POWDER) && (grid[y - 1][x - 1] == pixNum.CONCRETE || grid[y - 1][x - 1] == pixNum.CONCRETE_POWDER)) {
                            validSlidingPositions.push(-1);
                        }
                    }
                    if (x < gridSize - 1) {
                        if ((grid[y][x + 1] == pixNum.CONCRETE || grid[y][x + 1] == pixNum.CONCRETE_POWDER) && (grid[y - 1][x + 1] == pixNum.CONCRETE || grid[y - 1][x + 1] == pixNum.CONCRETE_POWDER)) {
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
                        if (grid[y - 1][x] == pixNum.CONCRETE_POWDER || grid[y - 1][x] == pixNum.CONCRETE) {
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 11,
        animatedNoise: true,
        animated: true,
        pickable: true,
        id: 'lava',
        numId: 0
    },
    ash: {
        name: 'Ash',
        description: 'Burnt stuff, doesn\'t burn easily',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.fillStyle = `rgba(100, 110, 120, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(80, 85, 90, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(120, 130, 140, ${noiseGrid[y + j][x + i] * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
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
        flammability: 2,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'ash',
        numId: 0
    },
    wet_ash: {
        name: 'Wet Ash',
        description: 'Almost silt, it\'s nearly fluid',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.fillStyle = `rgba(80, 80, 90, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(70, 70, 80, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(85, 85, 90, ${noiseGrid[y + j][x + i] * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
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
        flammability: 1,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'wet_ash',
        numId: 0
    },
    plant: {
        name: 'P.L.A.N.T.',
        description: '<span style="font-style: italic;">Persistent Loud Aesthetic Nail Tables.</span><br>No, it doesn\'t actually stand for anything. But it does consume concrete alarmingly fast',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(125, 255, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 15,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'plant',
        numId: 0
    },
    sponge: {
        name: 'S.P.O.N.G.E.',
        description: '<span style="font-style: italic;">Sample Providing Oceanic Nucleolic Green Egg</span><br>Don\'t ask',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(225, 255, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            if (!validMovingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.WATER, function (actionX, actionY) {
                nextGrid[y][x] = pixNum.AIR;
                nextGrid[actionY][actionX] = pixNum.SPONGE;
            });
            if (y < gridSize - 1) {
                if ((isPassableNonLavaFluid(x, y + 1) || (grid[y + 1][x] == pixNum.LAVA && random() < 0.25)) && canMoveTo(x, y + 1)) {
                    move(x, y, x, y + 1);
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(225, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 10,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 0,
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
                ctx.fillStyle = `rgba(255, 180, 0, ${opacity / 2})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(255, 100, 0, ${opacity / 3})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(255, 255, 0, ${noiseGrid[y + j][x + i] * opacity / 3})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
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
                    explode(x, y, 3);
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
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 20,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: -1,
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
            if (noNoise) {
                ctx.fillStyle = `rgba(50, 25, 25, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(30, 20, 20, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(55, 40, 40, ${noiseGrid[y + j][x + i] * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
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
        flammability: 20,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: 9,
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
            ctx.fillStyle = `rgba(245, 245, 200, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(245, 245, 200)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 4,
        pushable: true,
        rotateable: false,
        group: 0,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 6, y + j + 1 / 4, 1 / 6, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x + 1] != pixNum.AIR && grid[y][x - 1] == pixNum.AIR && canMoveTo(x - 1, y)) {
                nextGrid[y][x - 1] = grid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updatePriority: 7,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 4, y + j + 1 / 6, 1 / 2, 1 / 6, ctx);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y + 1][x] != pixNum.AIR && grid[y - 1][x] == pixNum.AIR && canMoveTo(x, y - 1)) {
                nextGrid[y - 1][x] = grid[y + 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 50 / 6, 25, 50 / 6);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updatePriority: 5,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 4, 1 / 6, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x - 1] != pixNum.AIR && grid[y][x + 1] == pixNum.AIR && canMoveTo(x + 1, y)) {
                nextGrid[y][x + 1] = grid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updatePriority: 8,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 4, y + j + 2 / 3, 1 / 2, 1 / 6, ctx);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y - 1][x] != pixNum.AIR && grid[y + 1][x] == pixNum.AIR && canMoveTo(x, y + 1)) {
                nextGrid[y + 1][x] = grid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updatePriority: 6,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 6, y + j + 1 / 4, 1 / 6, 1 / 2, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 5, 1 / 3, 1 / 5, ctx);
                }
            }
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x + 1] != pixNum.AIR) {
                let moveX = null;
                let lastCollapsible = null;
                for (let i = x - 1; i >= 0; i--) {
                    if (grid[y][i] == pixNum.AIR || grid[y][i] == pixNum.DELETER) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) {
                            moveX++;
                        }
                        break;
                    }
                    if (grid[y][i] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!numPixels[grid[y][i]].pushable || grid[y][i] == pixNum.SLIDER_VERTICAL) {
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        group: 1,
        rotation: 0,
        key: Infinity,
        updatePriority: 7,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 4, y + j + 1 / 6, 1 / 2, 1 / 6, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 5, y + j + 1 / 3, 1 / 5, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y + 1][x] != pixNum.AIR) {
                let moveY = null;
                let lastCollapsible = null;
                for (let i = y - 1; i >= 0; i--) {
                    if (grid[i][x] == pixNum.AIR || grid[i][x] == pixNum.DELETER) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) {
                            moveY++;
                        }
                        break;
                    }
                    if (grid[i][x] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!numPixels[grid[i][x]].pushable || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 50 / 6, 25, 50 / 6);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        group: 1,
        rotation: 1,
        key: Infinity,
        updatePriority: 5,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 2 / 3, y + j + 1 / 4, 1 / 6, 1 / 2, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 5, 1 / 3, 1 / 5, ctx);
                }
            }
        },
        update: function (x, y) {
            if (x > 0 && x < gridSize - 1 && grid[y][x - 1] != pixNum.AIR) {
                let moveX = null;
                let lastCollapsible = null;
                for (let i = x + 1; i <= gridSize - 1; i++) {
                    if (grid[y][i] == pixNum.AIR || grid[y][i] == pixNum.DELETER) {
                        moveX = i;
                        if (grid[y][i] == pixNum.DELETER) {
                            moveX--;
                        }
                        break;
                    }
                    if (grid[y][i] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!numPixels[grid[y][i]].pushable || grid[y][i] == pixNum.SLIDER_VERTICAL) {
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        group: 1,
        rotation: 2,
        key: Infinity,
        updatePriority: 8,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                    drawPixel(x + i + 1 / 4, y + j + 2 / 3, 1 / 2, 1 / 6, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 5, y + j + 1 / 3, 1 / 5, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            if (y > 0 && y < gridSize - 1 && grid[y - 1][x] != pixNum.AIR) {
                let moveY = null;
                let lastCollapsible = null;
                for (let i = y + 1; i <= gridSize - 1; i++) {
                    if (grid[i][x] == pixNum.AIR || grid[i][x] == pixNum.DELETER) {
                        moveY = i;
                        if (grid[i][x] == pixNum.DELETER) {
                            moveY--;
                        }
                        break;
                    }
                    if (grid[i][x] == pixNum.COLLAPSIBLE) {
                        lastCollapsible = i;
                    }
                    if (!numPixels[grid[i][x]].pushable || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        group: 1,
        rotation: 3,
        key: Infinity,
        updatePriority: 6,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updatePriority: 7,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                }
            }
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updatePriority: 5,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updatePriority: 8,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 2 / 3, 1 / 3, 1 / 3, ctx);
                }
            }
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        flammability: 8,
        pushable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updatePriority: 6,
        animatedNoise: false,
        animated: false,
        pickable: false,
        id: 'super_cloner_down',
        numId: 0
    },
    piston_left: {
        name: 'Piston (Left)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
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
                if (grid[y][i] == pixNum.AIR || grid[y][i] == pixNum.DELETER) {
                    moveX = i;
                    if (grid[y][i] == pixNum.DELETER) {
                        moveX++;
                    }
                    break;
                }
                if (grid[y][i] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!numPixels[grid[y][i]].pushable || grid[y][i] == pixNum.SLIDER_VERTICAL) {
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
        flammability: 6,
        pushable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updatePriority: 3,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_left',
        numId: 0
    },
    piston_up: {
        name: 'Piston (Up)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, ctx);
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
                if (grid[i][x] == pixNum.AIR || grid[i][x] == pixNum.DELETER) {
                    moveY = i;
                    if (grid[i][x] == pixNum.DELETER) {
                        moveY++;
                    }
                    break;
                }
                if (grid[i][x] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!numPixels[grid[i][x]].pushable || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
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
        flammability: 6,
        pushable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updatePriority: 1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_up',
        numId: 0
    },
    piston_right: {
        name: 'Piston (Right)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
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
                if (grid[y][i] == pixNum.AIR || grid[y][i] == pixNum.DELETER) {
                    moveX = i;
                    if (grid[y][i] == pixNum.DELETER) {
                        moveX--;
                    }
                    break;
                }
                if (grid[y][i] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!numPixels[grid[y][i]].pushable || grid[y][i] == pixNum.SLIDER_VERTICAL) {
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
        flammability: 6,
        pushable: true,
        rotateable: true,
        rotation: 2,
        group: 1,
        key: Infinity,
        updatePriority: 4,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_right',
        numId: 0
    },
    piston_down: {
        name: 'Piston (Down)',
        description: 'Closer to a flying machine, it pushes stuff',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(0, 125, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, ctx);
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
                if (grid[i][x] == pixNum.AIR || grid[i][x] == pixNum.DELETER) {
                    moveY = i;
                    if (grid[i][x] == pixNum.DELETER) {
                        moveY--;
                    }
                    break;
                }
                if (grid[i][x] == pixNum.COLLAPSIBLE) {
                    lastCollapsible = i;
                }
                if (!numPixels[grid[i][x]].pushable || grid[i][x] == pixNum.SLIDER_HORIZONTAL) {
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
        flammability: 6,
        pushable: true,
        rotateable: true,
        rotation: 3,
        group: 1,
        key: Infinity,
        updatePriority: 2,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'piston_down',
        numId: 0
    },
    rotator_left: {
        name: 'Rotator (Left)',
        description: 'Rotates directional pixels to face left',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
        flammability: 4,
        pushable: true,
        rotateable: false,
        rotation: 0,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
        flammability: 4,
        pushable: true,
        rotateable: false,
        rotation: 1,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 2, y + j + 1 / 3, 1 / 2, 1 / 3, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
        flammability: 4,
        pushable: true,
        rotateable: false,
        rotation: 2,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 3, y + j + 1 / 2, 1 / 3, 1 / 2, ctx);
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
        flammability: 4,
        pushable: true,
        rotateable: false,
        rotation: 3,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    switch (Math.floor(animationTime / 10) % 4) {
                        case 0:
                            drawPixel(x + i, y + j, 2 / 3, 1 / 3, ctx);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 2 / 3, 1 / 3, ctx);
                            break;
                        case 1:
                            drawPixel(x + i + 1 / 3, y + j, 2 / 3, 1 / 3, ctx);
                            drawPixel(x + i, y + j + 2 / 3, 2 / 3, 1 / 3, ctx);
                            break;
                        case 2:
                            drawPixel(x + i + 2 / 3, y + j, 1 / 3, 2 / 3, ctx);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 2 / 3, ctx);
                            break;
                        case 3:
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 2 / 3, ctx);
                            drawPixel(x + i, y + j, 1 / 3, 2 / 3, ctx);
                            break;
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
            ctx.fillStyle = 'rgba(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.66)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.2)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        flammability: 4,
        pushable: true,
        rotateable: false,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 255, 255, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    switch (Math.floor(animationTime / 10) % 4) {
                        case 3:
                            drawPixel(x + i + 2 / 3, y + j, 1 / 3, 2 / 3, ctx);
                            drawPixel(x + i, y + j + 1 / 3, 1 / 3, 2 / 3, ctx);
                            break;
                        case 2:
                            drawPixel(x + i + 2 / 3, y + j + 1 / 3, 1 / 3, 2 / 3, ctx);
                            drawPixel(x + i, y + j, 1 / 3, 2 / 3, ctx);
                            break;
                        case 1:
                            drawPixel(x + i, y + j, 2 / 3, 1 / 3, ctx);
                            drawPixel(x + i + 1 / 3, y + j + 2 / 3, 2 / 3, 1 / 3, ctx);
                            break;
                        case 0:
                            drawPixel(x + i + 1 / 3, y + j, 2 / 3, 1 / 3, ctx);
                            drawPixel(x + i, y + j + 2 / 3, 2 / 3, 1 / 3, ctx);
                            break;
                    }
                }
            }
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, function (actionX, actionY) {
                let pixel = grid[actionY][actionX]
                if (pixel == pixNum.SLIDER_HORIZONTAL || pixel == pixNum.SLIDER_VERTICAL) {
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
            ctx.fillStyle = 'rgba(75, 255, 255, 1)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.66)';
            ctx.fillRect(0, 0, 50 / 3, 50 / 3);
            ctx.fillRect(100 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.33)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgba(75, 255, 255, 0.2)';
            ctx.fillRect(100 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillRect(0, 100 / 3, 50 / 3, 50 / 3);
        },
        flammability: 4,
        pushable: true,
        rotateable: false,
        group: 1,
        key: Infinity,
        updatePriority: 13,
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
            ctx.fillStyle = `rgba(255, 180, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(200, 100, 0, ${opacity})`;
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 4, width, 1 / 2, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: true,
        rotation: 0,
        group: 1,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(250, 180, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(200, 100, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 4, y, 1 / 2, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: true,
        rotation: 1,
        group: 1,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'slider_vertical',
        numId: 0
    },
    pump: {
        name: 'Water Pump',
        description: 'Violates the Laws of Thermodynamics to create water',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(25, 125, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(75, 100, 255, ${opacity})`;
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, ctx);
            ctx.fillStyle = `rgba(25, 125, 75, ${opacity})`;
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updatePriority: 10,
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
            ctx.fillStyle = `rgba(25, 125, 75, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(255, 125, 0, ${opacity})`;
            drawPixel(x + 1 / 3, y + 1 / 3, width - 2 / 3, height - 2 / 3, ctx);
            ctx.fillStyle = `rgba(25, 125, 75, ${opacity})`;
            for (let i = 0; i < width - 1; i++) {
                drawPixel(x + i + 5 / 6, y + 1 / 3, 1 / 3, height - 2 / 3, ctx);
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
            updateTouchingPixel(x, y, pixNum.CONCRETE, function (actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.075) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
            });
            updateTouchingPixel(x, y, pixNum.CONCRETE_POWDER, function (actionX, actionY) {
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updatePriority: 10,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'lava_generator',
        numId: 0
    },
    collapsible: {
        name: 'Collapsible Box',
        description: 'A box that will disintegrate when squished',
        draw: function (x, y, width, height, opacity, ctx) {
            if (noNoise) {
                ctx.fillStyle = `rgba(255, 120, 210, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
            } else {
                ctx.fillStyle = `rgba(255, 100, 200, ${opacity})`;
                drawPixel(x, y, width, height, ctx);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = `rgba(255, 140, 255, ${noiseGrid[y + j][x + i] * opacity})`;
                        drawPixel(x + i, y + j, 1, 1, ctx);
                    }
                }
            }
        },
        update: function (x, y) {
            if (validMovingPixel(x, y) && y < gridSize - 1 && grid[y + 1][x] == pixNum.AIR && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 120, 210)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 15,
        pushable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updatePriority: 9,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'collapsible',
        numId: 0
    },
    nuke_diffuser: {
        name: 'Nuke Diffuser',
        description: 'Doesn\'t cause diffusion, but will defuse nukes touching it',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(175, 50, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(225, 125, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                drawPixel(x + i + 1 / 3, y, 1 / 3, height, ctx);
            }
            for (let i = 0; i < height; i++) {
                drawPixel(x, y + i + 1 / 3, width, 1 / 3, ctx);
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
        flammability: 2,
        pushable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'nuke_diffuser',
        numId: 0
    },
    laser_scatterer: {
        name: 'Laser Scatterer',
        description: 'Scatters lasers that pass through it and makes them useless',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(220, 220, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            ctx.fillStyle = `rgba(210, 210, 220, ${opacity})`;
            for (let i = 0; i < width; i++) {
                drawPixel(x + i, y, 1 / 4, height, ctx);
                drawPixel(x + i + 1 / 2, y, 1 / 4, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 2,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: false,
        pickable: true,
        id: 'laser_scatterer',
        numId: 0
    },
    laser_left: {
        name: "L.A.S.E.R. (Left)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Leftwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(90, 0, 120, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i, y + 1 / 3 + j, 1 / 2, 1 / 3, ctx);
                }
            }
            abovectx.fillStyle = `rgba(71, 216, 159, ${opacity})`;
            for (let i = 0; i < height; i++) {
                let endX = x;
                while (endX >= 0) {
                    endX--;
                    if (grid[y + i][endX] != pixNum.AIR) break;
                }
                drawPixel(endX + 1, y + 1 / 3 + i, x - endX - 1, 1 / 3, abovectx);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeX = x;
                while (removeX > 0) {
                    removeX--;
                    if (grid[y][removeX] != pixNum.AIR) {
                        if (grid[y][removeX] != pixNum.LASER_SCATTERER) nextGrid[y][removeX] = pixNum.AIR;
                        if (grid[y][removeX] < pixNum.LASER_LEFT || grid[y][removeX] > pixNum.LASER_DOWN) nextFireGrid[y][removeX] = true;
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        flammability: 20,
        pushable: true,
        rotateable: true,
        rotation: 0,
        group: 2,
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_left',
        numId: 0
    },
    laser_up: {
        name: "L.A.S.E.R. (Up)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Upwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(90, 0, 120, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + j, 1 / 3, 1 / 2, ctx);
                }
            }
            abovectx.fillStyle = `rgba(71, 216, 159, ${opacity})`;
            for (let i = 0; i < width; i++) {
                let endY = y;
                while (endY >= 0) {
                    endY--;
                    if (endY >= 0 && grid[endY][x + i] != pixNum.AIR) break;
                }
                drawPixel(x + 1 / 3 + i, endY + 1, 1 / 3, y - endY - 1, abovectx);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeY = y;
                while (removeY > 0) {
                    removeY--;
                    if (grid[removeY][x] != pixNum.AIR) {
                        if (grid[removeY][x] != pixNum.LASER_SCATTERER) nextGrid[removeY][x] = pixNum.AIR;
                        if (grid[removeY][x] < pixNum.LASER_LEFT || grid[removeY][x] > pixNum.LASER_DOWN) nextFireGrid[removeY][x] = true;
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        flammability: 20,
        pushable: true,
        rotateable: true,
        rotation: 1,
        group: 2,
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_up',
        numId: 0
    },
    laser_right: {
        name: "L.A.S.E.R. (Right)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Rightwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(90, 0, 120, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 2 + i, y + 1 / 3 + j, 1 / 2, 1 / 3, ctx);
                }
            }
            abovectx.fillStyle = `rgba(71, 216, 159, ${opacity})`;
            for (let i = 0; i < height; i++) {
                let endX = x + width - 1;
                while (endX < gridSize) {
                    endX++;
                    if (grid[y + i][endX] != pixNum.AIR) break;
                }
                drawPixel(x + width, y + 1 / 3 + i, endX - x - width, 1 / 3, abovectx);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeX = x;
                while (removeX < gridSize - 1) {
                    removeX++;
                    if (grid[y][removeX] != pixNum.AIR) {
                        if (grid[y][removeX] != pixNum.LASER_SCATTERER) nextGrid[y][removeX] = pixNum.AIR;
                        if (grid[y][removeX] < pixNum.LASER_LEFT || grid[y][removeX] > pixNum.LASER_DOWN) nextFireGrid[y][removeX] = true;
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        flammability: 20,
        pushable: true,
        rotateable: true,
        rotation: 2,
        group: 2,
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_right',
        numId: 0
    },
    laser_down: {
        name: "L.A.S.E.R. (Down)",
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Downwards)</span><br>Destroys pixels in a line using hypersonic super boat entities',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(90, 0, 120, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 3 + i, y + 1 / 2 + j, 1 / 3, 1 / 2, ctx);
                }
            }
            abovectx.fillStyle = `rgba(71, 216, 159, ${opacity})`;
            for (let i = 0; i < width; i++) {
                let endY = y + height - 1;
                while (endY < gridSize) {
                    endY++;
                    if (endY < gridSize && grid[endY][x + i] != pixNum.AIR) break;
                }
                drawPixel(x + 1 / 3 + i, y + height, 1 / 3, endY - y - height, abovectx);
            }
        },
        update: function (x, y) {
            if (random() < 0.2) {
                let removeY = y;
                while (removeY < gridSize - 1) {
                    removeY++;
                    if (grid[removeY][x] != pixNum.AIR) {
                        if (grid[removeY][x] != pixNum.LASER_SCATTERER) nextGrid[removeY][x] = pixNum.AIR;
                        if (grid[removeY][x] < pixNum.LASER_LEFT || grid[removeY][x] > pixNum.LASER_DOWN) nextFireGrid[removeY][x] = true;
                        break;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 0, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(60, 112, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        flammability: 20,
        pushable: true,
        rotateable: true,
        rotation: 3,
        group: 2,
        key: Infinity,
        updatePriority: 0,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'laser_down',
        numId: 0
    },
    nuke: {
        name: 'Nuke',
        description: 'TBH, kinda weak',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(0, 255, 125, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: 0,
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
            ctx.fillStyle = `rgba(100, 60, 255, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: 0,
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
            ctx.fillStyle = `rgba(255, 0, 70, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: 0,
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
            ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(200, 0, 255, 255, 0, 255, 96);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + 1 / 4 + i, y + 1 / 4 + j, 1 / 2, 1 / 2, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: -1,
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
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    drawPixel(x + i, y + j, 1, 1, ctx);
                    ctx.fillStyle = `rgba(125, 255, 0, ${(random() * 0.6 + 0.4) * opacity})`;
                    drawPixel(x + i, y + j, 1, 1, ctx);
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: 12,
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
                        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
                        drawPixel(0, 0, borkXScale, borkYScale, ctx);
                        ctx.fillStyle = `rgba(100, 255, 0, ${(random() * 0.6 + 0.4) * opacity})`;
                        drawPixel(0, 0, borkXScale, borkYScale, ctx);
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
                        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                        ctx.fillRect(0, 0, 90, 90);
                        ctx.fillStyle = `rgba(255, 255, 0, ${opacity})`;
                        ctx.fillRect(10, 10, 70, 70);
                        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                        ctx.fillRect(40, 20, 10, 30);
                        ctx.fillRect(40, 60, 10, 10);
                        ctx.restore();
                        ctx.rotate(-rotationAmount);
                        ctx.translate(-(x + i + 1 / 2) * gridScale - translateX, -(y + j + 1 / 2) * gridScale - translateY);
                    }
                }
            }
        },
        update: function (x, y) {
            function chaos(actionX, actionY) {
                if (nextGrid[actionY][actionX] == null && random() < 0.4) {
                    nextGrid[actionY][actionX] = pixNum.CORRUPTION;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.LAVA;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.WATER;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.4) {
                    nextGrid[actionY][actionX] = pixNum.MISSING;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.5) {
                    nextGrid[actionY][actionX] = pixNum.AIR;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.PUMP;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.1) {
                    nextGrid[actionY][actionX] = pixNum.LAVA_GENERATOR;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.CLONER_DOWN;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.CLONER_LEFT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.CLONER_RIGHT;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.2) {
                    nextGrid[actionY][actionX] = pixNum.CLONER_UP;
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
                    nextGrid[actionY][actionX] = pixNum.PISTON_down;
                }
                if (nextGrid[actionY][actionX] == null && random() < 0.03) {
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
        flammability: NaN,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: 12,
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        pickable: false,
        id: 'spin',
        numId: 0
    },
    placementUnRestriction: {
        name: 'Allow Placement',
        description: 'Remove placement restrictions in sandbox levels',
        draw: function (x, y, width, height, opacity, ctx) { },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'placementUnRestriction',
        numId: 0
    },
    placementRestriction: {
        name: 'Prevent Placement',
        description: 'Prevents players from placing pixels in sandbox levels',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.2})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) {
            grid[y][x] = pixNum.AIR;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: 4,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'placementRestriction',
        numId: 0
    },
    monster: {
        name: 'Monster',
        description: 'The bad pixels in challenge puzzles',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(0, 140, 30, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            let color = colorAnimate(0, 160, 70, 0, 180, 80, 64);
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 6, y + j + 1 / 6, 2 / 3, 2 / 3, ctx);
                }
            }
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    drawPixel(x + i + 1 / 6, y + 1 / 5 + j, 1 / 5, 1 / 5, ctx);
                    drawPixel(x + 19 / 30 + i, y + 1 / 5 + j, 1 / 5, 1 / 5, ctx);
                    drawPixel(x + 1 / 4 + i, y + 3 / 5 + j, 1 / 2, 1 / 6, ctx);
                }
            }
        },
        update: function (x, y) {
            if (grid[y][x] != pixNum.AIR) {
                grid[y][x] = pixNum.AIR;
                monsterGrid[y][x] = false;
                fireGrid[y1][x1] = false;
            } else if (y < gridSize - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1) && !monsterGrid[y + 1][x]) {
                if (deleterGrid[y + 1][x]) {
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
            ctx.fillStyle = 'rgb(0, 140, 30)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 160, 70)';
            ctx.fillRect(50 / 6, 50 / 6, 100 / 3, 100 / 3);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(50 / 6, 10, 10, 10);
            ctx.fillRect(950 / 30, 10, 10, 10);
            ctx.fillRect(50 / 4, 30, 25, 50 / 6);
        },
        flammability: 8,
        pushable: true,
        rotateable: false,
        group: 3,
        key: Infinity,
        updatePriority: -1,
        animatedNoise: false,
        animated: true,
        pickable: true,
        id: 'monster',
        numId: 0
    },
    remove: {
        name: "Remove (brush only)",
        description: 'Unfortunately it\'s not THE red pixel',
        draw: function (x, y, width, height, opacity, ctx) {
            ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: -1,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            drawPixel(x, y, width, height, ctx);
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    ctx.fillStyle = `rgba(255, 0, 255, ${opacity})`;
                    drawPixel(x + i, y + j, 1 / 2, 1 / 2, ctx);
                    drawPixel(x + 1 / 2 + i, y + 1 / 2 + j, 1 / 2, 1 / 2, ctx);
                }
            }
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
        flammability: 0,
        pushable: true,
        rotateable: false,
        group: -1,
        key: Infinity,
        updatePriority: -1,
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
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(0, 0, canvasResolution, canvasResolution);
        },
        update: function (x, y) {
            gridPaused = true;
            modal('Red Pixel Simulator', '86 7A 91 7A 8A 26 7C 87 86 86 76 26 7C 81 91 7A 26 94 87 90 26 90 88', false).then(() => window.location.reload());
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        flammability: undefined,
        pushable: true,
        rotateable: false,
        group: -1,
        key: Infinity,
        updatePriority: 0,
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
    if (pixelSelectors[id]) {
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

function generateDescription(id) {
    return `<span style="font-size: 16px; font-weight: bold;">${pixels[id].name}</span><br>${pixels[id].description}<br>Flammability: ${pixels[id].flammability}/20<br>Pushable: ${pixels[id].pushable}<br>Rotateable: ${pixels[id].rotateable}`;
};
const canvas2 = document.createElement('canvas');
const ctx2 = canvas2.getContext('2d');
let pixIndex = 0;
canvas2.width = 50;
canvas2.height = 50;
const groups = [];
for (const id in pixels) {
    if (pixels[id].pickable) {
        const box = document.createElement('div');
        box.classList.add('pickerPixel');
        box.onclick = (e) => {
            clickPixel = id;
            pixelPicker.children.forEach(section => section.children.forEach(div => div.classList.remove('pickerPixelSelected')));
            box.classList.add('pickerPixelSelected');
            pixelPickerDescription.innerHTML = generateDescription(id);
        };
        box.onmouseover = (e) => {
            pixelPickerDescription.innerHTML = generateDescription(id);
        };
        box.onmouseout = (e) => {
            pixelPickerDescription.innerHTML = generateDescription(clickPixel);
        };
        const img = new Image(50, 50);
        pixels[id].drawPreview(ctx2);
        img.src = canvas2.toDataURL('image/png');
        box.appendChild(img);
        const count = document.createElement('div');
        count.classList.add('pickerCount');
        box.append(count);
        if (groups[pixels[id].group] == undefined) {
            groups[pixels[id].group] = document.createElement('div');
        }
        groups[pixels[id].group].appendChild(box);
        pixelSelectors[id] = {
            box: box,
            count: count
        };
    }
    pixels[id].id = id;
    pixels[id].numId = pixIndex;
    pixNum[id.toUpperCase()] = pixIndex;
    numPixels[pixIndex++] = pixels[id];
}
for (let group of groups) {
    pixelPicker.appendChild(group);
}
pixelSelectors[clickPixel].box.click();
resetPixelAmounts();