window.width = window.innerWidth;
window.height = window.innerHeight;

window.max = Math.max;
window.min = Math.min;
window.random = Math.random;
window.round = Math.round;
window.floor = Math.floor;
window.ceil = Math.ceil;
window.sqrt = Math.sqrt;
window.mouseX;
window.mouseY;

window.fill = function (r, g, b, a) {
    if (a === undefined) {
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        return true;
    }
    ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    return true;
}
window.stroke = function (r, g, b, a) {
    if (a === undefined) {
        ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        return true;
    }
    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a / 255) + ')';
    return true;
}
window.strokeWeight = function (weight) {
    ctx.lineWidth = weight;
}
window.noStroke = function () {
    stroke(0, 0, 0, 0);
}
window.rect = function (x, y, width, height, radius) {
    if (!radius) {
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
        return true;
    }
    ctx.fillRect(x + radius, y + radius, max(width - radius * 2, 0), max(height - radius * 2, 0));
    ctx.fillRect(x, y + radius, radius, max(height - radius * 2, 0));
    ctx.fillRect(x + radius, y, max(width - radius * 2, 0), radius);
    ctx.fillRect(x + width - radius, y + radius, radius, max(height - radius * 2, 0));
    ctx.fillRect(x + radius, y + height - radius, max(width - radius * 2, 0), radius);
    ctx.arc(x + radius, y + radius, radius, 90, 180);
    ctx.fill();
    ctx.arc(x + width - radius, y + radius, radius, 0, 90);
    ctx.fill();
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 270);
    ctx.fill();
    ctx.arc(x + radius, y + height - radius, radius, 180, 270);
    ctx.fill();
    return true;
}
window.text = function (text, x, y) {
    var textLines = text.split('\n');
    for (var i in textLines) {
        ctx.fillText(textLines[i], x, y - textLines.length * 20 + i * 40);
    }
}
let loop = setInterval(() => {});;
window.frameRate = function (fps) {
    clearInterval(loop);
    setInterval(function() {
        window.draw();
    }, 1000/fps);
}