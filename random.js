let randSeed = 1;
function random(min = 0, max = 1) {
    return (((randSeed = (randSeed * 16807) % 2147483647) - 1) / 2147483646) * (max - min) + min;
};
function randomSeed(t, x, y) {
    randSeed = ~~Math.abs(((((t % 65536) + 71) * 459160133) * ((((((y / gridHeight * 393) + (x / gridWidth * 211)) << (((t % 65536) + 47) * ((x / gridWidth + 7) * 86183) % ((y / gridHeight + 13) * 83299))) ^ 935192669) * 117) / 1972627)) % 2147483647);
};

const perlinNoiseGenerator = new perlinNoise3d();
const constantNoiseCache = new Map();
function noise(x, y, t = 0) {
    return perlinNoiseGenerator.get(x, y, t);
};
function constantNoise(x, y) {
    let x2 = Math.round(x * 100);
    let y2 = Math.round(y * 100);
    if (constantNoiseCache.has(y2)) {
        if (constantNoiseCache.get(y2).has(x2)) {
            return constantNoiseCache.get(y2).get(x2);
        } else {
            let n = noise(x, y, 0);
            constantNoiseCache.get(y2).set(x2, n);
            return n;
        }
    } else {
        constantNoiseCache.set(y2, new Map());
        let n = noise(x, y, 0);
        constantNoiseCache.get(y2).set(x2, n);
        return n;
    }
};