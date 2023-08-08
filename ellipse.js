// too lazy to implement this myself also what da heck is going on here
// http://0x80.pl/articles/bresenham-demo-ellipse.html

function ellipse_points(placePixel, x0, y0, x, y) {
	placePixel(x0 + x, y0 + y);
	placePixel(x0 - x, y0 + y);
	placePixel(x0 + x, y0 - y);
	placePixel(x0 - x, y0 - y);
}

function rasterize(placePixel, x0, y0, a, b, hw) {
    var a2 = a * a;
    var b2 = b * b;

    var d = 4 * b2 - 4 * b * a2 + a2;
    var delta_A = 4 * 3 * b2;
    var delta_B = 4 * (3 * b2 - 2 * b * a2 + 2 * a2);

    var limit = (a2 * a2) / (a2 + b2);

    var x = 0;
    var y = b;
    while (true) {
        if (hw)
            ellipse_points(placePixel, x0, y0, x, y);
        else
            ellipse_points(placePixel, x0, y0, y, x);

        if (x * x >= limit)
            break;

        if (d > 0) {
            d += delta_B;
            delta_A += 4 * 2 * b2;
            delta_B += 4 * (2 * b2 + 2 * a2);

            x += 1;
            y -= 1;
        }
        else {
            d += delta_A;
            delta_A += 4 * 2 * b2;
            delta_B += 4 * 2 * b2;

            x += 1;
        }
    }
}

function draw_ellipse(placePixel, x0, y0, a, b) {
    rasterize(placePixel, x0, y0, a, b, true);
    rasterize(placePixel, x0, y0, b, a, false);
}