const pixels = {
    air: {
        name: 'Air',
        description: 'It\'s air... What else would it be?',
        draw: function (rectangles, ctx, avoidGrid) { },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'air',
        numId: 0
    },
    wall: {
        name: 'Wall',
        description: 'An immovable wall (good luck finding an unstoppable force-OH NO)',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'wall',
        numId: 0
    },
    dirt: {
        name: 'Dirt',
        description: 'Wash your hands after handling it, it\'s pretty dirty',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(125, 75, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.MUD;
                return;
            }
            if (y < gridHeight - 1 && (grid[y + 1][x] == pixNum.DIRT || grid[y + 1][x] == pixNum.GRASS || isPassableFluid(x, y + 1))) {
                fall(x, y, 1, 2);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 75, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_brown: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 1,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'dirt',
        numId: 0
    },
    grass: {
        name: 'Grass',
        description: 'Go touch some',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(25, 175, 25)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let dead = random() < 0.1;
            if (dead) updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (ay <= y) dead = false;
            });
            if (!dead) dead = updateTouchingPixel(x, y, pixNum.LAVA);
            if (dead) {
                nextGrid[y][x] = pixNum.DIRT;
                return;
            }
            for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, gridHeight - 1); i++) {
                for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, gridWidth - 1); j++) {
                    if (grid[i][j] == pixNum.DIRT && validChangingPixel(j, i) && (i != y || j != x) && random() < 0.2) {
                        let canGrow = false;
                        updateTouchingPixel(j, i, pixNum.AIR, function (actionX2, actionY2) {
                            if (actionY2 <= i) canGrow = true;
                        });
                        if (canGrow) nextGrid[i][j] = pixNum.GRASS;
                    }
                }
            }
            if (y < gridHeight - 1 && (grid[y + 1][x] == pixNum.DIRT || grid[y + 1][x] == pixNum.GRASS || isPassableFluid(x, y + 1))) {
                fall(x, y, 1, 2);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 175, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            dirt: 1,
            color_green: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'grass',
        numId: 0
    },
    mud: {
        name: 'Mud',
        description: 'Basically wet dirt',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(100, 60, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(90, 50, 0)';
                gridnoisectx.fillStyle = 'rgb(105, 70, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (!updateTouchingPixel(x, y, pixNum.WATER)) {
                let touchingWetStuff = 1;
                updateTouchingPixel(x, y, [pixNum.SILT, pixNum.MUD], (ax, ay) => {
                    touchingWetStuff *= 2;
                });
                if (random() < 0.01 / touchingWetStuff) {
                    nextGrid[y][x] = pixNum.DIRT;
                    return;
                }
            }
            fall(x, y, 3, 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 60, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 4,
        flammability: 1,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'mud',
        numId: 0
    },
    sand: {
        name: 'Sand',
        description: 'Weird yellow powdery stuff that falls',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 225, 125)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            fall(x, y, 1, 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 225, 125)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_yellow: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'sand',
        numId: 0
    },
    gravel: {
        name: 'Gravel',
        description: 'Weird grey rocky stuff that falls',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(100, 100, 80)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(90, 90, 75)';
                gridnoisectx.fillStyle = 'rgb(120, 120, 100)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            fall(x, y, 1, 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 80)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_grey: 1,
            color_black: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 6,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'gravel',
        numId: 0
    },
    clay: {
        name: 'Clay',
        description: 'Slightly impure clay that has a red tint',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(160, 80, 50)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER) && random() < 0.2) {
                nextGrid[y][x] = pixNum.SILT;
                return;
            }
            fall(x, y, 1, 2);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(160, 80, 50)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            dirt: 1,
            color_red: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 7,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'clay',
        numId: 0
    },
    silt: {
        name: 'Silt',
        description: 'Clay-rich saturated sediment',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(190, 130, 100)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(160, 100, 90)';
                gridnoisectx.fillStyle = 'rgb(240, 160, 110)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (!updateTouchingPixel(x, y, pixNum.WATER)) {
                let touchingWetStuff = 1;
                updateTouchingPixel(x, y, [pixNum.SILT, pixNum.MUD], (ax, ay) => {
                    touchingWetStuff *= 2;
                });
                if (random() < 0.002 / touchingWetStuff) {
                    nextGrid[y][x] = pixNum.CLAY;
                    return;
                }
            }
            updateTouchingPixel(x, y, pixNum.CLAY, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.0001) nextGrid[ay][ax] = pixNum.SILT;
            });
            flow(x, y, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(190, 130, 100)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 7,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'silt',
        numId: 0
    },
    wood: {
        name: 'Wood',
        description: 'Just some logs',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(175, 125, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(150, 100, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i, y, 1 / 2, height, ctx);
                }
            });
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
        recipe: {
            color_brown: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 12,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'wood',
        numId: 0
    },
    leaves: {
        name: 'Leaves',
        description: 'Lush green leaves... or was it leafs?',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 220, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WOOD)) return;
            let touchingLeaves = 0;
            let xmin = Math.max(0, Math.min(x - 1, gridWidth - 1));
            let xmax = Math.max(0, Math.min(x + 1, gridWidth - 1));
            let ymin = Math.max(0, Math.min(y - 1, gridHeight - 1));
            let ymax = Math.max(0, Math.min(y + 1, gridHeight - 1));
            for (let i = xmin; i <= xmax; i++) {
                for (let j = ymin; j <= ymax; j++) {
                    if (grid[j][i] == pixNum.LEAVES) touchingLeaves++;
                }
            }
            if (touchingLeaves < 4) {
                if (random() < 0.01) {
                    nextGrid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(115, 220, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_lime: 4
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 18,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'leaves',
        numId: 0
    },
    moss: {
        name: 'Moss',
        description: 'Very mossy moss that grows on mossy stone',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(50, 150, 25)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(0, 125, 0)';
                gridnoisectx.fillStyle = 'rgb(75, 200, 50)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (!updateTouchingPixel(x, y, pixNum.STONE)) {
                fall(x, y, 1, 1);
            }
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, gridHeight - 1); j++) {
                for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, gridWidth - 1); i++) {
                    if (grid[j][i] == pixNum.STONE && canMoveTo(i, j) && random() < 0.1 && updateTouchingPixel(i, j, pixNum.AIR)) {
                        nextGrid[j][i] = pixNum.MOSS;
                    }
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(50, 150, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_green: 5
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'moss',
        numId: 0
    },
    stone: {
        name: 'Stone',
        description: 'Very stony and hard',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(110, 110, 110)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (y > 0 && grid[y - 1][x] == pixNum.LAVA && canMoveTo(x, y - 1) && random() < 0.25) {
                move(x, y - 1, x, y);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(110, 110, 110)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_grey: 4
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'stone',
        numId: 0
    },
    basalt: {
        name: 'Basalt',
        description: 'Stonier and harder',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(90, 90, 110)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(90, 90, 110)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_grey: 3,
            color_black: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 16,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'basalt',
        numId: 0
    },
    water: {
        name: 'Water',
        description: 'Unrealistically flows and may or may not be wet',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(75, 100, 255)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(100, 175, 255)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
                ctx.fillStyle = 'rgb(75, 50, 255)';
                if (noAnimations) {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        if (redrawing || forceRedraw) {
                            forEachPixel(x, y, width, height, (x2, y2) => {
                                ctx.globalAlpha = constantNoise(x2 / 4, y2 / 4) + 0.1;
                                fillPixels(x2, y2, 1, 1, ctx);
                            });
                        }
                    });
                } else {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        forEachPixel(x, y, width, height, (x2, y2) => {
                            ctx.globalAlpha = noise(x2 / 4, y2 / 4, deltaTime / 10) + 0.1;
                            fillPixels(x2, y2, 1, 1, ctx);
                        });
                    });
                }
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            fireGrid[y][x] = false;
            nextFireGrid[y][x] = false;
            if (updateTouchingPixel(x, y, pixNum.LAVA, (ax, ay) => {
                if (validChangingPixel(ax, ay)) {
                    if (random() < 0.8) nextGrid[y][x] = pixNum.STEAM;
                    else nextGrid[y][x] = pixNum.AIR;
                    nextGrid[ay][ax] = pixNum.STONE;
                    teamGrid[y][x] = 0;
                    return true;
                }
                return false;
            })) return;
            flow(x, y);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_blue: 1,
            color_cyan: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 15,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: true,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'water',
        numId: 0
    },
    ice: {
        name: 'Ice',
        description: 'Cold water',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(180, 200, 255)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(180, 180, 240)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
                ctx.fillStyle = 'rgb(190, 200, 255)';
                if (noAnimations) {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        forEachPixel(x, y, width, height, (x2, y2) => {
                            ctx.globalAlpha = constantNoise(x2 / 2, y2 / 2);
                            fillPixels(x2, y2, 1, 1, ctx);
                        });
                    });
                } else {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        forEachPixel(x, y, width, height, (x2, y2) => {
                            ctx.globalAlpha = constantNoise(x2 / 2, y2 / 2, deltaTime / 300);
                            fillPixels(x2, y2, 1, 1, ctx);
                        });
                    });
                }
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let touchingIce = 10;
            updateTouchingPixel(x, y, pixNum.ICE, (ax, ay) => {
                touchingIce *= 2;
            });
            if (random() < 0.001 / touchingIce) nextGrid[y][x] = pixNum.WATER;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 220, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: true,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'ice',
        numId: 0
    },
    snow: {
        name: 'Snow',
        description: 'Fluffy cold water',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(230, 240, 240)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(230, 230, 230)';
                gridnoisectx.fillStyle = 'rgb(230, 250, 250)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER) && random() < 0.001) {
                nextGrid[y][x] = pixNum.WATER;
                return;
            };
            fall(x, y, 1, 1, isAir);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(230, 240, 240)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            ice: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'snow',
        numId: 0
    },
    steam: {
        name: 'Steam',
        description: 'Very hot water that will give you second-degree burns if you\'re not careful',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(210, 210, 210)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(225, 225, 225)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
                ctx.fillStyle = 'rgb(200, 200, 200)';
                if (noAnimations) {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        if (redrawing || forceRedraw) {
                            forEachPixel(x, y, width, height, (x2, y2) => {
                                ctx.globalAlpha = constantNoise(x2 / 2, y2 / 2);
                                fillPixels(x2, y2, 1, 1, ctx);
                            });
                        }
                    });
                } else {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        forEachPixel(x, y, width, height, (x2, y2) => {
                            ctx.globalAlpha = noise(x2 / 2, y2 / 2, deltaTime / 5);
                            fillPixels(x2, y2, 1, 1, ctx);
                        });
                    });
                }
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (random() < 0.005) {
                if (random() < 0.5) nextGrid[y][x] = pixNum.WATER;
                else {
                    nextGrid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                }
                return;
            }
            if (updateTouchingAnything(x, y, (ax, ay) => {
                if (grid[ay][ax] != pixNum.WATER && random() < pixelAt(ax, ay).flammability / 20) {
                    nextFireGrid[ay][ax] = true;
                    if (random() < 0.6) {
                        nextGrid[y][x] = pixNum.WATER;
                        return true;
                    }
                } else if ((grid[ay][ax] == pixNum.ICE || grid[ay][ax] == pixNum.SNOW) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.WATER;
                    nextGrid[y][x] = pixNum.WATER;
                    teamGrid[y][x] = 0;
                    return true;
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
                    if (right >= gridWidth) {
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: true,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'steam',
        numId: 0
    },
    lava: {
        name: 'Lava',
        description: 'Melts stuff and sets things on fire (and flows unrealistically)',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(255, 100, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(255, 0, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
                ctx.fillStyle = 'rgb(255, 255, 0)';
                if (noAnimations) {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        if (redrawing || forceRedraw) {
                            forEachPixel(x, y, width, height, (x2, y2) => {
                                ctx.globalAlpha = constantNoise(x2 / 6, y2 / 6);
                                fillPixels(x2, y2, 1, 1, ctx);
                            });
                        }
                    });
                } else {
                    forRectangles(rectangles, (x, y, width, height, redrawing) => {
                        forEachPixel(x, y, width, height, (x2, y2) => {
                            ctx.globalAlpha = noise(x2 / 6, y2 / 6, deltaTime / 30);
                            fillPixels(x2, y2, 1, 1, ctx);
                        });
                    });
                }
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let cooldownSpeed = 2;
            let act = (ax, ay) => {
                if (grid[ay][ax] == pixNum.LAVA) {
                    cooldownSpeed--;
                } else if (grid[ay][ax] == pixNum.AIR) {
                    cooldownSpeed++;
                } else if (validChangingPixel(ax, ay)) {
                    if (grid[ay][ax] == pixNum.LASER_SCATTERER) {
                        if (random() < 0.1) nextGrid[ay][ax] = pixNum.SAND;
                    } else if (grid[ay][ax] == pixNum.SAND) {
                        if (random() < 0.01) nextGrid[ay][ax] = pixNum.GLASS;
                    } else if (grid[ay][ax] == pixNum.IRON) {
                        if (random() < 0.1) nextGrid[ay][ax] = pixNum.STEEL;
                    } else if (grid[ay][ax] == pixNum.GLASS) {
                        if (random() < 0.01) nextGrid[ay][ax] = pixNum.SAND;
                    }
                }
            };
            updateTouchingAnything(x, y, act);
            for (let i = 0; i < 3; i++) {
                let meltAngle = random(0, Math.PI * 2);
                let travel = 0;
                rayTrace(x, y, Math.round(x + Math.cos(meltAngle) * 10), Math.round(y + Math.sin(meltAngle) * 10), (ax, ay) => {
                    if (!validChangingPixel(ax, ay)) return;
                    if (grid[ay][ax] == pixNum.SNOW || grid[ay][ax] == pixNum.ICE) {
                        if (random() < (15 - travel) / 20) nextGrid[ay][ax] = pixNum.WATER;
                    } else if (grid[ay][ax] == pixNum.SILT) {
                        if (random() < (10 - travel) / 10) nextGrid[ay][ax] = pixNum.CLAY;
                    } else if (grid[ay][ax] == pixNum.CLAY) {
                        if (random() < (10 - travel) / 20) nextGrid[ay][ax] = pixNum.BRICKS;
                        return true;
                    } else if (grid[ay][ax] == pixNum.MUD) {
                        if (random() < (10 - travel) / 10) nextGrid[ay][ax] = pixNum.DIRT;
                    } else if (grid[ay][ax] !== pixNum.AIR) return true;
                    travel++;
                });
            }
            if (random() < 0.0001 * cooldownSpeed) {
                nextGrid[y][x] = pixNum.STONE;
                return;
            }
            nextFireGrid[y][x] = true;
            if (random() < 0.5) {
                flow(x, y);
            } else {
                if (y > 0) {
                    if (random() < 0.125) {
                        let validSlidingPositions = [];
                        if (x > 0) {
                            if (grid[y][x - 1] == pixNum.STONE && grid[y - 1][x - 1] == pixNum.STONE) {
                                validSlidingPositions.push(-1);
                            }
                        }
                        if (x < gridWidth - 1) {
                            if (grid[y][x + 1] == pixNum.STONE && grid[y - 1][x + 1] == pixNum.STONE) {
                                validSlidingPositions.push(1);
                            }
                        }
                        if (validSlidingPositions.length > 0) {
                            let slidePosition = validSlidingPositions[Math.floor(random(0, validSlidingPositions.length))];
                            if (validChangingPixel(x + slidePosition, y - 1) && canMoveTo(x + slidePosition, y - 1)) {
                                move(x, y, x + slidePosition, y - 1);
                            }
                        }
                    }
                }
                if (y > 0 && random() < 0.5 && (y == gridHeight - 1 || grid[y + 1][x] == pixNum.LAVA) && grid[y - 1][x] == pixNum.STONE && canMoveTo(x, y - 1)) {
                    move(x, y, x, y - 1);
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 100, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_red: 1,
            color_orange: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 17,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: true,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'lava',
        numId: 0
    },
    fire: {
        name: 'Fire',
        description: 'AAAAAA!!! It burns!',
        draw: function (rectangles, ctx, avoidGrid) {
            if (noNoise || avoidGrid) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = 'rgb(255, 180, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = 'rgb(255, 100, 0)';
                // gridnoisectx.fillStyle = 'rgb(255, 255, 0)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    // fillPixels(x, y, width, height, gridnoisectx);
                });
                bufferctx.clearRect(0, 0, canvasResolution, canvasResolution);
                bufferctx.globalAlpha = 1;
                bufferctx.fillStyle = 'rgb(255, 255, 0)';
                bufferctx.fillRect(0, 0, canvasResolution, canvasResolution);
                bufferctx.globalCompositeOperation = 'destination-in';
                bufferctx.drawImage(noiseCanvas, camera.x / drawScale, camera.y / drawScale, canvasResolution / drawScale, canvasResolution / drawScale, 0, 0, canvasResolution, canvasResolution);
                bufferctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 0.2;
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    ctx.drawImage(bufferCanvas, x * drawScale - camera.x, y * drawScale - camera.y, width * drawScale, height * drawScale, x * drawScale - camera.x, y * drawScale - camera.y, width * drawScale, height * drawScale);
                });
            }
        },
        update: function (x, y) {
            let flammability = monsterGrid[y][x] ? numPixels[pixNum.MONSTER].flammability : pixelAt(x, y).flammability;
            let isLava = grid[y][x] == pixNum.LAVA;
            if (flammability == 0 && !isLava && (grid[y][x] != pixNum.AIR || random() < 0.3)) {
                nextFireGrid[y][x] = nextFireGrid[y][x] == -1 ? false : nextFireGrid[y][x];
                return;
            }
            updateTouchingPixel(x, y, pixNum.WATER, (ax, ay) => {
                nextFireGrid[y][x] = nextFireGrid[y][x] == -1 ? false : nextFireGrid[y][x];
            });
            let aerated = grid[y][x] == pixNum.AIR || updateTouchingPixel(x, y, pixNum.AIR);
            if (random() < (20 - flammability) / (aerated ? 280 : 20)) {
                nextFireGrid[y][x] = nextFireGrid[y][x] == -1 ? false : nextFireGrid[y][x];
            }
            let meltAngle = random(0, Math.PI * 2);
            let travel = 0;
            rayTrace(x, y, Math.round(x + Math.cos(meltAngle) * 5), Math.round(y + Math.sin(meltAngle) * 5), (ax, ay) => {
                if (!validChangingPixel(ax, ay)) return;
                if (grid[ay][ax] == pixNum.SNOW || grid[ay][ax] == pixNum.ICE) {
                    if (random() < (5 - travel) / 30) nextGrid[ay][ax] = pixNum.WATER;
                } else if (grid[ay][ax] == pixNum.SILT) {
                    if (random() < (5 - travel) / 20) nextGrid[ay][ax] = pixNum.CLAY;
                } else if (grid[ay][ax] == pixNum.CLAY) {
                    if (random() < (5 - travel) / 30) nextGrid[ay][ax] = pixNum.BRICKS;
                    return true;
                } else if (grid[ay][ax] == pixNum.MUD) {
                    if (random() < (5 - travel) / 20) nextGrid[ay][ax] = pixNum.DIRT;
                } else if (grid[ay][ax] !== pixNum.AIR) return true;
                travel++;
            });
            if (random() < flammability / 1200 && validChangingPixel(x, y) && !isLava) {
                if (grid[y][x] >= pixNum.LASER_UP && grid[y][x] <= pixNum.LASER_RIGHT) {
                    nextGrid[y][x] = pixNum.AIR;
                    teamGrid[y][x] = 0;
                    explode(x, y, 5, true);
                } else if (grid[y][x] != pixNum.ASH && random() < 0.3) {
                    nextGrid[y][x] = pixNum.ASH;
                    monsterGrid[y][x] = false;
                    teamGrid[y][x] = 0;
                } else {
                    nextGrid[y][x] = pixNum.AIR;
                    monsterGrid[y][x] = false;
                    teamGrid[y][x] = 0;
                }
            }
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, gridHeight - 1); j++) {
                for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, gridWidth - 1); i++) {
                    if (nextFireGrid[j][i] != -1 || (i == x && j == y)) continue;
                    let flammability = monsterGrid[j][i] ? numPixels[pixNum.MONSTER].flammability : pixelAt(i, j).flammability;
                    if (random() < flammability / (aerated ? 20 : 60) + (j < y ? 0.4 : 0) - ((i != x && j != y) ? 0.4 : 0) - (aerated ? 0 : 0.2)) nextFireGrid[j][i] = true;
                    if (grid[j][i] == pixNum.WATER && random() < 0.05) nextGrid[j][i] = pixNum.STEAM;
                    if (grid[j][i] == pixNum.ICE && random() < 0.1) nextGrid[j][i] = pixNum.WATER;
                    if (grid[j][i] == pixNum.SNOW && random() < 0.2) nextGrid[j][i] = pixNum.WATER;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 20,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'fire',
        numId: 0
    },
    ash: {
        name: 'Ash',
        description: 'Burnt stuff, doesn\'t burn easily though',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(100, 110, 120)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(80, 85, 90)';
                gridnoisectx.fillStyle = 'rgb(120, 130, 140)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let removedWater = false;
            if (updateTouchingPixel(x, y, pixNum.WATER, (ax, ay) => {
                if (!removedWater && validChangingPixel(ax, ay) && random() < 0.2) {
                    nextGrid[ay][ax] = pixNum.AIR;
                    teamGrid[ay][ax] = 0;
                    removedWater = true;
                }
            })) {
                nextGrid[y][x] = pixNum.WET_ASH;
                return;
            }
            fall(x, y, 1, 2);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 110, 120)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'ash',
        numId: 0
    },
    wet_ash: {
        name: 'Wet Ash',
        description: 'Definitely not silt',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(80, 80, 90)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(70, 70, 80)';
                gridnoisectx.fillStyle = 'rgb(85, 85, 90)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 3,
        flammability: 2,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'wet_ash',
        numId: 0
    },
    iron: {
        name: 'Raw Iron',
        description: 'Some unrefined iron',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(200, 180, 120)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(160, 160, 180)';
                gridnoisectx.fillStyle = 'rgb(220, 200, 120)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 180, 120)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_grey: 4,
            color_yellow: 3
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'iron',
        numId: 0
    },
    steel: {
        name: 'Steel',
        description: 'Somehow at some point some carbon and heat was added to some iron',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(180, 180, 180)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(210, 210, 210)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i, width, 1 / 8, ctx);
                    fillPixels(x, i + 1 / 2, width, 1 / 8, ctx);
                }
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillStyle = 'rgb(180, 180, 180)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(210, 210, 210)';
            ctx.fillRect(0, 0, 50, 25 / 4);
            ctx.fillRect(0, 25, 50, 25 / 4);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 16,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'steel',
        numId: 0
    },
    concrete_powder: {
        name: 'Concrete Powder',
        description: 'Like sand, but hardens into concrete when in contact with water',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(150, 150, 150)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.CONCRETE;
                return;
            }
            fall(x, y, 1, 2);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(150, 150, 150)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            gravel: 2,
            sand: 2,
            clay: 1,
            color_grey: 1
        },
        craftAmount: 4,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'concrete_powder',
        numId: 0
    },
    concrete: {
        name: 'Concrete',
        description: 'Hard stuff that doesn\'t move easily, behaves similarly to stone but does not melt',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 75, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 75, 75)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'concrete',
        numId: 0
    },
    stone_bricks: {
        name: 'Stone Bricks',
        description: 'Simple bricks made of cut stone',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1)) {
                if ((grid[y][x - 1] == pixNum.STONE_BRICKS && !isPassableFluid(x - 1, y + 1)) || (grid[y][x + 1] == pixNum.STONE_BRICKS && !isPassableFluid(x + 1, y + 1))) return;
                move(x, y, x, y + 1);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(110, 110, 110)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            ctx.fillRect(0, 150 / 8, 50, 25 / 4);
            ctx.fillRect(0, 350 / 8, 50, 25 / 4);
            ctx.fillRect(150 / 4, 0, 25 / 4, 150 / 8);
            ctx.fillRect(25 / 2, 25, 25 / 4, 150 / 8);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(8);
            ctx.fillStyle = 'rgb(110, 110, 110)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            fillPixels(0, 3 / 8, 1, 1 / 8);
            fillPixels(0, 7 / 8, 1, 1 / 8);
            fillPixels(3 / 4, 0, 1 / 8, 3 / 8);
            fillPixels(1 / 4, 1 / 2, 1 / 8, 3 / 8);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            stone: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'stone_bricks',
        numId: 0
    },
    bricks: {
        name: 'Bricks',
        description: 'Hard rectangular clay',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1)) {
                if ((grid[y][x - 1] == pixNum.BRICKS && !isPassableFluid(x - 1, y + 1))
                    || (grid[y][x + 1] == pixNum.BRICKS && !isPassableFluid(x + 1, y + 1))
                    || (grid[y][x - 1] == pixNum.BRICKS && grid[y][x - 2] == pixNum.BRICKS && !isPassableFluid(x - 2, y + 1))
                    || (grid[y][x + 1] == pixNum.BRICKS && grid[y][x + 2] == pixNum.BRICKS && !isPassableFluid(x + 2, y + 1))) return;
                move(x, y, x, y + 1);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(180, 75, 60)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(215, 200, 200)';
            ctx.fillRect(0, 150 / 8, 50, 25 / 4);
            ctx.fillRect(0, 350 / 8, 50, 25 / 4);
            ctx.fillRect(150 / 4, 0, 25 / 4, 150 / 8);
            ctx.fillRect(25 / 2, 25, 25 / 4, 150 / 8);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(8);
            ctx.fillStyle = 'rgb(180, 75, 60)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(215, 200, 200)';
            fillPixels(0, 3 / 8, 1, 1 / 8);
            fillPixels(0, 7 / 8, 1, 1 / 8);
            fillPixels(3 / 4, 0, 1 / 8, 3 / 8);
            fillPixels(1 / 4, 1 / 2, 1 / 8, 3 / 8);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 15,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'bricks',
        numId: 0
    },
    glass: {
        name: 'Glass',
        description: 'For some reason you can see it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                redrawing && clearPixels(x, y, width, height, ctx);
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
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
            const { ctx, fillPixels, clearPixels, toImage } = new PreRenderer(25);
            ctx.fillStyle = 'rgba(180, 180, 210, 0.3)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            clearPixels(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            clearPixels(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            clearPixels(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            clearPixels(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            fillPixels(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            fillPixels(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            fillPixels(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            fillPixels(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'glass',
        numId: 0
    },
    reinforced_glass: {
        name: 'Reinforced Glass',
        description: 'Really heavy glass that happens to also be heat-resistant',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                redrawing && clearPixels(x, y, width, height, ctx);
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
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
            const { ctx, fillPixels, clearPixels, toImage } = new PreRenderer(150);
            ctx.fillStyle = 'rgba(180, 180, 210, 0.3)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            clearPixels(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            clearPixels(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            clearPixels(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            clearPixels(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            fillPixels(1 / 25, 6 / 25, 1 / 5, 1 / 5);
            fillPixels(6 / 25, 1 / 25, 1 / 5, 1 / 5);
            fillPixels(19 / 25, 14 / 25, 1 / 5, 1 / 5);
            fillPixels(14 / 25, 19 / 25, 1 / 5, 1 / 5);
            ctx.fillStyle = 'rgb(220, 220, 230)';
            fillPixels(0, 0, 1, 1 / 10);
            fillPixels(9 / 10, 0, 1 / 10, 1);
            fillPixels(0, 9 / 10, 1, 1 / 10);
            fillPixels(0, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            glass: 1,
            steel_crate: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'reinforced_glass',
        numId: 0
    },
    crate: {
        name: 'Wooden Crate',
        description: 'A crate made of wood that floats on water (and other stuff)',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (y < gridHeight - 1 && isAir(x, y + 1) && canMoveTo(x, y + 1)) move(x, y, x, y + 1);
            else if (y > 0 && grid[y - 1][x] == pixNum.WATER && canMoveTo(x, y - 1)) move(x, y, x, y - 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(175, 125, 75)';
            ctx.fillRect(15 / 2, 15 / 2, 35, 35);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(50 / Math.sqrt(2) - 5, -50 / Math.sqrt(2), 10, Math.sqrt(2) * 50);
            ctx.resetTransform();
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(40);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(175, 125, 75)';
            fillPixels(3 / 20, 3 / 20, 7 / 10, 7 / 10);
            ctx.fillStyle = 'rgb(150, 100, 75)';
            ctx.rotate(Math.PI / 4);
            fillPixels(1 / Math.sqrt(2) - 0.1, -1 / Math.sqrt(2), 0.2, Math.sqrt(2));
            ctx.resetTransform();
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            wood: 2
        },
        craftAmount: 3,
        prerenderedFrames: [],
        blastResistance: 4,
        flammability: 16,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'crate',
        numId: 0
    },
    steel_crate: {
        name: 'Steel Crate',
        description: 'A crate made of steel that sinks in water',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) move(x, y, x, y + 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(160, 160, 160)';
            ctx.fillRect(15 / 2, 15 / 2, 35, 35);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(50 / Math.sqrt(2) - 5, -50 / Math.sqrt(2), 10, Math.sqrt(2) * 50);
            ctx.resetTransform();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.fillRect(5 / 2, 5 / 2, 5, 5);
            ctx.fillRect(85 / 2, 5 / 2, 5, 5);
            ctx.fillRect(85 / 2, 85 / 2, 5, 5);
            ctx.fillRect(5 / 2, 85 / 2, 5, 5);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(40);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(160, 160, 160)';
            fillPixels(3 / 20, 3 / 20, 7 / 10, 7 / 10);
            ctx.fillStyle = 'rgb(120, 120, 120)';
            ctx.rotate(Math.PI / 4);
            fillPixels(1 / Math.sqrt(2) - 0.1, -1 / Math.sqrt(2), 0.2, Math.sqrt(2));
            ctx.resetTransform();
            ctx.fillStyle = 'rgb(200, 200, 200)';
            fillPixels(1 / 20, 1 / 20, 1 / 10, 1 / 10);
            fillPixels(17 / 20, 1 / 20, 1 / 10, 1 / 10);
            fillPixels(17 / 20, 17 / 20, 1 / 10, 1 / 10);
            fillPixels(1 / 20, 17 / 20, 1 / 10, 1 / 10);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            steel: 3
        },
        craftAmount: 2,
        prerenderedFrames: [],
        blastResistance: 16,
        flammability: 0,
        pushable: false,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'steel_crate',
        numId: 0
    },
    plant: {
        name: 'P.L.A.N.T.',
        description: '<span style="font-style: italic;">Persistent Loud Aesthetic Nail Tables.</span><br>No, it doesn\'t actually stand for anything. But it does consume concrete alarmingly fast...',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(125, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (!updateTouchingPixel(x, y, pixNum.AIR) && !updateTouchingPixel(x, y, pixNum.WATER)) {
                nextGrid[y][x] = pixNum.WATER;
                return;
            }
            updateTouchingPixel(x, y, pixNum.CONCRETE, (ax, ay) => {
                nextGrid[y][x] = pixNum.WATER;
                nextGrid[ay][ax] = pixNum.PLANT;
            });
            if (y < gridHeight - 1) {
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
        recipe: {
            color_green: 8,
            color_lime: 1,
            leaves: 24,
            moss: 4,
            water: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'plant',
        numId: 0
    },
    sponge: {
        name: 'S.P.O.N.G.E.',
        description: '<span style="font-style: italic;">Sample Providing Oceanic Nucleolic Green Egg</span><br>buh',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(225, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.WATER, (ax, ay) => {
                nextGrid[y][x] = pixNum.AIR;
                nextGrid[ay][ax] = pixNum.SPONGE;
                teamGrid[y][x] = 0;
                teamGrid[ay][ax] = 0;
            });
            if (y < gridHeight - 1) {
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
        recipe: {
            color_yellow: 8,
            wood: 1,
            leaves: 24
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 10,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'sponge',
        numId: 0
    },
    pump: {
        name: 'Water Pump',
        description: 'Violates the Laws of Thermodynamics to create water while consuming much less blue mass',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.LAVA, (ax, ay) => {
                nextGrid[y][x] = pixNum.WATER;
                teamGrid[y][x] = 0;
            });
            let team = teamGrid[y][x] - 1;
            let consumeResources = teamPixelAmounts[team] !== undefined;
            if (consumeResources || !PixSimAPI.inGame) updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.125 && (!consumeResources || teamPixelAmounts[team].color_cyan > 0 || teamPixelAmounts[team].color_blue > 0)) {
                    nextGrid[ay][ax] = pixNum.WATER;
                    if (teamPixelAmounts[team] !== undefined) {
                        if (random() < 0.5 && teamPixelAmounts[team].color_cyan > 0) {
                            teamPixelAmounts[team].color_cyan--;
                            if (team == PixSimAPI.team) queueUpdatePixelAmount('color_cyan', teamPixelAmounts[team]);
                        } else {
                            teamPixelAmounts[team].color_blue--;
                            if (team == PixSimAPI.team) queueUpdatePixelAmount('color_blue', teamPixelAmounts[team]);
                        }
                    }
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
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 100, 255)';
            fillPixels(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            concrete: 8,
            steel: 1,
            color_green: 2,
            piston_any: 4,
            cloner_any: 1,
            water: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'pump',
        numId: 0
    },
    lava_generator: {
        name: 'Lava Heater',
        description: 'Violates the Laws of Thermodynamics to create lava while consuming much less red mass',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.WATER, (ax, ay) => {
                teamGrid[y][x] = 0;
                explode(x, y, 5, true);
            });
            updateTouchingPixel(x, y, [pixNum.SNOW, pixNum.ICE], (ax, ay) => {
                teamGrid[y][x] = 0;
                explode(x, y, 6, true);
            });
            let team = teamGrid[y][x] - 1;
            let consumeResources = teamPixelAmounts[team] !== undefined;
            if (consumeResources || !PixSimAPI.inGame) updateTouchingPixel(x, y, [pixNum.AIR, pixNum.STONE], (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.075 && (!consumeResources || teamPixelAmounts[team].color_orange > 0 || teamPixelAmounts[team].color_red > 0)) {
                    nextGrid[ay][ax] = pixNum.LAVA;
                    if (teamPixelAmounts[team] !== undefined) {
                        if (random() < 0.5 && teamPixelAmounts[team].color_orange > 0) {
                            teamPixelAmounts[team].color_orange--;
                            if (team == PixSimAPI.team) queueUpdatePixelAmount('color_orange', teamPixelAmounts[team]);
                        } else {
                            teamPixelAmounts[team].color_red--;
                            if (team == PixSimAPI.team) queueUpdatePixelAmount('color_red', teamPixelAmounts[team]);
                        }
                    }
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
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 125, 0)';
            fillPixels(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            concrete: 8,
            steel: 3,
            color_green: 2,
            piston_any: 4,
            cloner_any: 1,
            lava: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'lava_generator',
        numId: 0
    },
    freezer: {
        name: 'Freezer',
        description: 'Violates the Laws of Thermodynamics to freeze stuff',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.LAVA, (ax, ay) => {
                teamGrid[y][x] = 0;
                explode(x, y, 7, true);
            });
            updateTouchingPixel(x, y, pixNum.WATER, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.075) {
                    nextGrid[ay][ax] = pixNum.ICE;
                }
            });
            updateTouchingPixel(x, y, pixNum.STEAM, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.WATER;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(180, 200, 255)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(25, 125, 75)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(180, 200, 255)';
            fillPixels(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            concrete: 8,
            steel: 1,
            color_green: 2,
            cloner_any: 4
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 0,
        updateStage: 6,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'freezer',
        numId: 0
    },
    // ██          ████████    ██████  ██████  ██████  ██████  ██████  ██  ██    ████████          ██
    // ██          ████████    ██  ██    ██    ██        ██    ██  ██  ██  ██    ████████          ██
    // ████████████████████    ██████    ██    ██████    ██    ██  ██  ██  ██    ████████████████████
    // ██          ████████    ██        ██        ██    ██    ██  ██  ██████    ████████          ██
    // ██          ████████    ██      ██████  ██████    ██    ██████  ██  ██    ████████          ██
    // it would be better to have a separate rotation grid but I've inherited this pit and dug it too deep to get out now
    piston_left: {
        name: 'Pusher (Left)',
        description: 'Pushes pixels in its path',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 0);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 2,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'piston_left',
        numId: 0
    },
    piston_up: {
        name: 'Pusher (Up)',
        description: 'Pushes pixels in its path',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 1);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 2,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'piston_up',
        numId: 0
    },
    piston_right: {
        name: 'Pusher (Right)',
        description: 'Pushes pixels in its path',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 2);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 2,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'piston_right',
        numId: 0
    },
    piston_down: {
        name: 'Pusher (Down)',
        description: 'Pushes pixels in its path',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2 + 1 / 2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 3);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 2,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'piston_down',
        numId: 0
    },
    sticky_piston_left: {
        name: 'Sticky Pusher (Left)',
        description: 'Sticks to and pushes pixels in its path, also pushing any pixels in the way of pixels stuck to it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            if (push((x < gridWidth - 1 && canPush(x + 1, y, 0)) ? x + 1 : x, y, 0)) {
                if (y > 0 && canPush(x, y - 1, 0) && grid[y - 1][x] != pixNum.AIR) push(x, y - 1, 0);
                if (y < gridHeight - 1 && canPush(x, y + 1, 0) && grid[y + 1][x] != pixNum.AIR) push(x, y + 1, 0);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 0)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        recipe: {
            piston_left: 1,
            slime: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 11,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'sticky_piston_left',
        numId: 0
    },
    sticky_piston_up: {
        name: 'Sticky Pusher (Up)',
        description: 'Sticks to and pushes pixels in its path, also pushing any pixels in the way of pixels stuck to it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            if (push(x, (y < gridHeight - 1 && canPush(x, y + 1, 1)) ? y + 1 : y, 1)) {
                if (x > 0 && canPush(x - 1, y, 1) && grid[y][x - 1] != pixNum.AIR) push(x - 1, y, 1);
                if (x < gridWidth - 1 && canPush(x + 1, y, 1) && grid[y][x + 1] != pixNum.AIR) push(x + 1, y, 1);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
        },
        prerender: function () { },
        recipe: {
            piston_up: 1,
            slime: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 11,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'sticky_piston_up',
        numId: 0
    },
    sticky_piston_right: {
        name: 'Sticky Pusher (Right)',
        description: 'Sticks to and pushes pixels in its path, also pushing any pixels in the way of pixels stuck to it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            if (push((x > 0 && canPush(x - 1, y, 0)) ? x - 1 : x, y, 2)) {
                if (y > 0 && canPush(x, y - 1, 0) && grid[y - 1][x] != pixNum.AIR) push(x, y - 1, 2);
                if (y < gridHeight - 1 && canPush(x, y + 1, 0) && grid[y + 1][x] != pixNum.AIR) push(x, y + 1, 2);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 0)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
        },
        prerender: function () { },
        recipe: {
            piston_right: 1,
            slime: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 11,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'sticky_piston_right',
        numId: 0
    },
    sticky_piston_down: {
        name: 'Sticky Pusher (Down)',
        description: 'Sticks to and pushes pixels in its path, also pushing any pixels in the way of pixels stuck to it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 75)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2 + 1 / 2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            if (push(x, (y > 0 && canPush(x, y - 1, 3)) ? y - 1 : y, 3)) {
                if (x > 0 && canPush(x - 1, y, 3) && grid[y][x - 1] != pixNum.AIR) push(x - 1, y, 3);
                if (x < gridWidth - 1 && canPush(x + 1, y, 3) && grid[y][x + 1] != pixNum.AIR) push(x + 1, y, 3);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 75)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 0)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
        },
        prerender: function () { },
        recipe: {
            piston_down: 1,
            slime: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 11,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'sticky_piston_down',
        numId: 0
    },
    push_piston_left: {
        name: 'Piston (Left)',
        description: 'Pushes pixels in front of it without moving',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i + 1 / 2, y, 1 / 2, height, ctx);
                }
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 0, false);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 25, 50 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(25, 0, 25, 50);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 1,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_piston_left',
        numId: 0
    },
    push_piston_up: {
        name: 'Piston (Up)',
        description: 'Pushes pixels in front of it without moving',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2, 1 / 3, 1 / 2, ctx);
                });
            });
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i + 1 / 2, width, 1 / 2, ctx);
                }
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 1, false);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 25);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 25, 50, 25);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 1,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_piston_up',
        numId: 0
    },
    push_piston_right: {
        name: 'Piston (Right)',
        description: 'Pushes pixels in front of it without moving',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i, y, 1 / 2, height, ctx);
                }
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 2, false);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(25, 50 / 3, 25, 50 / 3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 25, 50);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 1,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_piston_right',
        numId: 0
    },
    push_piston_down: {
        name: 'Piston (Down)',
        description: 'Pushes pixels in front of it without moving',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(0, 125, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2 + 1 / 2, 1 / 3, 1 / 2, ctx);
                });
            });
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i, width, 1 / 2, ctx);
                }
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA)) {
                nextGrid[y][x] = pixNum.ASH;
                teamGrid[y][x] = 0;
                return;
            }
            push(x, y, 3, false);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 25, 50 / 3, 25);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 25);
        },
        prerender: function () { },
        recipe: {
            color_cyan: 1,
            color_blue: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 10,
        flammability: 6,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_piston_down',
        numId: 0
    },
    cloner_left: {
        name: 'Copier (Left)',
        description: 'Copies pixels from its right to its left',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (x > 0 && x < gridWidth - 1 && grid[y][x + 1] != pixNum.AIR && pixelAt(x + 1, y).cloneable && grid[y][x - 1] == pixNum.AIR && canMoveTo(x - 1, y)) {
                nextGrid[y][x - 1] = grid[y][x + 1];
                teamGrid[y][x - 1] = teamGrid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            concrete: 1,
            wood: 1,
            steel: 1,
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'cloner_left',
        numId: 0
    },
    cloner_up: {
        name: 'Copier (Up)',
        description: 'Copies pixels from below it to above it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (y > 0 && y < gridHeight - 1 && grid[y + 1][x] != pixNum.AIR && pixelAt(x, y + 1).cloneable && grid[y - 1][x] == pixNum.AIR && canMoveTo(x, y - 1)) {
                nextGrid[y - 1][x] = grid[y + 1][x];
                teamGrid[y - 1][x] = teamGrid[y + 1][x];
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
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'cloner_up',
        numId: 0
    },
    cloner_right: {
        name: 'Copier (Right)',
        description: 'Copies pixels from its left to its right',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (x > 0 && x < gridWidth - 1 && grid[y][x - 1] != pixNum.AIR && pixelAt(x - 1, y).cloneable && grid[y][x + 1] == pixNum.AIR && canMoveTo(x + 1, y)) {
                nextGrid[y][x + 1] = grid[y][x - 1];
                teamGrid[y][x + 1] = teamGrid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'cloner_right',
        numId: 0
    },
    cloner_down: {
        name: 'Copier (Down)',
        description: 'Copies pixels from above it to below it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (y > 0 && y < gridHeight - 1 && grid[y - 1][x] != pixNum.AIR && pixelAt(x, y - 1).cloneable && grid[y + 1][x] == pixNum.AIR && canMoveTo(x, y + 1)) {
                nextGrid[y + 1][x] = grid[y - 1][x];
                teamGrid[y + 1][x] = teamGrid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'cloner_down',
        numId: 0
    },
    push_cloner_left: {
        name: 'Cloner (Left)',
        description: 'Clones pixels from its right to its left, pushing pixels in the way',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (x > 0 && x < gridWidth - 1 && grid[y][x + 1] != pixNum.AIR && pixelAt(x + 1, y).cloneable && grid[y][x - 1] != pixNum.DELETER && canMoveTo(x - 1, y)) {
                if (push(x, y, 0, false, true)) {
                    nextGrid[y][x - 1] = grid[y][x + 1];
                    teamGrid[y][x - 1] = teamGrid[y][x + 1];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(60);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixels(1 / 3, 2 / 5, 1 / 3, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            sticky_piston_left: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        collectible: true,
        group: 1,
        rotation: 0,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_cloner_left',
        numId: 0
    },
    push_cloner_up: {
        name: 'Cloner (Up)',
        description: 'Clones pixels from below it to above it, pushing pixels in the way',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (y > 0 && y < gridHeight - 1 && grid[y + 1][x] != pixNum.AIR && pixelAt(x, y + 1).cloneable && grid[y - 1][x] != pixNum.DELETER && canMoveTo(x, y - 1)) {
                if (push(x, y, 1, false, true)) {
                    nextGrid[y - 1][x] = grid[y + 1][x];
                    teamGrid[y - 1][x] = teamGrid[y + 1][x];
                }
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
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(60);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixels(2 / 5, 1 / 3, 1 / 5, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            sticky_piston_up: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        collectible: true,
        group: 1,
        rotation: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_cloner_up',
        numId: 0
    },
    push_cloner_right: {
        name: 'Cloner (Right)',
        description: 'Clones pixels from its left to its right, pushing pixels in the way',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (x > 0 && x < gridWidth - 1 && grid[y][x - 1] != pixNum.AIR && pixelAt(x - 1, y).cloneable && grid[y][x + 1] != pixNum.DELETER && canMoveTo(x + 1, y)) {
                if (push(x, y, 2, false, true)) {
                    nextGrid[y][x + 1] = grid[y][x - 1];
                    teamGrid[y][x + 1] = teamGrid[y][x - 1];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(200 / 6, 50 / 4, 50 / 6, 25);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 20, 50 / 3, 10);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(60);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixels(1 / 3, 2 / 5, 1 / 3, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            sticky_piston_right: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        collectible: true,
        group: 1,
        rotation: 2,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_cloner_right',
        numId: 0
    },
    push_cloner_down: {
        name: 'Cloner (Down)',
        description: 'Clones pixels from above it to below it, pushing pixels in the way',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            if (y > 0 && y < gridHeight - 1 && grid[y - 1][x] != pixNum.AIR && pixelAt(x, y - 1).cloneable && grid[y + 1][x] != pixNum.DELETER && canMoveTo(x, y + 1)) {
                if (push(x, y, 3, false, true)) {
                    nextGrid[y + 1][x] = grid[y - 1][x];
                    teamGrid[y + 1][x] = teamGrid[y - 1][x];
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
            ctx.fillRect(50 / 4, 200 / 6, 25, 50 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(20, 50 / 3, 10, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(60);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixels(2 / 5, 1 / 3, 1 / 5, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_lime: 1,
            color_blue: 1,
            sticky_piston_down: 1,
            concrete: 1,
            steel: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        collectible: true,
        group: 1,
        rotation: 3,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'push_cloner_down',
        numId: 0
    },
    super_cloner_left: {
        name: 'Super Copier (Left)',
        description: 'Copies pixels from its right to its left, removing whatever was previously there',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (x > 0 && x < gridWidth - 1) {
                nextGrid[y][x - 1] = grid[y][x + 1];
                teamGrid[y][x - 1] = teamGrid[y][x + 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 6, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 3,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'super_cloner_left',
        numId: 0
    },
    super_cloner_up: {
        name: 'Super Copier (Up)',
        description: 'Copies pixels from below it to above it, removing whatever was previously there',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (y > 0 && y < gridHeight - 1) {
                nextGrid[y - 1][x] = grid[y + 1][x];
                teamGrid[y - 1][x] = teamGrid[y + 1][x];
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
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 1 / 6, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'super_cloner_up',
        numId: 0
    },
    super_cloner_right: {
        name: 'Super Copier (Right)',
        description: 'Copies pixels from its left to its right, removing whatever was previously there',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (x > 0 && x < gridWidth - 1) {
                nextGrid[y][x + 1] = grid[y][x - 1];
                teamGrid[y][x + 1] = teamGrid[y][x - 1];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(0, 50 / 3, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(100 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(0, 1 / 3, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 1 / 3);
            fillPixels(2 / 3, 1 / 4, 1 / 6, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 4,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'super_cloner_right',
        numId: 0
    },
    super_cloner_down: {
        name: 'Super Copier (Down)',
        description: 'Copies pixels from above it to below it, removing whatever was previously there',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (y > 0 && y < gridHeight - 1) {
                nextGrid[y + 1][x] = grid[y - 1][x];
                teamGrid[y + 1][x] = teamGrid[y - 1][x];
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 50 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            ctx.fillRect(50 / 3, 100 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(36);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(0, 125, 255)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            ctx.fillStyle = 'rgb(125, 255, 75)';
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            fillPixels(1 / 4, 2 / 3, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 8,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 2,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'super_cloner_down',
        numId: 0
    },
    rotator_left: {
        name: 'Rotator (Left)',
        description: 'Rotates directional pixels to face left',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        recipe: {
            piston_left: 1,
            color_cyan: 1,
            slime: 1,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_left',
        numId: 0
    },
    rotator_up: {
        name: 'Rotator (Up)',
        description: 'Rotates directional pixels to face up',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        recipe: {
            piston_up: 1,
            color_cyan: 1,
            slime: 1,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_up',
        numId: 0
    },
    rotator_right: {
        name: 'Rotator (Right)',
        description: 'Rotates directional pixels to face right',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        recipe: {
            piston_right: 1,
            color_cyan: 1,
            slime: 1,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 2,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_right',
        numId: 0
    },
    rotator_down: {
        name: 'Rotator (Down)',
        description: 'Rotates directional pixels to face down',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(75, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2 + 1 / 2, 1 / 3, 1 / 2, ctx);
                });
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        recipe: {
            piston_down: 1,
            color_cyan: 1,
            slime: 1,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        rotation: 3,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_down',
        numId: 0
    },
    rotator_clockwise: {
        name: 'Rotator (Clockwise)',
        description: 'Rotates directional pixels clockwise',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (frameModulo.get(10) >= 10 || redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[noAnimations ? 4 : (Math.floor(deltaTime / 10) % 4)], ctx);
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(0, 0, 2 / 3, 1 / 3);
            fillPixels(1 / 3, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(1 / 3, 0, 2 / 3, 1 / 3);
            fillPixels(0, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(2 / 3, 0, 1 / 3, 2 / 3);
            fillPixels(0, 1 / 3, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 2 / 3);
            fillPixels(0, 0, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.globalAlpha = 0.5;
            fillPixels(0, 0, 1 / 3, 1 / 3);
            fillPixels(2 / 3, 2 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            rotator_left: 1,
            rotator_up: 1,
            rotator_right: 1,
            rotator_down: 1,
            slime: 2
        },
        craftAmount: 2,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_clockwise',
        numId: 0
    },
    rotator_counterclockwise: {
        name: 'Rotator (Counterclockwise)',
        description: 'Rotates directional pixels counterclockwise',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (frameModulo.get(10) >= 10 || redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[noAnimations ? 4 : (Math.floor(deltaTime / 10) % 4)], ctx);
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (pixelAt(ax, ay).rotateable) rotatePixel(ax, ay);
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
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(3);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(1 / 3, 0, 2 / 3, 1 / 3);
            fillPixels(0, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(0, 0, 2 / 3, 1 / 3);
            fillPixels(1 / 3, 2 / 3, 2 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(2 / 3, 1 / 3, 1 / 3, 2 / 3);
            fillPixels(0, 0, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(2 / 3, 0, 1 / 3, 2 / 3);
            fillPixels(0, 1 / 3, 1 / 3, 2 / 3);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(75, 255, 255)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(1 / 3, 2 / 3, 1 / 3, 1 / 3);
            ctx.globalAlpha = 0.5;
            fillPixels(2 / 3, 0, 1 / 3, 1 / 3);
            fillPixels(0, 2 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            rotator_left: 1,
            rotator_up: 1,
            rotator_right: 1,
            rotator_down: 1,
            slime: 2
        },
        craftAmount: 2,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 1,
        updateStage: 5,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'rotator_counterclockwise',
        numId: 0
    },
    slider_horizontal: {
        name: 'Horizontal Slider',
        description: 'Can only be pushed left and right',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 180, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(200, 100, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i + 1 / 4, width, 1 / 2, ctx);
                }
            });
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
        recipe: {
            color_orange: 4,
            color_brown: 2,
            steel_crate: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'slider_horizontal',
        numId: 0
    },
    slider_vertical: {
        name: 'Vertical Slider',
        description: 'Can only be pushed up and down',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(250, 180, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(200, 100, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i + 1 / 4, y, 1 / 2, height, ctx);
                }
            });
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
        recipe: {
            color_orange: 4,
            color_brown: 2,
            steel_crate: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'slider_vertical',
        numId: 0
    },
    collapsible: {
        name: 'Collapsible Box',
        description: 'A box that will disintegrate when squished',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            ctx.fillRect(15 / 2, 15 / 2, 35, 35);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(0, -5, Math.sqrt(2) * 50, 10);
            ctx.resetTransform();
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(40);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(200, 100, 0)';
            fillPixels(3 / 20, 3 / 20, 7 / 10, 7 / 10);
            ctx.fillStyle = 'rgb(250, 180, 0)';
            ctx.rotate(Math.PI / 4);
            fillPixels(0, -0.1, Math.sqrt(2), 0.2);
            ctx.resetTransform();
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            crate: 1,
            color_orange: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 15,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'collapsible',
        numId: 0
    },
    cloner_deactivator: {
        name: 'Cloner Deactivator',
        description: 'Deactivates cloners and copiers that are touching it... and also uncollectable by collectors',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 50 / 3, 50, 50 / 3);
            ctx.fillRect(50 / 3, 0, 50 / 3, 50);
            ctx.fillRect(25 / 3, 25 / 3, 100 / 3, 100 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            ctx.fillRect(50 / 3, 50 / 3, 50 / 3, 50 / 3);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(6);
            ctx.fillStyle = 'rgb(220, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 1 / 3, 1, 1 / 3);
            fillPixels(1 / 3, 0, 1 / 3, 1);
            fillPixels(1 / 6, 1 / 6, 2 / 3, 2 / 3);
            ctx.fillStyle = 'rgb(255, 255, 0)';
            fillPixels(1 / 3, 1 / 3, 1 / 3, 1 / 3);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_yellow: 1,
            concrete: 1,
            wood: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 15,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'cloner_deactivator',
        numId: 0
    },
    slime: {
        name: 'Slime',
        description: 'Sticky green stuff',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 255, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 255, 100)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            leaves: 8,
            water: 1,
            moss: 2
        },
        craftAmount: 3,
        prerenderedFrames: [],
        blastResistance: 7,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'slime',
        numId: 0
    },
    laser_left: {
        name: 'L.A.S.E.R. (Left)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Leftwards)</span><br>Destroys pixels in a line using hypersonic boating super entities',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) fillPixels(x, y, width, height, ctx);
            });
            let color = noAnimations ? [255, 0, 144] : colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
            if (avoidGrid) return;
            abovectx.globalAlpha = 1;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                for (let i = 0; i < height; i++) {
                    drawLaserPath(getLaserPath(x, y + i, 0));
                }
            });
        },
        update: function (x, y) {
            // CONSUME THE RESOURCES!!!!
            // make less expensive to make generators less expensive?
            let path = getLaserPath(x, y, 0);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridWidth || last[3] < 0 || last[3] >= gridHeight) return;
            if (monsterGrid[last[3]][last[2]]) {
                if (random() < numPixels[pixNum.MONSTER].flammability / 100) {
                    monsterGrid[last[3]][last[2]] = false;
                    nextFireGrid[last[3]][last[2]] = true;
                    teamGrid[last[3]][last[2]] = 0;
                }
            } else {
                if (random() < pixelAt(last[2], last[3]).flammability / 100) {
                    if (grid[last[3]][last[2]] >= pixNum.LASER_LEFT && grid[last[3]][last[2]] <= pixNum.LASER_DOWN) {
                        teamGrid[last[3]][last[2]] = 0;
                        explode(last[2], last[3], 5, true);
                    }
                    if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) {
                        nextGrid[last[3]][last[2]] = pixNum.AIR;
                        teamGrid[last[3]][last[2]] = 0;
                    }
                } else if (random() < pixelAt(last[2], last[3]).flammability / 100) nextFireGrid[last[3]][last[2]] = true;
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
        recipe: {
            color_violet: 8,
            color_green: 96,
            color_red: 96,
            color_blue: 96,
            lava_generator: 6,
            concrete: 8,
            steel: 2,
            glass: 2,
            mirror_any: 9
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 2,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'laser_left',
        numId: 0
    },
    laser_up: {
        name: 'L.A.S.E.R. (Up)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Upwards)</span><br>Destroys pixels in a line using hypersonic boating super entities',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) fillPixels(x, y, width, height, ctx);
            });
            let color = noAnimations ? [255, 0, 144] : colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2, 1 / 3, 1 / 2, ctx);
                });
            });
            if (avoidGrid) return;
            abovectx.globalAlpha = 1;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                for (let i = 0; i < width; i++) {
                    drawLaserPath(getLaserPath(x + i, y, 1));
                }
            });
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 1);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridWidth || last[3] < 0 || last[3] >= gridHeight) return;
            if (monsterGrid[last[3]][last[2]]) {
                if (random() < numPixels[pixNum.MONSTER].flammability / 100) {
                    monsterGrid[last[3]][last[2]] = false;
                    nextFireGrid[last[3]][last[2]] = true;
                }
            } else {
                if (random() < pixelAt(last[2], last[3]).flammability / 100) {
                    if (grid[last[3]][last[2]] >= pixNum.LASER_LEFT && grid[last[3]][last[2]] <= pixNum.LASER_DOWN) {
                        teamGrid[last[3]][last[2]] = 0;
                        explode(last[2], last[3], 5, true);
                    }
                    if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) {
                        nextGrid[last[3]][last[2]] = pixNum.AIR;
                        teamGrid[last[3]][last[2]] = 0;
                    }
                } else if (random() < pixelAt(last[2], last[3]).flammability / 100) nextFireGrid[last[3]][last[2]] = true;
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
        recipe: {
            color_violet: 8,
            color_green: 96,
            color_red: 96,
            color_blue: 96,
            lava_generator: 6,
            concrete: 8,
            steel: 2,
            glass: 2,
            mirror_any: 9
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 2,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'laser_up',
        numId: 0
    },
    laser_right: {
        name: 'L.A.S.E.R. (Right)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Rightwards)</span><br>Destroys pixels in a line using hypersonic boating super entities',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) fillPixels(x, y, width, height, ctx);
            });
            let color = noAnimations ? [255, 0, 144] : colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 2, y2 + 1 / 3, 1 / 2, 1 / 3, ctx);
                });
            });
            if (avoidGrid) return;
            abovectx.globalAlpha = 1;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                for (let i = 0; i < height; i++) {
                    drawLaserPath(getLaserPath(x + width - 1, y + i, 2));
                }
            });
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 2);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridWidth || last[3] < 0 || last[3] >= gridHeight) return;
            if (monsterGrid[last[3]][last[2]]) {
                if (random() < numPixels[pixNum.MONSTER].flammability / 100) {
                    monsterGrid[last[3]][last[2]] = false;
                    nextFireGrid[last[3]][last[2]] = true;
                }
            } else {
                if (random() < pixelAt(last[2], last[3]).flammability / 100) {
                    if (grid[last[3]][last[2]] >= pixNum.LASER_LEFT && grid[last[3]][last[2]] <= pixNum.LASER_DOWN) {
                        teamGrid[last[3]][last[2]] = 0;
                        explode(last[2], last[3], 5, true);
                    }
                    if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) {
                        nextGrid[last[3]][last[2]] = pixNum.AIR;
                        teamGrid[last[3]][last[2]] = 0;
                    }
                } else if (random() < pixelAt(last[2], last[3]).flammability / 100) nextFireGrid[last[3]][last[2]] = true;
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
        recipe: {
            color_violet: 8,
            color_green: 96,
            color_red: 96,
            color_blue: 96,
            lava_generator: 6,
            concrete: 8,
            steel: 2,
            glass: 2,
            mirror_any: 9
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 2,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'laser_right',
        numId: 0
    },
    laser_down: {
        name: 'L.A.S.E.R. (Down)',
        description: '<span style="font-style: italic;">Lol Are Super Entities Rowing (boats) (Downwards)</span><br>Destroys pixels in a line using hypersonic boating super entities',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(90, 0, 120)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) fillPixels(x, y, width, height, ctx);
            });
            let color = noAnimations ? [255, 0, 144] : colorAnimate(255, 0, 144, 60, 112, 255, 18);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || forceRedraw || redrawing) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 3, y2 + 1 / 2, 1 / 3, 1 / 2, ctx);
                });
            });
            if (avoidGrid) return;
            abovectx.globalAlpha = 1;
            abovectx.fillStyle = 'rgb(71, 216, 159)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                for (let i = 0; i < width; i++) {
                    drawLaserPath(getLaserPath(x + i, y + height - 1, 3));
                }
            });
        },
        update: function (x, y) {
            let path = getLaserPath(x, y, 3);
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridWidth || last[3] < 0 || last[3] >= gridHeight) return;
            if (monsterGrid[last[3]][last[2]]) {
                if (random() < numPixels[pixNum.MONSTER].flammability / 100) {
                    monsterGrid[last[3]][last[2]] = false;
                    nextFireGrid[last[3]][last[2]] = true;
                }
            } else {
                if (random() < pixelAt(last[2], last[3]).flammability / 100) {
                    if (grid[last[3]][last[2]] >= pixNum.LASER_LEFT && grid[last[3]][last[2]] <= pixNum.LASER_DOWN) {
                        teamGrid[last[3]][last[2]] = 0;
                        explode(last[2], last[3], 5, true);
                    }
                    if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) {
                        nextGrid[last[3]][last[2]] = pixNum.AIR;
                        teamGrid[last[3]][last[2]] = 0;
                    }
                } else if (random() < pixelAt(last[2], last[3]).flammability / 100) nextFireGrid[last[3]][last[2]] = true;
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
        recipe: {
            color_violet: 8,
            color_green: 96,
            color_red: 96,
            color_blue: 96,
            lava_generator: 6,
            concrete: 8,
            steel: 2,
            glass: 2,
            mirror_any: 9
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 1,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 2,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'laser_down',
        numId: 0
    },
    laser_scatterer: {
        name: 'Laser Scatterer',
        description: 'Scatters lasers that pass through it and makes them useless',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(220, 220, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(210, 210, 220)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i, y, 1 / 4, height, ctx);
                    fillPixels(i + 1 / 2, y, 1 / 4, height, ctx);
                }
            });
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
        recipe: {
            glass: 2,
            sand: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 2,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'laser_scatterer',
        numId: 0
    },
    mirror_1: {
        name: 'Mirror',
        description: 'Be careful with it around lasers, as they\'ll bounce right off of it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                redrawing && clearPixels(x, y, width, height, ctx);
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(50 / Math.sqrt(2) - 7.5, -50 / Math.sqrt(2), 15, Math.sqrt(2) * 50);
            ctx.resetTransform();
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
            const { ctx, fillPixels, toImage } = new PreRenderer(90);
            ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.rotate(Math.PI / 4);
            fillPixels(1 / Math.sqrt(2) - 0.15, -1 / Math.sqrt(2), 0.3, Math.sqrt(2));
            ctx.resetTransform();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1 / 6, 1 / 6);
            fillPixels(5 / 6, 0, 1 / 6, 1 / 6);
            fillPixels(5 / 6, 5 / 6, 1 / 6, 1 / 6);
            fillPixels(0, 5 / 6, 1 / 6, 1 / 6);
            fillPixels(0, 1 / 30, 1, 1 / 10);
            fillPixels(13 / 15, 0, 1 / 10, 1);
            fillPixels(0, 13 / 15, 1, 1 / 10);
            fillPixels(1 / 30, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            reinforced_glass: 1,
            steel: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 2,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'mirror_1',
        numId: 0
    },
    mirror_2: {
        name: 'Mirror',
        description: 'Be careful with it around lasers, as they\'ll bounce right off of it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                redrawing && clearPixels(x, y, width, height, ctx);
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(220, 220, 220)';
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(0, -7.5, Math.sqrt(2) * 50, 15);
            ctx.resetTransform();
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
            const { ctx, fillPixels, toImage } = new PreRenderer(90);
            ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.rotate(Math.PI / 4);
            fillPixels(0, -0.15, Math.sqrt(2), 0.3);
            ctx.resetTransform();
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1 / 6, 1 / 6);
            fillPixels(5 / 6, 0, 1 / 6, 1 / 6);
            fillPixels(5 / 6, 5 / 6, 1 / 6, 1 / 6);
            fillPixels(0, 5 / 6, 1 / 6, 1 / 6);
            fillPixels(0, 1 / 30, 1, 1 / 10);
            fillPixels(13 / 15, 0, 1 / 10, 1);
            fillPixels(0, 13 / 15, 1, 1 / 10);
            fillPixels(1 / 30, 0, 1 / 10, 1);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            reinforced_glass: 1,
            steel: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 2,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'mirror_2',
        numId: 0
    },
    flamethrower_left: {
        name: 'Flamethrower (Left)',
        description: 'Throws flames',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            let flamey = y;
            for (let flamex = x - 1; flamex >= 0; flamex--) {
                if (!isAir(flamex, flamey)) break;
                if (random() < 0.1) {
                    flamey--;
                    if (flamey < 0) flamey = 0;
                }
                if (random() < 0.1) {
                    flamey++;
                    if (flamey >= gridHeight) flamey = gridHeight - 1;
                }
                if (!fireGrid[flamey][flamex]) {
                    nextFireGrid[flamey][flamex] = true;
                    break;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            ctx.fillRect(0, 50 / 3, 10, 50 / 3);
            ctx.fillRect(10, 10, 10, 30);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(15);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            fillPixels(0, 1 / 3, 1 / 5, 1 / 3);
            fillPixels(1 / 5, 1 / 5, 1 / 5, 3 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_black: 1,
            gunpowder: 4,
            push_cloner_any: 1,
            steel: 4,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 0,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'flamethrower_left',
        numId: 0
    },
    flamethrower_up: {
        name: 'Flamethrower (Up)',
        description: 'Throws flames',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            let flamex = x;
            for (let flamey = y - 1; flamey >= 0; flamey--) {
                if (!isAir(flamex, flamey)) break;
                if (random() < 0.1) {
                    flamex--;
                    if (flamex < 0) flamex = 0;
                }
                if (random() < 0.1) {
                    flamex++;
                    if (flamex >= gridWidth) flamex = gridWidth - 1;
                }
                if (!fireGrid[flamey][flamex]) {
                    nextFireGrid[flamey][flamex] = true;
                    break;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            ctx.fillRect(50 / 3, 0, 50 / 3, 10);
            ctx.fillRect(10, 10, 30, 10);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(15);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            fillPixels(1 / 3, 0, 1 / 3, 1 / 5);
            fillPixels(1 / 5, 1 / 5, 3 / 5, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_black: 1,
            gunpowder: 4,
            push_cloner_any: 1,
            steel: 4,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 1,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'flamethrower_up',
        numId: 0
    },
    flamethrower_right: {
        name: 'Flamethrower (Right)',
        description: 'Throws flames',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            let flamey = y;
            for (let flamex = x + 1; flamex < gridWidth; flamex++) {
                if (!isAir(flamex, flamey)) break;
                if (random() < 0.1) {
                    flamey--;
                    if (flamey < 0) flamey = 0;
                }
                if (random() < 0.1) {
                    flamey++;
                    if (flamey >= gridHeight) flamey = gridHeight - 1;
                }
                if (!fireGrid[flamey][flamex]) {
                    nextFireGrid[flamey][flamex] = true;
                    break;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            ctx.fillRect(40, 50 / 3, 10, 50 / 3);
            ctx.fillRect(30, 10, 10, 30);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(15);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            fillPixels(4 / 5, 1 / 3, 1 / 5, 1 / 3);
            fillPixels(3 / 5, 1 / 5, 1 / 5, 3 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_black: 1,
            gunpowder: 4,
            push_cloner_any: 1,
            steel: 4,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 2,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'flamethrower_right',
        numId: 0
    },
    flamethrower_down: {
        name: 'Flamethrower (Down)',
        description: 'Throws flames',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            let flamex = x;
            for (let flamey = y + 1; flamey < gridHeight; flamey++) {
                if (!isAir(flamex, flamey)) break;
                if (random() < 0.1) {
                    flamex--;
                    if (flamex < 0) flamex = 0;
                }
                if (random() < 0.1) {
                    flamex++;
                    if (flamex >= gridWidth) flamex = gridWidth - 1;
                }
                if (!fireGrid[flamey][flamex]) {
                    nextFireGrid[flamey][flamex] = true;
                    break;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            ctx.fillRect(50 / 3, 40, 50 / 3, 10);
            ctx.fillRect(10, 30, 30, 10);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(15);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            fillPixels(1 / 3, 4 / 5, 1 / 3, 1 / 5);
            fillPixels(1 / 5, 3 / 5, 3 / 5, 1 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_black: 1,
            gunpowder: 4,
            push_cloner_any: 1,
            steel: 4,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: true,
        rotation: 3,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'flamethrower_down',
        numId: 0
    },
    detonator: {
        name: 'Detonator',
        description: 'Triggers gunpowder and C-4 on contact by exploding',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (frameModulo.get(30) >= 30 || redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[noAnimations ? 0 : (Math.floor(deltaTime / 30) % 2)], ctx);
            });
        },
        update: function (x, y) {
            if (updateTouchingPixel(x, y, [pixNum.GUNPOWDER, pixNum.C4, pixNum.LAVA]) || fireGrid[y][x]) {
                teamGrid[y][x] = 0;
                explode(x, y, 5);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(20, 20, 20)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(5);
            ctx.fillStyle = 'rgb(20, 20, 20)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(180, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(255, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_red: 2,
            color_black: 1,
            gunpowder: 4,
            flamethrower_any: 1,
            piston_any: 1,
            concrete: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 5,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'detonator',
        numId: 0
    },
    gunpowder: {
        name: 'Gunpowder',
        description: 'A low explosive that explodes when lit on fire',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(50, 25, 25)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(30, 20, 20)';
                gridnoisectx.fillStyle = 'rgb(55, 40, 40)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.LAVA) || fireGrid[y][x]) {
                teamGrid[y][x] = 0;
                explode(x, y, 5, true);
            } else fall(x, y, 1, 1, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(50, 25, 25)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_brown: 1,
            // we don't have home depot pixels to get potassium nitrate pixels from, so here's some leaves
            leaves: 12,
            ash: 4
        },
        craftAmount: 2,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 20,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'gunpowder',
        numId: 0
    },
    c4: {
        name: 'C-4',
        description: 'A high explosive that can only be triggered by other explosions',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(245, 245, 200)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(245, 245, 200)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            // we also don't have hexogen and I don't want to be on any more government watch lists so here you go
            plant: 24,
            water: 1,
            sponge: 1
        },
        craftAmount: 3,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 4,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'c4',
        numId: 0
    },
    nuke_diffuser: {
        name: 'Nuke Diffuser',
        description: 'Doesn\'t cause diffusion, but will defuse nukes touching it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(175, 50, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(225, 125, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i + 1 / 3, width, 1 / 3, ctx);
                }
                end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i + 1 / 3, y, 1 / 3, height, ctx);
                }
            });
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
        recipe: {
            color_orange: 1,
            slider_horizontal: 1,
            slider_vertical: 1,
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 19,
        flammability: 2,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'nuke_diffuser',
        numId: 0
    },
    nuke: {
        name: 'Nuke',
        description: 'Not really a nuke lol',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 255, 125)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridHeight - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.NUKE) explosion = false;
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                teamGrid[y][x] = 0;
                explode(x, y, 20);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 255, 125)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_lime: 1,
            color_blue: 2,
            color_violet: 2,
            color_black: 6,
            color_brown: 4,
            detonator: 1,
            c4: 4,
            plant: 48,
            water: 1,
            sponge: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'nuke',
        numId: 0
    },
    huge_nuke: {
        name: 'Huge Nuke',
        description: 'KABOOM!!!',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 60, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridHeight - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.HUGE_NUKE) explosion = false;
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                teamGrid[y][x] = 0;
                explode(x, y, 40);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 60, 255)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_blue: 3,
            color_violet: 2,
            color_black: 6,
            color_brown: 4,
            detonator: 1,
            c4: 4,
            plant: 96,
            water: 1,
            sponge: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'huge_nuke',
        numId: 0
    },
    very_huge_nuke: {
        name: 'Very Huge Nuke',
        description: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 0, 70)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let explosion = updateTouchingAnything(x, y);
            let diffused = updateTouchingPixel(x, y, pixNum.NUKE_DIFFUSER);
            if (y < gridHeight - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1)) {
                move(x, y, x, y + 1);
            }
            if (y < gridHeight - 1) {
                if (isPassableFluid(x, y + 1) || grid[y + 1][x] == pixNum.VERY_HUGE_NUKE) explosion = false;
            } else {
                explosion = true;
            }
            if (explosion && !diffused) {
                teamGrid[y][x] = 0;
                explode(x, y, 80);
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 70)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: {
            color_red: 1,
            color_blue: 2,
            color_violet: 2,
            color_black: 6,
            color_brown: 4,
            detonator: 1,
            huge_nuke: 4,
            plant: 48,
            water: 1,
            sponge: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'very_huge_nuke',
        numId: 0
    },
    deleter: {
        name: 'Deleter',
        description: 'undefined',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(100, 100, 100)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            let color = noAnimations ? [200, 0, 255] : colorAnimate(200, 0, 255, 255, 0, 255, 96);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 4, y2 + 1 / 4, 1 / 2, 1 / 2, ctx);
                });
            });
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 3,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'deleter',
        numId: 0
    },
    spongy_rice: {
        name: 'Spongy Rice',
        description: 'The solution to world hunger! Expands 4852x from just a drop of water!<br><i>(SPAARK is not responsible for any Spongy Rice-related injuries or deaths)</i>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(240, 240, 230)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(230, 230, 230)';
                gridnoisectx.fillStyle = 'rgb(245, 245, 220)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, [pixNum.MUD, pixNum.SILT, pixNum.WET_ASH, pixNum.WATER, pixNum.ICE, pixNum.SNOW, pixNum.STEAM, pixNum.PUMP, pixNum.FREEZER])) {
                nextGrid[y][x] = pixNum.ACTIVATED_SPONGY_RICE;
            } else fall(x, y, 1, 1, isPassableFluid);
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(240, 240, 230)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'spongy_rice',
        numId: 0
    },
    activated_spongy_rice: {
        name: 'Activated Spongy Rice',
        description: '',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(240, 240, 230)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(230, 230, 230)';
                gridnoisectx.fillStyle = 'rgb(245, 245, 220)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) {
            // lazy code moment
            // probably will replace with better ellipse drawing algorithm that can do rotated ellipses
            draw_ellipse((x, y) => {
                if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) nextGrid[y][x] = pixNum.EXPANDED_SPONGY_RICE;
            }, x, y, Math.ceil(random(1, 20)), Math.ceil(random(0, 20)));
            // floodfill moment
            let visited = new Set();
            function positionHash(x, y) {
                return y * gridWidth + x;
            };
            function badFloodfill(x, y) {
                visited.add(positionHash(x, y));
                if (nextGrid[y][x] == pixNum.EXPANDED_SPONGY_RICE) return;
                nextGrid[y][x] = pixNum.EXPANDED_SPONGY_RICE;
                // if (grid[y][x] == pixNum.SPONGY_RICE) nextGrid[y][x] = pixNum.ACTIVATED_SPONGY_RICE;
                if (x > 0 && !visited.has(positionHash(x - 1, y))) badFloodfill(x - 1, y);
                if (y > 0 && !visited.has(positionHash(x, y - 1))) badFloodfill(x, y - 1);
                if (x < gridWidth - 1 && !visited.has(positionHash(x + 1, y))) badFloodfill(x + 1, y);
                if (y < gridHeight - 1 && !visited.has(positionHash(x, y + 1))) badFloodfill(x, y + 1);
            };
            badFloodfill(x, y);
            nextGrid[y][x] = pixNum.EXPANDED_SPONGY_RICE;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'activated_spongy_rice',
        numId: 0
    },
    expanded_spongy_rice: {
        name: 'Expanded Spongy Rice',
        description: '',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (noNoise) {
                ctx.fillStyle = 'rgb(240, 240, 230)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                });
            } else {
                ctx.fillStyle = 'rgb(230, 230, 230)';
                gridnoisectx.fillStyle = 'rgb(245, 245, 220)';
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    fillPixels(x, y, width, height, gridnoisectx);
                });
            }
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'expanded_spongy_rice',
        numId: 0
    },
    lag_spike_generator: {
        name: 'lag_spike_generator',
        description: 'Not that laggy',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        fillPixels(x + i, y + j, 1, 1, ctx);
                        ctx.fillStyle = `rgb(125, 255, 0, ${(random() * 0.6 + 0.4)})`;
                        fillPixels(x + i, y + j, 1, 1, ctx);
                    }
                }
            });
        },
        update: function (x, y) {
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.5) {
                    nextGrid[ay][ax] = pixNum.LAG_SPIKE_GENERATOR;
                }
                if (validChangingPixel(ax, ay) && random() < 0.025) {
                    nextGrid[ay][ax] = pixNum.PUMP;
                }
                if (validChangingPixel(ax, ay) && random() < 0.025) {
                    nextGrid[ay][ax] = pixNum.CLONER_DOWN;
                }
            });
            updateTouchingPixel(x, y, pixNum.LAG_SPIKE_GENERATOR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.005) {
                    nextGrid[ay][ax] = pixNum.NUKE;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(125, 255, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 15,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'lag_spike_generator',
        numId: 0
    },
    corruption: {
        name: '�',
        description: '<span style="color: red">�</span>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            // corruption rewrite even though it was working as intended, it was just bad code
            // oh wait it's supposed to be bad so it lags
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    camera.shakeIntensity += random(0, 0.1);
                    let randiter = random(0, 5);
                    for (let i = 0; i < randiter; i++) {
                        // this code is borken lol
                        ctx.save();
                        ctx.translate(random(-10 * drawScale, 10 * drawScale) + (x2 + 1 / 2) * drawScale - camera.x, random(-10 * drawScale, 10 * drawScale) + (y2 + 1 / 2) * drawScale - camera.y);
                        ctx.transform(1, random(-Math.PI / 6, Math.PI / 6), random(-Math.PI / 6, Math.PI / 6), 1, 0, 0);
                        ctx.rotate(random(0, 2 * Math.PI));
                        let borkWidth = random(0, 2);
                        let borkHeight = random(0, 1);
                        ctx.fillStyle = 'rgb(0, 0, 0)';
                        fillPixels(0, 0, borkWidth, borkHeight, ctx);
                        ctx.fillStyle = `rgba(100, 255, 0, ${random(0.4, 1)})`;
                        fillPixels(0, 0, borkWidth, borkHeight, ctx);
                        ctx.restore();
                    }
                    if (random() < 0.02) {
                        randiter = random(1, 5);
                        for (let i = 0; i < randiter; i++) {
                            ctx.save();
                            ctx.translate(random(-10 * drawScale, 10 * drawScale) + (x2 + 1 / 2) * drawScale - camera.x, random(-10 * drawScale, 10 * drawScale) + (y2 + 1 / 2) * drawScale - camera.y);
                            ctx.rotate(random(0, 2 * Math.PI));
                            drawPixels(pixNum.MISSING, [[0, 0, 1, 1, true]], ctx, true);
                            ctx.restore();
                        }
                        ctx.save();
                        ctx.translate(random(-20 * drawScale, 20 * drawScale) + (x2 + 1 / 2) * drawScale - camera.x, random(-20 * drawScale, 20 * drawScale) + (y2 + 1 / 2) * drawScale - camera.y);
                        ctx.transform(1, random(-Math.PI / 6, Math.PI / 6), random(-Math.PI / 6, Math.PI / 6), 1, 0, 0);
                        ctx.rotate(random(0, 2 * Math.PI));
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                        ctx.fillRect(0, 0, 90, 90);
                        ctx.fillStyle = 'rgb(255, 255, 0)';
                        ctx.fillRect(10, 10, 70, 70);
                        ctx.fillStyle = 'rgb(255, 0, 0)';
                        ctx.fillRect(40, 20, 10, 30);
                        ctx.fillRect(40, 60, 10, 10);
                        ctx.restore();
                        abovectx.globalAlpha = 1;
                        abovectx.fillStyle = 'rgb(255, 0, 0)';
                        drawLaserPath(getLaserPath(x2, y2, Math.floor(random(0, 5))));
                    }
                });
            });
        },
        update: function (x, y) {
            function chaos(ax, ay) {
                if (validChangingPixel(ax, ay) && random() < 0.2) {
                    nextGrid[ay][ax] = pixNum.CORRUPTION;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LAVA;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.WATER;
                }
                if (validChangingPixel(ax, ay) && random() < 0.2) {
                    nextGrid[ay][ax] = pixNum.MISSING;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.AIR;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PUMP;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LAVA_GENERATOR;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.FREEZER;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PUSH_CLONER_DOWN;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PUSH_CLONER_LEFT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PUSH_CLONER_RIGHT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PUSH_CLONER_UP;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PISTON_LEFT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PISTON_RIGHT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PISTON_UP;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.PISTON_DOWN;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LASER_LEFT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LASER_UP;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LASER_RIGHT;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.LASER_DOWN;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.MIRROR_1;
                }
                if (validChangingPixel(ax, ay) && random() < 0.1) {
                    nextGrid[ay][ax] = pixNum.MIRROR_2;
                }
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    nextGrid[ay][ax] = pixNum[`MUSIC_${Math.floor(random() * 86) + 1}`];
                }
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    nextGrid[ay][ax] = pixNum.NUKE;
                }
                if (validChangingPixel(ax, ay) && random() < 0.02) {
                    nextGrid[ay][ax] = pixNum.HUGE_NUKE;
                }
                if (validChangingPixel(ax, ay) && random() < 0.01) {
                    nextGrid[ay][ax] = pixNum.VERY_HUGE_NUKE;
                }
                if (validChangingPixel(ax, ay) && random() < 0.001) {
                    nextGrid[ay][ax] = pixNum.SPIN;
                }
                if (random() < 0.1) {
                    nextFireGrid[ay][ax] = true;
                }
                teamGrid[y][x] = Math.floor(random(0, 3));
                move(Math.min(Math.max(Math.round(random(x - 5, x + 5)), 0), gridWidth - 1), Math.min(Math.max(Math.round(random(y - 5, y + 5)), 0), gridHeight - 1), Math.min(Math.max(Math.round(random(x - 5, x + 5)), 0), gridWidth - 1), Math.min(Math.max(Math.round(random(y - 5, y + 5)), 0), gridHeight - 1));
            };
            updateTouchingPixel(x, y, pixNum.AIR, chaos);
            updateTouchingAnything(x, y, chaos);
            let path = getLaserPath(x, y, Math.floor(random() * 4));
            let last = path[path.length - 1];
            if (last[2] < 0 || last[2] >= gridWidth || last[3] < 0 || last[3] >= gridHeight) return;
            if (random() < pixelAt(last[2], last[3]).flammability / 100) {
                if (grid[last[3]][last[2]] >= pixNum.LASER_LEFT && grid[last[3]][last[2]] <= pixNum.LASER_DOWN) {
                    teamGrid[last[3]][last[2]] = 0;
                    explode(last[2], last[3], 5, true);
                }
                if (grid[last[3]][last[2]] != pixNum.LASER_SCATTERER) {
                    nextGrid[last[3]][last[2]] = pixNum.AIR;
                    teamGrid[last[3]][last[2]] = 0;
                }
            } else if (random() < pixelAt(last[2], last[3]).flammability / 100) nextFireGrid[last[3]][last[2]] = true;
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: NaN,
        flammability: NaN,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'corruption',
        numId: 0
    },
    spin: {
        name: 'Spin',
        description: 'SPINNY CARRIER GO WEEEEEEEEEEEEEEEEEEEEEEEEE!!!!',
        draw: function (rectangles, ctx, avoidGrid) {
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    ctx.translate((x2 + 1 / 2) * drawScale - camera.x, (y2 + 1 / 2) * drawScale - camera.y);
                    ctx.rotate(random(0, 2 * Math.PI));
                });
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: false,
        group: 3,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'spin',
        numId: 0
    },
    life: {
        name: 'Conway\'s Game of Life',
        description: 'Might as well rename the game to "Life Pixel Simulator"',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = backgroundColor;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.globalCompositeOperation = 'difference';
            ctx.fillStyle = 'rgb(255, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
            ctx.globalCompositeOperation = 'source-over';
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (grid[y][x] == pixNum.LIFE) {
                nextGrid[y][x] = pixNum.LIFE;
                let neighbors = 0;
                let ym = Math.min(gridHeight - 1, y + 1);
                let xm = Math.min(gridWidth - 1, x + 1);
                for (let y2 = Math.max(0, y - 1); y2 <= ym; y2++) {
                    for (let x2 = Math.max(0, x - 1); x2 <= xm; x2++) {
                        if (x2 == x && y2 == y) continue;
                        if (grid[y2][x2] == pixNum.LIFE) {
                            neighbors++;
                        } else if (grid[y2][x2] == pixNum.AIR && validChangingPixel(x2, y2)) {
                            this.update(x2, y2);
                        }
                    }
                }
                if (neighbors < 2 || neighbors > 3) nextGrid[y][x] = pixNum.AIR;
            } else {
                nextGrid[y][x] = pixNum.AIR;
                let neighbors = 0;
                let ym = Math.min(gridHeight - 1, y + 1);
                let xm = Math.min(gridWidth - 1, x + 1);
                for (let y2 = Math.max(0, y - 1); y2 <= ym; y2++) {
                    for (let x2 = Math.max(0, x - 1); x2 <= xm; x2++) {
                        if (x2 == x && y2 == y) continue;
                        if (grid[y2][x2] == pixNum.LIFE) {
                            neighbors++;
                        }
                    }
                }
                if (neighbors == 3) nextGrid[y][x] = pixNum.LIFE;
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(20, 10, 10, 10);
            ctx.fillRect(10, 20, 10, 10);
            ctx.fillRect(30, 20, 10, 10);
            ctx.fillRect(20, 30, 20, 10);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 8,
        flammability: 17,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'life',
        numId: 0
    },
    pink_sand: {
        name: 'Pink Sand',
        description: 'Weird pink powdery stuff that falls up<br><i>Made with <a href="https://todepond.gitbook.io/spacetode/" target=_blank>SpaceTode</a></i>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'hotpink';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (updateTouchingPixel(x, y, pixNum.SAND)) {
                explode(x, y, 80, true);
                return;
            }
            for (const rule of this.processedRules) {
                if (rule.predicates.every(p => x + p[0] >= 0 && x + p[0] < gridWidth && y + p[1] >= 0 && y + p[1] < gridHeight && p[2](x + p[0], y + p[1]))) {
                    rule.results.forEach(r => x + r[0] >= 0 && x + r[0] < gridWidth && y + r[1] >= 0 && y + r[1] < gridHeight && r[2](x + r[0], y + r[1]));
                    return;
                }
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'hotpink';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () {
            // SpaceTode I guess (no im not implementing the whole thing) (some of it has been edited, the "." now means any fluid)
            let mapPredicate = (char) => {
                switch (char) {
                    case ' ':
                        return () => true;
                    case '@':
                        return () => true;
                    case '_':
                        return (x, y) => grid[y][x] == pixNum.AIR || grid[y][x] == pixNum.DELETER;
                    case '.':
                        return isPassableFluid;
                    case '#':
                        return (x, y) => !isAir(x, y);
                    case '$':
                        return (x, y) => grid[y][x] == this.numId;
                    default:
                        throw new Error('Unknown Red SpaceTode predicate "' + char + '"');
                }
            };
            let mapResult = (char) => {
                switch (char) {
                    case '@':
                        return (x, y) => nextGrid[y][x] = this.numId;
                    case '_':
                        return (x, y) => nextGrid[y][x] = pixNum.AIR;
                    case ' ':
                        return () => { };
                    case '.':
                        return () => { };
                    default:
                        throw new Error('Unknown Red SpaceTode result "' + char + '"');
                }
            };
            parseRules: for (const rule of this.rules) {
                const layers = rule.split('\n').slice(1);
                if (!layers[0].includes(' => ')) continue;
                let splitLoc = layers[0].indexOf(' => ');
                let centerX = -1;
                let centerY = -1;
                for (let i in layers) {
                    layers[i] = [layers[i].substring(0, splitLoc), layers[i].substring(splitLoc + 4)];
                    if (layers[i][0].includes('@')) {
                        if (centerX != -1) continue parseRules;
                        centerX = layers[i][0].indexOf('@');
                        centerY = parseInt(i); // CURSE YOU STRING INDICES
                    }
                }
                if (centerX == -1) continue;
                const processedRule = {
                    predicates: [],
                    results: []
                };
                for (let y in layers) {
                    for (let x in layers[y][0]) {
                        processedRule.predicates.push([parseInt(x) - centerX, parseInt(y) - centerY, mapPredicate(layers[y][0][x])]);
                    }
                    for (let x in layers[y][1]) {
                        processedRule.results.push([parseInt(x) - centerX, parseInt(y) - centerY, mapResult(layers[y][1][x])]);
                    }
                }
                this.processedRules.push(processedRule);
            }
        },
        rules: [`
_ => @
@    _`, `
#_ => .@
@_    _.`, `
_# => @.
_@    ._`],
        processedRules: [],
        recipe: {
            sand: 999999999,
            color_red: 999999999,
            very_huge_nuke: 999999999
        },
        craftAmount: 0.1,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: true,
        rotateable: false,
        collectible: true,
        group: 3,
        updateStage: 5,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'sand',
        numId: 0
    },
    placementUnRestriction: {
        name: 'Allow Placement',
        description: 'Allow modification of a region within puzzles and multiplayer',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 5,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'placementUnRestriction',
        numId: 0
    },
    placementRestriction: {
        name: 'Prevent Placement',
        description: 'Restrict modification of a region in puzzles and multiplayer',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            let scale = gridScale * camera.scale;
            // could add a buffer area around the edges and actually snap the canvas to the nearest pixel
            // also scale the canvas correctly
            // could eliminate the trippy illusion when the camera moves while preserving performance
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                ctx.drawImage(this.prerenderedFrames[0], x * scale - camera.x, y * scale - camera.y, width * scale, height * scale, x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
            });
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
            const { ctx, fillPixels, clearPixels, toImage } = new PreRenderer(canvasResolution);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.rotate(-Math.PI / 4);
            let rt2 = Math.sqrt(2);
            for (let i = 0; i <= 50; i++) {
                ctx.clearRect(-rt2 * canvasResolution / 2, ((i / 25) * rt2 * canvasResolution / 2) - 3, rt2 * canvasResolution, 6);
            }
            ctx.resetTransform();
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 5,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'placementRestriction',
        numId: 0
    },
    monster: {
        name: 'Monster',
        description: 'The bad pixels in challenge puzzles',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
        },
        update: function (x, y) {
            if (grid[y][x] != pixNum.AIR) {
                grid[y][x] = pixNum.AIR;
                monsterGrid[y][x] = false;
                nextFireGrid[y][x] = false;
                teamGrid[y][x] = 0;
            } else if (y < gridHeight - 1 && isPassableFluid(x, y + 1) && canMoveTo(x, y + 1) && !monsterGrid[y + 1][x]) {
                if (grid[y + 1][x] == pixNum.DELETER) {
                    nextGrid[y][x] = pixNum.AIR;
                    monsterGrid[y][x] = false;
                    nextFireGrid[y][x] = false;
                    teamGrid[y][x] = 0;
                } else {
                    nextGrid[y][x] = grid[y + 1][x];
                    nextGrid[y + 1][x] = grid[y][x];
                    monsterGrid[y + 1][x] = true;
                    monsterGrid[y][x] = false;
                    let temp = fireGrid[y][x];
                    fireGrid[y][x] = fireGrid[y + 1][x];
                    fireGrid[y + 1][x] = temp;
                    temp = teamGrid[y][x];
                    teamGrid[y][x] = teamGrid[y + 1][x];
                    teamGrid[y + 1][x] = temp;
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
            const { ctx, fillPixels, toImage } = new PreRenderer(60);
            ctx.fillStyle = 'rgb(200, 20, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 30, 0)';
            fillPixels(1 / 6, 1 / 6, 2 / 3, 2 / 3);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 6, 1 / 5, 1 / 5, 1 / 5);
            fillPixels(19 / 30, 1 / 5, 1 / 5, 1 / 5);
            fillPixels(1 / 4, 3 / 5, 1 / 2, 1 / 6);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 2,
        flammability: 20,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 5,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'monster',
        numId: 0
    },
    goal: {
        name: 'Goal',
        description: 'Must be pushed into targets in puzzles',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 200, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(255, 240, 0)';
            abovectx.globalAlpha = 0.2;
            abovectx.fillStyle = 'rgb(255, 180, 0)';
            let margin = (Math.sin(deltaTime * Math.PI / 120) + 1) / 4;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 5, y2 + 1 / 5, 3 / 5, 3 / 5, ctx);
                    !noAnimations && fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                });
            });
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
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 5,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'goal',
        numId: 0
    },
    target: {
        name: 'Target',
        description: 'Goal pixels must be pushed into it in puzzles',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.2;
                abovectx.fillStyle = 'rgb(0, 255, 255)';
                let margin = (Math.sin(deltaTime * Math.PI / 120) + 1) / 4;
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    if (!noAnimations) forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
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
            const { ctx, fillPixels, clearPixels, toImage } = new PreRenderer(5);
            ctx.fillStyle = 'rgb(0, 200, 255)';
            fillPixels(0, 0, 1, 1);
            clearPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 5,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'target',
        numId: 0
    },
    pixelite_crystal: {
        name: 'Pixelite Crystal',
        description: 'Destroy it to win Pixelite Crash! (totally not a Corsair LL120 with some Noctua Chromax things)',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[Math.floor(deltaTime / 4) % 24], ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.beginPath();
            ctx.moveTo(14, 0);
            ctx.lineTo(36, 0);
            ctx.lineTo(50, 14);
            ctx.lineTo(50, 36);
            ctx.lineTo(36, 50);
            ctx.lineTo(14, 50);
            ctx.lineTo(0, 36);
            ctx.lineTo(0, 14);
            ctx.lineTo(14, 0);
            ctx.fill();
            ctx.fillRect(3, 3, 3, 3);
            ctx.fillRect(44, 3, 3, 3);
            ctx.fillRect(44, 44, 3, 3);
            ctx.fillRect(3, 44, 3, 3);
            let gradient = ctx.createConicGradient(0, 25, 25);
            for (let i = 0; i <= 18; i++) {
                gradient.addColorStop(i / 18, `hsl(${i * 20}, 80%, 50%)`);
            }
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(25, 25, 22, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.beginPath();
            ctx.arc(25, 25, 8, 0, 2 * Math.PI);
            ctx.fill();
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(90);
            let addRender = (angle) => {
                ctx.fillStyle = 'rgb(200, 200, 200)';
                fillPixels(0, 0, 1, 1);
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.beginPath();
                ctx.moveTo(25, 0);
                ctx.lineTo(65, 0);
                ctx.lineTo(90, 25);
                ctx.lineTo(90, 65);
                ctx.lineTo(65, 90);
                ctx.lineTo(25, 90);
                ctx.lineTo(0, 65);
                ctx.lineTo(0, 25);
                ctx.lineTo(25, 0);
                ctx.fill();
                ctx.fillRect(5, 5, 5, 5);
                ctx.fillRect(80, 5, 5, 5);
                ctx.fillRect(80, 80, 5, 5);
                ctx.fillRect(5, 80, 5, 5);
                let gradient = ctx.createConicGradient(angle, 45, 45);
                for (let i = 0; i <= 18; i++) {
                    gradient.addColorStop(i / 18, `hsl(${i * 20}, 80%, 50%)`);
                }
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(45, 45, 40, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.beginPath();
                ctx.arc(45, 45, 15, 0, 2 * Math.PI);
                ctx.fill();
                this.prerenderedFrames.push(toImage());
            };
            for (let i = 0; i < 24; i++) {
                addRender(Math.PI * i / 12);
            }
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 19,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'pixelite_crystal',
        numId: 0
    },
    collector: {
        name: 'Collector',
        description: 'Collects',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (avoidGrid) {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    if (redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
                });
            } else {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    if (redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                        imagePixels(x2, y2, 1, 1, this.prerenderedFrames[teamGrid[y2][x2]], ctx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (teamGrid[y][x] == 0 || updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            updateTouchingAnything(x, y, (ax, ay) => {
                if (validChangingPixel(ax, ay) && pixelAt(ax, ay).collectible && random() < 0.1) {
                    teamPixelAmounts[teamGrid[y][x] - 1][numPixels[grid[ay][ax]].id]++;
                    nextGrid[ay][ax] = pixNum.AIR;
                    teamGrid[ay][ax] = 0;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(80, 80, 80)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 30px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 25, 25);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(120);
            ctx.fillStyle = 'rgb(80, 80, 80)';
            fillPixels(0, 0, 1, 1);
            ctx.font = 'bold 75px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0000';
            ctx.fillText('?', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0099';
            ctx.fillText('α', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#3C70FF';
            ctx.fillText('β', 60, 60);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_black: 16,
            color_red: 4,
            color_blue: 4,
            steel: 2,
            steel_crate: 1,
            concrete: 8,
            sticky_piston_any: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 2,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'collector',
        numId: 0
    },
    instant_collector: {
        name: 'Instant Collector',
        description: 'Collects but fast',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (avoidGrid) {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    if (redrawing || forceRedraw) imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
                });
            } else {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    if (redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                        imagePixels(x2, y2, 1, 1, this.prerenderedFrames[teamGrid[y2][x2]], ctx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (teamGrid[y][x] == 0 || updateTouchingPixel(x, y, pixNum.CLONER_DEACTIVATOR)) return;
            updateTouchingAnything(x, y, (ax, ay) => {
                if (validChangingPixel(ax, ay) && pixelAt(ax, ay).collectible) {
                    teamPixelAmounts[teamGrid[y][x] - 1][numPixels[grid[ay][ax]].id]++;
                    nextGrid[ay][ax] = pixNum.AIR;
                    teamGrid[ay][ax] = 0;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(140, 140, 140)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 30px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 25, 25);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(120);
            ctx.fillStyle = 'rgb(140, 140, 140)';
            fillPixels(0, 0, 1, 1);
            ctx.font = 'bold 75px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0000';
            ctx.fillText('?', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0099';
            ctx.fillText('α', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#3C70FF';
            ctx.fillText('β', 60, 60);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_violet: 16,
            color_grey: 8,
            collector: 1,
            steel: 4,
            concrete: 8,
            sticky_piston_any: 4,
            rotator_clockwise: 2,
            rotator_counterclockwise: 2
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 14,
        flammability: 2,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 0,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'instant_collector',
        numId: 0
    },
    generic_color_well: {
        name: 'Rainbow Color Well',
        description: 'A portal to the color vats hidden within the machinery of the Simulator',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(0, 100%, 50%)` : `hsl(${(deltaTime * 2) % 360}, 100%, 50%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 4, y2 + 1 / 4, 1 / 2, 1 / 2, ctx);
                });
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.5 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = `hsl(${(deltaTime * 2) % 360}, 100%, 50%)`;
                let margin = ((deltaTime % 60) / 60);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    nextGrid[ay][ax] = Math.floor(random(pixNum.COLOR_RED, pixNum.COLOR_BROWN + 1));
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            let gradient = ctx.createLinearGradient(25 / 2, 25 / 2, 75 / 2, 75 / 2);
            for (let i = 0; i <= 360; i += 6) {
                gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(25 / 2, 25 / 2, 25, 25);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'generic_color_well',
        numId: 0
    },
    warm_color_well: {
        name: 'Warm Color Well',
        description: 'A portal to the warmer color vats hidden within the machinery of the Simulator',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(60, 100%, 50%)` : `hsl(${Math.round(((Math.sin(deltaTime * Math.PI / 60) + 6) % 6) * 60)}, 100%, 50%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 4, y2 + 1 / 4, 1 / 2, 1 / 2, ctx);
                });
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.5 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = noAnimations ? `hsl(60, 100%, 50%)` : `hsl(${Math.round(((Math.sin(deltaTime * Math.PI / 60) + 6) % 6) * 60)}, 100%, 50%)`;
                let margin = ((deltaTime % 60) / 60);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    let pix = Math.floor(random(pixNum.COLOR_RED, pixNum.COLOR_LIME + 1));
                    nextGrid[ay][ax] = pix == pixNum.COLOR_LIME ? pixNum.COLOR_VIOLET : pix;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            let gradient = ctx.createLinearGradient(25 / 2, 25 / 2, 75 / 2, 75 / 2);
            gradient.addColorStop(0, 'rgb(255, 0, 255)');
            gradient.addColorStop(0.5, 'rgb(255, 0, 0)');
            gradient.addColorStop(1, 'rgb(255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(25 / 2, 25 / 2, 25, 25);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'warm_color_well',
        numId: 0
    },
    cool_color_well: {
        name: 'Cool Color Well',
        description: 'A portal to the cooler color vats hidden within the machinery of the Simulator',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(240, 100%, 50%)` : `hsl(${Math.round((Math.sin(deltaTime * Math.PI / 60) + 3) * 60)}, 100%, 50%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 4, y2 + 1 / 4, 1 / 2, 1 / 2, ctx);
                });
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.5 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = noAnimations ? `hsl(240, 100%, 50%)` : `hsl(${Math.round((Math.sin(deltaTime * Math.PI / 60) + 3) * 60)}, 100%, 50%)`;
                let margin = ((deltaTime % 60) / 60);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    nextGrid[ay][ax] = Math.floor(random(pixNum.COLOR_LIME, pixNum.COLOR_BLUE + 1));
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            let gradient = ctx.createLinearGradient(25 / 2, 25 / 2, 75 / 2, 75 / 2);
            gradient.addColorStop(0, 'rgb(0, 255, 0)');
            gradient.addColorStop(0.5, 'rgb(0, 255, 255)');
            gradient.addColorStop(1, 'rgb(0, 0, 255)');
            ctx.fillStyle = gradient;
            ctx.fillRect(25 / 2, 25 / 2, 25, 25);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'cool_color_well',
        numId: 0
    },
    monochrome_color_well: {
        name: 'Monochrome Color Well',
        description: 'A portal to the colorless vats hidden within the machinery of the Simulator (only monochrome black though)',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(0, 0%, 50%)` : `hsl(0, 0%, ${Math.round(Math.sin(deltaTime * Math.PI / 60) * 50 + 50)}%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 4, y2 + 1 / 4, 1 / 2, 1 / 2, ctx);
                });
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.5 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = noAnimations ? `hsl(0, 0%, 50%)` : `hsl(0, 0%, ${Math.round(Math.sin(deltaTime * Math.PI / 60) * 50 + 50)}%)`;
                let margin = ((deltaTime % 60) / 60);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (validChangingPixel(ax, ay) && random() < 0.05) {
                    nextGrid[ay][ax] = Math.floor(random(pixNum.COLOR_GREY, pixNum.COLOR_BLACK + 1));
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
            let gradient = ctx.createLinearGradient(25 / 2, 25 / 2, 75 / 2, 75 / 2);
            gradient.addColorStop(0, 'hsl(0, 100%, 100%)');
            gradient.addColorStop(1, 'hsl(0, 100%, 0%)');
            ctx.fillStyle = gradient;
            ctx.fillRect(25 / 2, 25 / 2, 25, 25);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 20,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'monochrome_color_well',
        numId: 0
    },
    passive_color_generator: {
        name: 'Passive Color Generator',
        description: 'An artificial portal to the internal machinery of the Simulator<br><i>Not as efficient as collecting from a well</i>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(140, 140, 140)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(0, 80%, 75%)` : `hsl(${(deltaTime * 2) % 360}, 80%, 75%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 5, y2 + 1 / 5, 3 / 5, 3 / 5, ctx);
                });
            });
            ctx.fillStyle = 'rgb(180, 180, 180)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 + 2 / 5, y2 + 1 / 5, 1 / 5, 3 / 5, ctx);
                        fillPixels(x2 + 1 / 5, y2 + 2 / 5, 3 / 5, 1 / 5, ctx);
                    });
                }
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.3 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = `hsl(${(deltaTime * 2) % 360}, 100%, 50%)`;
                let margin = ((deltaTime % 60) / 120);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let restrictions = [];
            if (updateTouchingPixel(x, y, pixNum.COLOR_GENERATOR_FILTER, (ax, ay) => {
                return updateTouchingAnything(ax, ay, (bx, by) => {
                    // probably better than supplying an array that's annoying to maintain to updateTouchingPixel
                    if (grid[by][bx] >= pixNum.COLOR_RED && grid[by][bx] <= pixNum.COLOR_BROWN) {
                        restrictions.push(grid[by][bx]);
                        return true;
                    }
                    return false;
                });
            })) {
                updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                    if (validChangingPixel(ax, ay) && random() < 0.02) {
                        nextGrid[ay][ax] = restrictions[Math.floor(random(0, restrictions.length))];
                    }
                });
            } else {
                updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                    if (validChangingPixel(ax, ay) && random() < 0.02) {
                        nextGrid[ay][ax] = Math.floor(random(pixNum.COLOR_RED, pixNum.COLOR_BROWN + 1));
                    }
                });
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(140, 140, 140)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'hsl(0, 80%, 75%)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 180, 180)';
            ctx.fillRect(20, 10, 10, 30);
            ctx.fillRect(10, 20, 30, 10);
        },
        prerender: function () { },
        recipe: {
            color_red: 1,
            color_orange: 1,
            color_yellow: 1,
            color_lime: 1,
            color_green: 1,
            color_cyan: 1,
            color_blue: 1,
            color_violet: 1,
            color_grey: 1,
            color_black: 1,
            color_brown: 1,
            steel: 8,
            concrete: 8,
            reinforced_glass: 4,
            laser_any: 1,
            mirror_any: 3,
            laser_scatterer: 1,
            cloner_any: 11,
            freezer: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 19,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'passive_color_generator',
        numId: 0
    },
    active_color_generator: {
        name: 'Active Color Generator',
        description: 'An artificial portal to the internal machinery of the Simulator<br><i>Requires water to cool its more powerful singularity generator; <span style="color: red; font-weight: bold;">will blow up if it runs out of water!</span></i>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(140, 140, 140)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = noAnimations ? `hsl(0, 100%, 50%)` : `hsl(${(deltaTime * 2) % 360}, 100%, 50%)`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) forEachPixel(x, y, width, height, (x2, y2) => {
                    fillPixels(x2 + 1 / 5, y2 + 1 / 5, 3 / 5, 3 / 5, ctx);
                });
            });
            ctx.fillStyle = 'rgb(180, 180, 180)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) {
                    let end = y + height;
                    for (let i = y; i < end; i++) {
                        fillPixels(x, i + 2 / 5, width, 1 / 5, ctx);
                    }
                    end = x + width;
                    for (let i = x; i < end; i++) {
                        fillPixels(i + 2 / 5, y, 1 / 5, height, ctx);
                    }
                }
            });
            if (!noAnimations) {
                abovectx.globalAlpha = 0.5 * (1 - ((deltaTime % 60) / 60));
                abovectx.fillStyle = `hsl(${(deltaTime * 2) % 360}, 100%, 50%)`;
                let margin = ((deltaTime % 60) / 120);
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        fillPixels(x2 - margin, y2 - margin, 1 + margin * 2, 1 + margin * 2, abovectx);
                    });
                });
            }
            if (!avoidGrid) forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    let team = teamGrid[y2][x2] - 1;
                    if (team == PixSimAPI.team && teamPixelAmounts[team] !== undefined) {
                        if (teamPixelAmounts[team].water <= 0) {
                            abovectx.globalAlpha = (1 - ((deltaTime % 45) / 45));
                            abovectx.fillStyle = 'rgb(255, 0, 0)';
                            let margin = ((deltaTime % 45) / 5);
                            abovectx.translate(x2 * drawScale - camera.x + 0.5 * drawScale, y2 * drawScale - camera.y + 0.4 * drawScale);
                            abovectx.beginPath();
                            abovectx.moveTo(margin * drawScale, 0);
                            abovectx.arc(0, 0, margin * drawScale, 0, 2 * Math.PI);
                            abovectx.fill();
                            abovectx.globalAlpha = 1;
                            abovectx.rotate(Math.random() * 0.4 - 0.2);
                            let scale = (Math.random() + 3) * drawScale;
                            abovectx.strokeStyle = 'rgb(255, 0, 0)';
                            abovectx.fillStyle = 'rgb(255, 255, 0)';
                            abovectx.lineJoin = 'bevel';
                            abovectx.lineCap = 'butt';
                            abovectx.lineWidth = 0.1 * scale;
                            abovectx.beginPath();
                            let hfrt3 = Math.sqrt(3) / 2;
                            abovectx.moveTo(-scale, hfrt3 * scale);
                            abovectx.lineTo(scale, hfrt3 * scale);
                            abovectx.lineTo(0, -hfrt3 * scale);
                            abovectx.lineTo(-scale, hfrt3 * scale);
                            abovectx.lineTo(0, hfrt3 * scale);
                            abovectx.fill();
                            abovectx.stroke();
                            abovectx.lineWidth = 0.2 * scale;
                            abovectx.beginPath();
                            abovectx.moveTo(0, -0.4 * scale);
                            abovectx.lineTo(0, 0.3 * scale);
                            abovectx.moveTo(0, 0.5 * scale);
                            abovectx.lineTo(0, 0.7 * scale);
                            abovectx.stroke();
                            abovectx.resetTransform();
                        } else if (teamPixelAmounts[team].water <= 50) {
                            abovectx.globalAlpha = Math.min(1, Math.sin(deltaTime * Math.PI / 90) * 0.5 + 1);
                            abovectx.translate(x2 * drawScale - camera.x + 0.5 * drawScale, y2 * drawScale - camera.y + 0.4 * drawScale);
                            let scale = (Math.sin(deltaTime * Math.PI / 90) * 1.5 + 3) * drawScale;
                            abovectx.strokeStyle = 'rgb(255, 0, 0)';
                            abovectx.fillStyle = 'rgb(255, 255, 0)';
                            abovectx.lineJoin = 'bevel';
                            abovectx.lineCap = 'butt';
                            abovectx.lineWidth = 0.05 * scale;
                            abovectx.beginPath();
                            let hfrt3 = Math.sqrt(3) / 2;
                            abovectx.moveTo(-scale * 0.5, hfrt3 * scale * 0.5);
                            abovectx.lineTo(scale * 0.5, hfrt3 * scale * 0.5);
                            abovectx.lineTo(0, -hfrt3 * scale * 0.5);
                            abovectx.lineTo(-scale * 0.5, hfrt3 * scale * 0.5);
                            abovectx.lineTo(0, hfrt3 * scale * 0.5);
                            abovectx.fill();
                            abovectx.stroke();
                            abovectx.lineWidth = 0.1 * scale;
                            abovectx.beginPath();
                            abovectx.moveTo(0, -0.2 * scale);
                            abovectx.lineTo(0, 0.15 * scale);
                            abovectx.moveTo(0, 0.25 * scale);
                            abovectx.lineTo(0, 0.35 * scale);
                            abovectx.stroke();
                            abovectx.resetTransform();
                        }
                    }
                });
            });
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            let team = teamGrid[y][x] - 1;
            if (teamPixelAmounts[team] !== undefined) {
                if (teamPixelAmounts[team].water > 0) {
                    let restrictions = [];
                    if (updateTouchingPixel(x, y, pixNum.COLOR_GENERATOR_FILTER, (ax, ay) => {
                        return updateTouchingAnything(ax, ay, (bx, by) => {
                            // probably better than supplying an array that's annoying to maintain to updateTouchingPixel
                            if (grid[by][bx] >= pixNum.COLOR_RED && grid[by][bx] <= pixNum.COLOR_BROWN) {
                                restrictions.push(grid[by][bx]);
                                return true;
                            }
                            return false;
                        });
                    })) {
                        updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                            if (validChangingPixel(ax, ay) && random() < 0.04) {
                                nextGrid[ay][ax] = restrictions[Math.floor(random(0, restrictions.length))];
                            }
                        });
                    } else {
                        updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                            if (validChangingPixel(ax, ay) && random() < 0.04) {
                                nextGrid[ay][ax] = Math.floor(random(pixNum.COLOR_RED, pixNum.COLOR_BROWN + 1));
                            }
                        });
                    }
                    if (ticks % 10 == 0) {
                        teamPixelAmounts[team].water--;
                        // lag?
                        if (team == PixSimAPI.team) queueUpdatePixelAmount('water', teamPixelAmounts[team]);
                    }
                } else if (random() < 0.03) {
                    explode(x, y, 20, true)
                };
            }
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(140, 140, 140)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'hsl(0, 100%, 50%)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'rgb(180, 180, 180)';
            ctx.fillRect(20, 0, 10, 50);
            ctx.fillRect(0, 20, 50, 10);
        },
        prerender: function () { },
        recipe: {
            passive_color_generator: 1,
            steel: 1,
            laser_any: 2,
            mirror_any: 2,
            freezer: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 19,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'active_color_generator',
        numId: 0
    },
    color_generator_filter: {
        name: 'Color Generator Filter',
        description: 'An attachment for color generators to control which colors are siphoned from the Simulator<br><i>Place in contact with a color generator and a color pixel to restrict the colors the generator will create</i>',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(140, 140, 140)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
            ctx.fillStyle = 'rgb(180, 180, 180)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                let end = y + height;
                for (let i = y; i < end; i++) {
                    fillPixels(x, i + 2 / 5, width, 1 / 5, ctx);
                }
                end = x + width;
                for (let i = x; i < end; i++) {
                    fillPixels(i + 2 / 5, y, 1 / 5, height, ctx);
                }
            });
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                forEachPixel(x, y, width, height, (x2, y2) => {
                    let colors = [];
                    if (!avoidGrid) updateTouchingAnything(x2, y2, (x3, y3) => {
                        if (grid[y3][x3] >= pixNum.COLOR_RED && grid[y3][x3] <= pixNum.COLOR_BROWN) {
                            colors.push(pixelAt(x3, y3).defaultRGB);
                        }
                    });
                    if (colors.length > 0) {
                        let colorSum = colors.reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1], prev[2] + curr[2]], [0, 0, 0]);
                        ctx.fillStyle = `rgb(${colorSum[0] / colors.length}, ${colorSum[1] / colors.length}, ${colorSum[2] / colors.length})`
                        fillPixels(x2 + 1 / 5, y2 + 1 / 5, 3 / 5, 3 / 5, ctx);
                    } else {
                        clearPixels(x2 + 1 / 5, y2 + 1 / 5, 3 / 5, 3 / 5, ctx);
                    }
                });
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(140, 140, 140)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(180, 180, 180)';
            ctx.fillRect(20, 0, 10, 50);
            ctx.fillRect(0, 20, 50, 10);
            let gradient = ctx.createLinearGradient(40, 10, 10, 40);
            for (let i = 0; i <= 360; i += 6) {
                gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(10, 10, 30, 30);
        },
        prerender: function () { },
        recipe: {
            color_grey: 4,
            color_collector: 1,
            steel: 2,
            concrete: 2,
            mirror_any: 6
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 18,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'color_generator_filter',
        numId: 0
    },
    color_red: generateColorPixel({
        color: 'Red',
        rgb0: [255, 80, 80],
        rgb1: [200, 0, 0],
        description: 'Unfortunately it\'s not <i>THE</i> red pixel...'
    }),
    color_orange: generateColorPixel({
        color: 'Orange',
        rgb0: [255, 200, 80],
        rgb1: [220, 200, 0]
    }),
    color_yellow: generateColorPixel({
        color: 'Yellow',
        rgb0: [255, 255, 50],
        rgb1: [230, 230, 0]
    }),
    color_lime: generateColorPixel({
        color: 'Lime',
        rgb0: [80, 255, 80],
        rgb1: [0, 220, 0]
    }),
    color_green: generateColorPixel({
        color: 'Green',
        rgb0: [10, 200, 10],
        rgb1: [0, 160, 0]
    }),
    color_cyan: generateColorPixel({
        color: 'Cyan',
        rgb0: [50, 255, 255],
        rgb1: [0, 200, 200]
    }),
    color_blue: generateColorPixel({
        color: 'Blue',
        rgb0: [80, 80, 255],
        rgb1: [0, 0, 200]
    }),
    color_violet: generateColorPixel({
        color: 'Violet',
        rgb0: [180, 40, 255],
        rgb1: [180, 0, 220]
    }),
    color_grey: generateColorPixel({
        color: 'Grey/Gray',
        rgb0: [120, 120, 120],
        rgb1: [80, 80, 80]
    }),
    color_black: generateColorPixel({
        color: 'Black',
        rgb0: [80, 80, 80],
        rgb1: [0, 0, 0]
    }),
    color_brown: generateColorPixel({
        color: 'Brown',
        rgb0: [140, 80, 30],
        rgb1: [100, 50, 10]
    }),
    color_collector: {
        name: 'Color Collector',
        description: 'Collects colors for the team that placed it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = noAnimations ? `hsl(0, 100%, 50%)` : `hsl(${(deltaTime * 2) % 360}, 80%, 50%)`;
            if (avoidGrid) {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
                });
            } else {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    fillPixels(x, y, width, height, ctx);
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        imagePixels(x2, y2, 1, 1, this.prerenderedFrames[teamGrid[y2][x2]], ctx);
                    });
                });
            }
        },
        update: function (x, y) {
            if (!validChangingPixel(x, y)) return;
            if (teamGrid[y][x] > 0) updateTouchingAnything(x, y, (ax, ay) => {
                if (validChangingPixel(ax, ay) && grid[ay][ax] >= pixNum.COLOR_RED && grid[ay][ax] <= pixNum.COLOR_BROWN) {
                    teamPixelAmounts[teamGrid[y][x] - 1][numPixels[grid[ay][ax]].id]++;
                    nextGrid[ay][ax] = pixNum.AIR;
                    teamGrid[ay][ax] = 0;
                }
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            let gradient = ctx.createConicGradient(0, 25, 25);
            for (let i = 0; i <= 18; i++) {
                gradient.addColorStop(i / 18, `hsl(${i * 20}, 80%, 50%)`);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = '#FF0000';
            ctx.font = 'bold 30px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 25, 25);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(120);
            ctx.font = 'bold 75px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0000';
            ctx.fillText('?', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#FF0099';
            ctx.fillText('α', 60, 60);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(1 / 5, 1 / 5, 3 / 5, 3 / 5);
            ctx.fillStyle = '#3C70FF';
            ctx.fillText('β', 60, 60);
            this.prerenderedFrames.push(toImage());
        },
        recipe: {
            color_black: 12,
            color_red: 1,
            color_orange: 1,
            color_yellow: 1,
            color_lime: 1,
            color_green: 1,
            color_cyan: 1,
            color_blue: 1,
            color_violet: 1,
            steel: 2,
            steel_crate: 1,
            concrete: 8,
            sticky_piston_any: 1
        },
        craftAmount: 1,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 2,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 6,
        updateStage: 6,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'color_collector',
        numId: 0
    },
    teamNone: {
        name: 'Remove Team Marker',
        description: 'Removes team markers from a region',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 255, 255)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(5, 5, 40, 40);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'teamNone',
        numId: 0
    },
    teamAlpha: {
        name: 'Team α Marker',
        description: 'Marks a region to be owned by team α',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FF0099';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = '#FF0099';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(5, 5, 40, 40);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'teamAlpha',
        numId: 0
    },
    teamBeta: {
        name: 'Team β Marker',
        description: 'Marks a region to be owned by team β',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#3C70FF';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = '#3C70FF';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(5, 5, 40, 40);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'teamBeta',
        numId: 0
    },
    missing: {
        name: 'Missing Pixel',
        description: 'Check your save code, it probably has pixels that don\'t exist in it',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
            });
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
            const { ctx, fillPixels, toImage } = new PreRenderer(2);
            ctx.fillStyle = 'rgb(0, 0, 0)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(255, 0, 255)';
            fillPixels(0, 0, 1 / 2, 1 / 2);
            fillPixels(1 / 2, 1 / 2, 1 / 2, 1 / 2);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: -1,
        updateStage: -1,
        animatedNoise: false,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: 'missing',
        numId: 0
    },
    music_1: generateMusicPixel(1, {
        name: 'Square Wave C7 Major Triad Hit',
        description: 'Makes funny C7 Major triad square wave sound that hurts your ears',
        color: 'rgb(100, 255, 0)',
        text: ''
    }),
    music_2: generateMusicPixel(2, {
        name: 'Chip Noise',
        description: 'Makes funny chip noise sound that hurts your ears',
        color: 'rgb(200, 200, 200)',
        text: ''
    }),
    music_3: generateMusicPixel(3, {
        name: 'Click Noise',
        description: 'Makes funny button click sound that hurts your ears',
        color: 'rgb(250, 0, 0)',
        text: ''
    }),
    music_4: generateMusicPixel(4, {
        name: 'Square Wave C₄',
        description: 'Makes funny C₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C4'
    }),
    music_5: generateMusicPixel(5, {
        name: 'Square Wave C♯₄/D♭₄',
        description: 'Makes funny C♯₄/D♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C♯4'
    }),
    music_6: generateMusicPixel(6, {
        name: 'Square Wave D₄',
        description: 'Makes funny D₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'D4'
    }),
    music_7: generateMusicPixel(7, {
        name: 'Square Wave D♯₄/E♭₄',
        description: 'Makes funny D♯₄/E♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E♭4'
    }),
    music_8: generateMusicPixel(8, {
        name: 'Square Wave E₄',
        description: 'Makes funny E₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E4'
    }),
    music_9: generateMusicPixel(9, {
        name: 'Square Wave F₄',
        description: 'Makes funny F₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F4'
    }),
    music_10: generateMusicPixel(10, {
        name: 'Square Wave F♯₄/G♭₄',
        description: 'Makes funny F♯₄/G♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F♯4'
    }),
    music_11: generateMusicPixel(11, {
        name: 'Square Wave G₄',
        description: 'Makes funny G₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'G4'
    }),
    music_12: generateMusicPixel(12, {
        name: 'Square Wave G♯₄/A♭₄',
        description: 'Makes funny G♯₄/A♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A♭4'
    }),
    music_13: generateMusicPixel(13, {
        name: 'Square Wave A₄',
        description: 'Makes funny A₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A4'
    }),
    music_14: generateMusicPixel(14, {
        name: 'Square Wave A♯₄/B♭₄',
        description: 'Makes funny A♯₄/B♭₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B♭4'
    }),
    music_15: generateMusicPixel(15, {
        name: 'Square Wave B₄',
        description: 'Makes funny B₄ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B4'
    }),
    music_16: generateMusicPixel(16, {
        name: 'Square Wave C₅',
        description: 'Makes funny C₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C5'
    }),
    music_17: generateMusicPixel(17, {
        name: 'Square Wave C♯₅/D♭₅',
        description: 'Makes funny C♯₅/D♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C♯5'
    }),
    music_18: generateMusicPixel(18, {
        name: 'Square Wave D₅',
        description: 'Makes funny D₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'D5'
    }),
    music_19: generateMusicPixel(19, {
        name: 'Square Wave D♯₅/E♭₅',
        description: 'Makes funny D♯₅/E♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E♭5'
    }),
    music_20: generateMusicPixel(20, {
        name: 'Square Wave E₅',
        description: 'Makes funny E₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'E5'
    }),
    music_21: generateMusicPixel(21, {
        name: 'Square Wave F₅',
        description: 'Makes funny F₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F5'
    }),
    music_22: generateMusicPixel(22, {
        name: 'Square Wave F♯₅/G♭₅',
        description: 'Makes funny F♯₅/G♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'F♯5'
    }),
    music_23: generateMusicPixel(23, {
        name: 'Square Wave G₅',
        description: 'Makes funny G₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'G5'
    }),
    music_24: generateMusicPixel(24, {
        name: 'Square Wave G♯₅/A♭₅',
        description: 'Makes funny G♯₅/A♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A♭5'
    }),
    music_25: generateMusicPixel(25, {
        name: 'Square Wave A₅',
        description: 'Makes funny A₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'A5'
    }),
    music_26: generateMusicPixel(26, {
        name: 'Square Wave A♯₅/B♭₅',
        description: 'Makes funny A♯₅/B♭₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B♭5'
    }),
    music_27: generateMusicPixel(27, {
        name: 'Square Wave B₅',
        description: 'Makes funny B₅ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'B5'
    }),
    music_28: generateMusicPixel(28, {
        name: 'Square Wave C₆',
        description: 'Makes funny C₆ square wave sound that hurts your ears',
        color: 'rgb(0, 180, 255)',
        text: 'C6'
    }),
    music_29: generateMusicPixel(29, {
        name: 'Sawtooth Wave C₄',
        description: 'Makes funny C₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C4'
    }),
    music_30: generateMusicPixel(30, {
        name: 'Sawtooth Wave C♯₄/D♭₄',
        description: 'Makes funny C♯₄/D♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C♯4'
    }),
    music_31: generateMusicPixel(31, {
        name: 'Sawtooth Wave D₄',
        description: 'Makes funny D₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'D4'
    }),
    music_32: generateMusicPixel(32, {
        name: 'Sawtooth Wave D♯₄/E♭₄',
        description: 'Makes funny D♯₄/E♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E♭4'
    }),
    music_33: generateMusicPixel(33, {
        name: 'Sawtooth Wave E₄',
        description: 'Makes funny E₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E4'
    }),
    music_34: generateMusicPixel(34, {
        name: 'Sawtooth Wave F₄',
        description: 'Makes funny F₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F4'
    }),
    music_35: generateMusicPixel(35, {
        name: 'Sawtooth Wave F♯₄/G♭₄',
        description: 'Makes funny F♯₄/G♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F♯4'
    }),
    music_36: generateMusicPixel(36, {
        name: 'Sawtooth Wave G₄',
        description: 'Makes funny G₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'G4'
    }),
    music_37: generateMusicPixel(37, {
        name: 'Sawtooth Wave G♯₄/A♭₄',
        description: 'Makes funny G♯₄/A♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A♭4'
    }),
    music_38: generateMusicPixel(38, {
        name: 'Sawtooth Wave A₄',
        description: 'Makes funny A₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A4'
    }),
    music_39: generateMusicPixel(39, {
        name: 'Sawtooth Wave A♯₄/B♭₄',
        description: 'Makes funny A♯₄/B♭₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B♭4'
    }),
    music_40: generateMusicPixel(40, {
        name: 'Sawtooth Wave B₄',
        description: 'Makes funny B₄ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B4'
    }),
    music_41: generateMusicPixel(41, {
        name: 'Sawtooth Wave C₅',
        description: 'Makes funny C₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C5'
    }),
    music_42: generateMusicPixel(42, {
        name: 'Sawtooth Wave C♯₅/D♭₅',
        description: 'Makes funny C♯₅/D♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C♯5'
    }),
    music_43: generateMusicPixel(43, {
        name: 'Sawtooth Wave D₅',
        description: 'Makes funny D₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'D5'
    }),
    music_44: generateMusicPixel(44, {
        name: 'Sawtooth Wave D♯₅/E♭₅',
        description: 'Makes funny D♯₅/E♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E♭5'
    }),
    music_45: generateMusicPixel(45, {
        name: 'Sawtooth Wave E₅',
        description: 'Makes funny E₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'E5'
    }),
    music_46: generateMusicPixel(46, {
        name: 'Sawtooth Wave F₅',
        description: 'Makes funny F₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F5'
    }),
    music_47: generateMusicPixel(47, {
        name: 'Sawtooth Wave F♯₅/G♭₅',
        description: 'Makes funny F♯₅/G♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'F♯5'
    }),
    music_48: generateMusicPixel(48, {
        name: 'Sawtooth Wave G₅',
        description: 'Makes funny G₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'G5'
    }),
    music_49: generateMusicPixel(49, {
        name: 'Sawtooth Wave G♯₅/A♭₅',
        description: 'Makes funny G♯₅/A♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A♭5'
    }),
    music_50: generateMusicPixel(50, {
        name: 'Sawtooth Wave A₅',
        description: 'Makes funny A₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'A5'
    }),
    music_51: generateMusicPixel(51, {
        name: 'Sawtooth Wave A♯₅/B♭₅',
        description: 'Makes funny A♯₅/B♭₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B♭5'
    }),
    music_52: generateMusicPixel(52, {
        name: 'Sawtooth Wave B₅',
        description: 'Makes funny B₅ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'B5'
    }),
    music_53: generateMusicPixel(53, {
        name: 'Sawtooth Wave C₆',
        description: 'Makes funny C₆ sawtooth wave sound that hurts your ears',
        color: 'rgb(255, 200, 0)',
        text: 'C6'
    }),
    music_54: generateMusicPixel(54, {
        name: 'Triangle Wave C₄',
        description: 'Makes funny C₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'C4'
    }),
    music_55: generateMusicPixel(55, {
        name: 'Triangle Wave C♯₄/D♭₄',
        description: 'Makes funny C♯₄/D♭₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'C♯4'
    }),
    music_56: generateMusicPixel(56, {
        name: 'Triangle Wave D₄',
        description: 'Makes funny D₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'D4'
    }),
    music_57: generateMusicPixel(57, {
        name: 'Triangle Wave D♯₄/E♭₄',
        description: 'Makes funny D♯₄/E♭₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'E♭4'
    }),
    music_58: generateMusicPixel(58, {
        name: 'Triangle Wave E₄',
        description: 'Makes funny E₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'E4'
    }),
    music_59: generateMusicPixel(59, {
        name: 'Triangle Wave F₄',
        description: 'Makes funny F₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'F4'
    }),
    music_60: generateMusicPixel(60, {
        name: 'Triangle Wave F♯₄/G♭₄',
        description: 'Makes funny F♯₄/G♭₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'F♯4'
    }),
    music_61: generateMusicPixel(61, {
        name: 'Triangle Wave G₄',
        description: 'Makes funny G₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'G4'
    }),
    music_62: generateMusicPixel(62, {
        name: 'Triangle Wave G♯₄/A♭₄',
        description: 'Makes funny G♯₄/A♭₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'A♭4'
    }),
    music_63: generateMusicPixel(63, {
        name: 'Triangle Wave A₄',
        description: 'Makes funny A₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'A4'
    }),
    music_64: generateMusicPixel(64, {
        name: 'Triangle Wave A♯₄/B♭₄',
        description: 'Makes funny A♯₄/B♭₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'B♭4'
    }),
    music_65: generateMusicPixel(65, {
        name: 'Triangle Wave B₄',
        description: 'Makes funny B₄ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'B4'
    }),
    music_66: generateMusicPixel(66, {
        name: 'Triangle Wave C₅',
        description: 'Makes funny C₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'C5'
    }),
    music_67: generateMusicPixel(67, {
        name: 'Triangle Wave C♯₅/D♭₅',
        description: 'Makes funny C♯₅/D♭₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'C♯5'
    }),
    music_68: generateMusicPixel(68, {
        name: 'Triangle Wave D₅',
        description: 'Makes funny D₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'D5'
    }),
    music_69: generateMusicPixel(69, {
        name: 'Triangle Wave D♯₅/E♭₅',
        description: 'Makes funny D♯₅/E♭₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'E♭5'
    }),
    music_70: generateMusicPixel(70, {
        name: 'Triangle Wave E₅',
        description: 'Makes funny E₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'E5'
    }),
    music_71: generateMusicPixel(71, {
        name: 'Triangle Wave F₅',
        description: 'Makes funny F₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'F5'
    }),
    music_72: generateMusicPixel(72, {
        name: 'Triangle Wave F♯₅/G♭₅',
        description: 'Makes funny F♯₅/G♭₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'F♯5'
    }),
    music_73: generateMusicPixel(73, {
        name: 'Triangle Wave G₅',
        description: 'Makes funny G₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'G5'
    }),
    music_74: generateMusicPixel(74, {
        name: 'Triangle Wave G♯₅/A♭₅',
        description: 'Makes funny G♯₅/A♭₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'A♭5'
    }),
    music_75: generateMusicPixel(75, {
        name: 'Triangle Wave A₅',
        description: 'Makes funny A₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'A5'
    }),
    music_76: generateMusicPixel(76, {
        name: 'Triangle Wave A♯₅/B♭₅',
        description: 'Makes funny A♯₅/B♭₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'B♭5'
    }),
    music_77: generateMusicPixel(77, {
        name: 'Triangle Wave B₅',
        description: 'Makes funny B₅ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'B5'
    }),
    music_78: generateMusicPixel(78, {
        name: 'Triangle Wave C₆',
        description: 'Makes funny C₆ triangle wave sound that hurts your ears',
        color: 'rgb(0, 230, 50)',
        text: 'C6'
    }),
    music_82: generateMusicPixel(82, {
        name: 'Clap',
        description: 'Makes funny weird clap sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'Cp'
    }),
    music_83: generateMusicPixel(83, {
        name: 'Hi-hat Cymbal 1',
        description: 'Makes funny hi-hat cymbal sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'Cy1'
    }),
    music_84: generateMusicPixel(84, {
        name: 'Hi-hat Cymbal 2',
        description: 'Makes funny hi-hat cymbal sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'Cy2'
    }),
    music_85: generateMusicPixel(85, {
        name: 'Maraca Shake',
        description: 'Makes funny maraca sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'MS'
    }),
    music_86: generateMusicPixel(86, {
        name: 'Tambourine Zill',
        description: 'Makes funny tambourine sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'TZ'
    }),
    music_87: generateMusicPixel(87, {
        name: 'Synth Kick',
        description: 'Makes funny kick drum sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'K'
    }),
    music_88: generateMusicPixel(88, {
        name: 'Synth Snare',
        description: 'Makes funny snare drum sound that hurts your ears',
        color: 'rgb(150, 150, 150)',
        text: 'Sn'
    }),
    remove: {
        name: 'Remove (brush only)',
        description: 'For removing pixels from the grid',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 0, 0)';
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 0,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: -1,
        updateStage: -1,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'remove',
        numId: 0
    },
    rickastley: {
        name: 'Rick Astley',
        description: 'Never gonna give you up<br>Never gonna let you down<br>Never gonna run around and desert you<br>Never gonna make you cry<br>Never gonna say goodbye<br>Never gonna tell a lie and hurt you',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            let scale = gridScale * camera.scale;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (this.prerenderedFrames[0]) ctx.drawImage(this.prerenderedFrames[0], x * scale - camera.x, y * scale - camera.y, width * scale, height * scale, x * scale - camera.x, y * scale - camera.y, width * scale, height * scale);
            });
        },
        update: function (x, y) {
            updateTouchingAnything(x, y, (ax, ay) => {
                if (grid[ay][ax] != pixNum.RICKASTLEY && random() < 0.2 * ((21 - pixelAt(ax, ay).blastResistance) / 20)) nextGrid[ay][ax] = pixNum.RICKASTLEY;
            });
            updateTouchingPixel(x, y, pixNum.AIR, (ax, ay) => {
                if (grid[ay][ax] != pixNum.RICKASTLEY && random() < 0.5) nextGrid[ay][ax] = pixNum.RICKASTLEY;
            });
            if (this.rickastley) return;
            sounds.rickroll();
            this.rickastley = true;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(canvasResolution);
            let rickastley = new Image();
            rickastley.src = './assets/img/rickastley.png';
            rickastley.onload = (e) => {
                ctx.drawImage(rickastley, 0, 0, canvasResolution, canvasResolution);
                this.prerenderedFrames.push(toImage());
            };
        },
        rickastley: false,
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: Infinity,
        flammability: -Infinity,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: -1,
        updateStage: 0,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'rickastley',
        numId: 0
    },
    red: {
        name: 'Red Pixel',
        description: 'Mise en abyme',
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, canvasResolution, canvasResolution);
        },
        update: function (x, y) {
            simulationPaused = true;
            modal('<span style="color: red;">Red Pixel Simulator</span>', '<span style="color: red;">86 7A 91 7A 8A 26 7C 87 86 86 76 26 7C 81 91 7A 26 94 87 90 26 90 88</span>', false).then(() => {
                for (;;) print();
            });
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: undefined,
        flammability: undefined,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: false,
        group: -1,
        updateStage: 0,
        animatedNoise: false,
        animatedNoise: false,
        animated: false,
        alwaysRedraw: false,
        pickable: false,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: 'red',
        numId: 0
    }
};
const numPixels = [];
const pixNum = {};
const pixelAmounts = {};
const pixelSelectors = {};
const pixelGroups = [];
const pixelUpdates = new Map();
function resetPixelAmounts(showPixels = true) {
    for (const group of pixelGroups) {
        group.style.display = 'none';
    }
    let defaultAmount = sandboxMode ? Infinity : -Infinity;
    for (const id in pixels) {
        pixelAmounts[id] = defaultAmount;
        updatePixelAmount(id, pixelAmounts, true, showPixels);
    }
    pixelAmounts['air'] = Infinity;
    updatePixelAmount('air', pixelAmounts, false, true);
};
function queueUpdatePixelAmount(id, inventory = pixelAmounts) {
    if (!pixelUpdates.has(inventory)) pixelUpdates.set(inventory, new Set());
    pixelUpdates.get(inventory).add(id);
};
function resolveQueuedPixelAmountUpdates() {
    pixelUpdates.forEach((set, inventory) => set.forEach((id) => updatePixelAmount(id, inventory)));
    pixelUpdates.clear();
};
function updatePixelAmount(id, inventory = pixelAmounts, hideEmpty = false, forceShow = false) {
    if (pixelSelectors[id] === undefined) return;
    if (sandboxMode) {
        pixelSelectors[id].count.innerText = '';
        pixelSelectors[id].box.classList.remove('pickerNoPixels');
        pixelSelectors[id].box.style.display = '';
        pixelSelectors[id].parentGroup.style.display = '';
        pixelSelectors[id].parentGroup.children[0]._refresh();
    } else {
        pixelSelectors[id].count.innerText = inventory[id] == Infinity ? '∞' : inventory[id] == -Infinity ? 0 : inventory[id];
        if (inventory[id] <= 0 || (PixSimAPI.gameRunning && !pixels[id].pixsimPickable)) {
            pixelSelectors[id].box.classList.add('pickerNoPixels');
            if (forceShow && !(PixSimAPI.inGame && !pixels[id].pixsimPickable)) {
                pixelSelectors[id].box.style.display = '';
                pixelSelectors[id].parentGroup.style.display = '';
                pixelSelectors[id].parentGroup.children[0]._refresh();
            } else if (hideEmpty || (PixSimAPI.inGame && !pixels[id].pixsimPickable)) {
                pixelSelectors[id].box.style.display = 'none';
            }
        } else {
            pixelSelectors[id].box.classList.remove('pickerNoPixels');
            pixelSelectors[id].box.style.display = '';
            pixelSelectors[id].parentGroup.style.display = '';
            pixelSelectors[id].parentGroup.children[0]._refresh();
        }
    }
};
function getPixelAmounts() {
    let ret = {};
    for (let i in pixelAmounts) {
        if (pixelAmounts[i] != -Infinity) ret[i] = pixelAmounts[i];
    }
    return ret;
};
function generateCraftingHTML(id, inventory = pixelAmounts, images = true) {
    const pixel = pixels[id];
    if (pixel === undefined || pixel.craftAmount == 0) return document.createElement('div');
    const container = document.createElement('div');
    container.classList.add('craftContainer');
    const resources = document.createElement('div');
    resources.classList.add('craftResources');
    if (images) resources.classList.add('craftResourcesImages');
    for (const cid in pixel.recipe) {
        // atrocious one-lining
        const cpixel = pixels[cid.endsWith('_any') ? (cid.substring(0, cid.lastIndexOf('_any')) + (cid == 'slider_any' ? '_horizontal' : (cid == 'mirror_any' ? '_1' : '_left'))) : cid] ?? numPixels[pixNum.MISSING];
        if (images) {
            const box = document.createElement('div');
            box.classList.add('craftPixel');
            const img = new Image(50, 50);
            img.classList.add('craftImage');
            img.src = cpixel.image;
            box.appendChild(img);
            const amount = document.createElement('div');
            amount.classList.add('craftAmount');
            amount.innerText = pixel.recipe[cid];
            if (inventory[cid] <= 0) amount.style.color = '#FF0000';
            box.appendChild(amount);
            resources.appendChild(box);
        }
        const label = document.createElement('div');
        label.classList.add('craftLabel');
        label.innerText = pixel.recipe[cid] + 'x ' + (cid.endsWith('_any') ? cpixel.name.replace('(Left)', '(Any)') : cpixel.name);
        if (inventory[cid] <= 0) label.style.color = '#FF0000';
        resources.appendChild(label);
    }
    container.appendChild(resources);
    const product = document.createElement('div');
    product.classList.add('craftProduct');
    const box = document.createElement('div');
    box.classList.add('craftPixelLarge');
    if (PixSimAPI.inGame && canCraft(id, PixSimAPI.team)) {
        box.classList.add('craftPixelCraftable');
        box.onclick = (e) => {
            craftPixel(id, PixSimAPI.team);
            sounds.click();
        };
    } else if (!sandboxMode) {
        box.classList.add('craftPixelUncraftable');
    }
    const img = new Image(50, 50);
    img.classList.add('craftImage');
    img.src = pixel.image;
    box.appendChild(img);
    const amount = document.createElement('div');
    amount.classList.add('craftAmount');
    amount.innerText = pixel.craftAmount;
    box.appendChild(amount);
    product.appendChild(box);
    container.appendChild(product);
    return container;
};
function generateMusicPixel(id, data) {
    return {
        name: data.name,
        description: data.description,
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            if (avoidGrid) {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    imagePixels(x, y, width, height, this.prerenderedFrames[0], ctx);
                });
            } else {
                forRectangles(rectangles, (x, y, width, height, redrawing) => {
                    forEachPixel(x, y, width, height, (x2, y2) => {
                        if (lastMusicGrid[y2][x2] != musicGrid[y2][x2] || redrawing || forceRedraw) {
                            if (musicGrid[y2][x2] == -1) musicGrid[y2][x2] = 0;
                            if (musicGrid[y2][x2]) imagePixels(x2, y2, 1, 1, this.prerenderedFrames[1], ctx);
                            else imagePixels(x2, y2, 1, 1, this.prerenderedFrames[0], ctx);
                        }
                    });
                });
            }
        },
        update: function (x, y) {
            if (updateTouchingAnything(x, y, (ax, ay) => {
                if (grid[ay][ax] >= pixNum.MUSIC_1 && grid[ay][ax] <= pixNum.MUSIC_88) return false;
                return true;
            })) musicGrid[y][x] = id;
        },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            ctx.fillRect(0, 0, 50, 50);
            ctx.fillStyle = 'rgb(255, 0, 200)';
            ctx.fillRect(10, 20, 30, 20);
            ctx.fillStyle = data.color;
            ctx.fillRect(10, 10, 30, 10);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '16px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(data.text, 25, 20);
        },
        prerender: function () {
            const { ctx, fillPixels, toImage } = new PreRenderer(120);
            ctx.fillStyle = 'rgb(100, 100, 100)';
            fillPixels(0, 0, 1, 1);
            ctx.fillStyle = 'rgb(200, 0, 180)';
            fillPixels(1 / 5, 2 / 5, 3 / 5, 2 / 5);
            ctx.fillStyle = data.color;
            fillPixels(1 / 5, 1 / 5, 3 / 5, 1 / 5);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '40px Courier New, courier, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(data.text, 60, 48);
            this.prerenderedFrames.push(toImage());
            ctx.fillStyle = 'rgb(255, 0, 255)';
            fillPixels(1 / 5, 2 / 5, 3 / 5, 2 / 5);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText(data.text, 60, 48);
            this.prerenderedFrames.push(toImage());
        },
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 12,
        flammability: 0,
        pushable: false,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 4,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: true,
        pickable: true,
        pixsimPickable: false,
        generatedDescription: '',
        image: '',
        id: `music_${id}`,
        numId: 0
    }
};
function generateColorPixel(data) {
    return {
        name: `${data.color} Color`,
        description: data.description ?? `A blob of ${data.color.toLowerCase()}`,
        draw: function (rectangles, ctx, avoidGrid) {
            ctx.globalAlpha = 1;
            let color = noAnimations ? data.rgb0 : colorAnimate(...data.rgb0, ...data.rgb1, 60);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            forRectangles(rectangles, (x, y, width, height, redrawing) => {
                if (!noAnimations || redrawing || forceRedraw) fillPixels(x, y, width, height, ctx);
            });
        },
        update: function (x, y) { },
        drawPreview: function (ctx) {
            ctx.clearRect(0, 0, 50, 50);
            ctx.fillStyle = `rgb(${data.rgb0})`;
            ctx.fillRect(0, 0, 50, 50);
        },
        prerender: function () { },
        defaultRGB: data.rgb0,
        recipe: { },
        craftAmount: 0,
        prerenderedFrames: [],
        blastResistance: 5,
        flammability: 0,
        pushable: true,
        cloneable: false,
        rotateable: false,
        collectible: true,
        group: 6,
        updateStage: -1,
        animatedNoise: false,
        animated: true,
        alwaysRedraw: false,
        pickable: true,
        pixsimPickable: true,
        generatedDescription: '',
        image: '',
        id: `color_${data.color.toLowerCase()}`,
        numId: 0
    };
};

