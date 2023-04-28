// random (change to normal functions when remove p5)
let randSeed = 1;
function random(min = 0, max = 1) {
    // return ((randSeed = (randSeed * 1664525 + 1013904223) % 4294967296) / 4294967296) * (max - min) + min;
    return (((randSeed = (randSeed * 16807) % 2147483647) - 1) / 2147483646) * (max - min) + min;
};
function randomSeed(t, x, y) {
    // randSeed = (((192837463 ^ x) * 1664525 + 1013904223) % 4294967296) ^ (((192837463 ^ y) * 1664525 + 1013904223) % 4294967296) ^ (((192837463 ^ (t % 65536)) * 1664525 + 1013904223) % 4294967296);
    randSeed = ~~Math.abs(((((t % 65536) + 71) * 459160133) * ((((((y / gridHeight * 393) + (x / gridWidth * 211)) << (((t % 65536) + 47) * ((x / gridWidth + 7) * 86183) % ((y / gridHeight + 13) * 83299))) ^ 935192669) * 117) / 1972627)) % 2147483647);
};

const perlinNoiseGenerator = new perlinNoise3d();
function noise(x, y, t) {
    return perlinNoiseGenerator.get(x, y, t);
}