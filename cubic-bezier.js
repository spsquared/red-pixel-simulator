class CubicBezier {
    points = [];
    #step = 1;

    constructor(x1, y1, x2, y2, resolution = 10000) {
        // I dont feel like solving the cubic formulas with the ungodly long expressions in the equation
        // so instead I'm making a bad approximation
        // and no, generating ten thousand points is not excessive.
        x1 = Math.min(1, Math.max(0, x1));
        y1 = Math.min(1, Math.max(0, y1));
        x2 = Math.min(1, Math.max(0, x2));
        y2 = Math.min(1, Math.max(0, y2));
        this.#step = 1 / resolution;
        let px = 0;
        let last = [0, 0];
        for (let t = this.#step; t <= 1; t += this.#step) {
            let x = (3 * t * x1 * (1 - t) ** 2) + 3 * ((t ** 2) * x2 * (1 - t)) + (t ** 3);
            let y = (3 * t * y1 * (1 - t) ** 2) + 3 * ((t ** 2) * y2 * (1 - t)) + (t ** 3);
            while (x > px) {
                let linterpt = px == last[0] ? 0 : (px - last[0]) / (x - last[0]);
                this.points.push((y - last[1]) * linterpt + last[1]);
                px += this.#step;
            }
            last = [x, y];
        }
        this.points.push(1);
    }

    at(t) {
        if (t < 0) return this.points[0];
        if (t > 1) return this.points[this.points.length - 1];
        let tIndex = t * (this.points.length - 1);
        if (this.points[tIndex] != undefined) return this.points[tIndex];
        let bIndex = Math.floor(tIndex);
        let before = this.points[bIndex];
        let after = this.points[bIndex + 1];
        return (after - before) * (tIndex - bIndex) + before;
    }
}