let pixIndex = 0;
for (const id in pixels) {
    pixels[id].id = id;
    pixels[id].numId = pixIndex;
    pixNum[id.toUpperCase()] = pixIndex;
    numPixels[pixIndex] = pixels[id];
    numPixels[pixIndex].rectangles = [];
    pixIndex++;
}
let pixelsResolveLoad;
let pixelsLoad = new Promise((resolve, reject) => pixelsResolveLoad = resolve);
window.addEventListener('load', async (e) => {
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = 50;
    canvas2.height = 50;
    const groupNames = ['General', 'Mechanical', 'Lasers', 'Destruction', 'Music', 'Puzzles', 'Multiplayer'];
    for (const id in pixels) {
        const pixel = pixels[id];
        pixel.prerender();
        pixel.drawPreview(ctx2);
        pixel.image = canvas2.toDataURL('image/png');
        pixel.generatedDescription = `<span style="font-size: 16px; font-weight: bold;">${pixel.name}</span><br>${pixel.description}<br>Blast Resistance: ${pixel.blastResistance}/20<br>Flammability: ${pixel.flammability}/20<br>Moveable: ${pixel.pushable}<br>Cloneable: ${pixel.cloneable}`;
        if (pixel.pickable) {
            const box = document.createElement('div');
            box.classList.add('pickerPixel');
            box.onclick = (e) => {
                pixelSelectors[brush.pixel].box.classList.remove('pickerPixelSelected');
                box.classList.add('pickerPixelSelected');
                brush.pixel = id;
                pixelPickerDescription.innerHTML = pixel.generatedDescription;
                pixelPickerCrafting.innerHTML = '';
                if (sandboxMode || PixSimAPI.inGame) pixelPickerCrafting.appendChild(generateCraftingHTML(id, PixSimAPI.inGame ? teamPixelAmounts[PixSimAPI.team] : pixelAmounts));
            };
            box.onmouseover = (e) => {
                pixelPickerDescription.innerHTML = pixel.generatedDescription;
                pixelPickerCrafting.innerHTML = '';
                if (sandboxMode || PixSimAPI.inGame) pixelPickerCrafting.appendChild(generateCraftingHTML(id, PixSimAPI.inGame ? teamPixelAmounts[PixSimAPI.team] : pixelAmounts));
            };
            box.onmouseout = (e) => {
                pixelPickerDescription.innerHTML = pixels[brush.pixel].generatedDescription;
                pixelPickerCrafting.innerHTML = '';
                if (sandboxMode || PixSimAPI.inGame) pixelPickerCrafting.appendChild(generateCraftingHTML(brush.pixel, PixSimAPI.inGame ? teamPixelAmounts[PixSimAPI.team] : pixelAmounts));
            };
            const img = new Image(50, 50);
            img.src = pixel.image;
            box.appendChild(img);
            const count = document.createElement('div');
            count.classList.add('pickerCount');
            box.append(count);
            if (pixelGroups[pixel.group] === undefined) {
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
                let open = true;
                groupHeader.onclick = (e) => {
                    open = !open;
                    groupHeader._refresh();
                    sounds.click();
                };
                groupHeader._refresh = () => {
                    if (open) groupBody.style.maxHeight = groupContents.getBoundingClientRect().height + 'px';
                    else groupBody.style.maxHeight = '0px';
                };
                pixelGroups[pixel.group] = group;
            }
            pixelGroups[pixel.group].children[1].children[0].appendChild(box);
            pixelSelectors[id] = {
                box: box,
                count: count,
                parentGroup: pixelGroups[pixel.group]
            };
        }
    }
    for (const group of pixelGroups) {
        pixelPicker.appendChild(group)
    }
    pixelSelectors[brush.pixel].box.onclick();
    resetPixelAmounts();
    for (const group of pixelGroups) {
        group.children[0]._refresh();
    }
    window.addEventListener('resize', () => {
        for (const group of pixelGroups) {
            group.children[0]._refresh();
        }
    });
    pixelsResolveLoad();
});