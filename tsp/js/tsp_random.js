

let p = [];
let p_best = [];
let points = [];
let NUM = 30;
let H = 320;
let W = 640;
let sum_dist = 0;
let cost = 0;
let best = 0;
let epoch = 0;

let canvas;
let ctx;
let canvas_best;
let ctx_best;
let interval;
let _onplay = true;


function draw_point(x, y, context, color = 'black') {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, 6, 0, 2 * Math.PI, true);
    context.fill();
}

function draw_line(x, y, z, w, context, color = 'black') {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(z, w);
    context.stroke();
}

function dist(x, y, z, w) {
    return Math.sqrt((x - z) * (x - z) + (y - w) * (y - w))
}

function calc_dist() {
    let res = 0;
    for (let index = 0; index < NUM; index++) {
        res += dist(points[p[index]].x, points[p[index]].y, points[p[(index + 1) % NUM]].x, points[p[(index + 1) % NUM]].y);
    }
    return res;
}

function hightlight(p, i, j, context, isswap = true) {
    let color = '#FF0000';
    draw_point(points[p[i]].x, points[p[i]].y, context, color);
    draw_point(points[p[j]].x, points[p[j]].y, context, color);
    // if(isswap) draw_line(points[p[i]].x, points[p[i]].y, points[p[j]].x, points[p[j]].y, context, color);
}

function draw_tsp(p, context, color = "black") {
    context.clearRect(0, 0, W, H);
    for (let index = 0; index < NUM; index++) {
        draw_point(points[index].x, points[index].y, context, color);
        draw_line(points[p[index]].x, points[p[index]].y, points[p[(index + 1) % NUM]].x, points[p[(index + 1) % NUM]].y, context, color);
    }
}


function tsp() {
    let i = Math.floor(Math.random() * NUM);
    let j = Math.floor(Math.random() * NUM);
    [p[i], p[j]] = [p[j], p[i]];
    cost = calc_dist();
    if (cost < best) {
        best = cost;
        p_best = p;
        // ctx.clearRect(0, 0, W, H);
        draw_tsp(p, ctx);
        hightlight(p, i, j, ctx);
        // ctx_best.clearRect(0, 0, W, H);
        draw_tsp(p_best, ctx_best, '#0000FF');
    }
    else if (Math.floor(Math.random() * 100) == 0) {
        // ctx.clearRect(0, 0, W, H);
        draw_tsp(p, ctx);
        hightlight(p, i, j, ctx);
    }
    else {
        [p[i], p[j]] = [p[j], p[i]];
        document.getElementById('action').innerHTML = 'action : swap ' + 0 + " " + 0;
    }
    epoch++;
    document.getElementById('epoch').innerHTML = 'epoch : ' + epoch;
    document.getElementById('cost').innerHTML = 'cost : ' + Math.floor(cost);
    document.getElementById('best').innerHTML = 'best : ' + Math.floor(best);
    document.getElementById('action').innerHTML = 'action : swap ' + i + " " + j;
};



window.onload = function () {
    canvas = document.getElementById('tsp-canvas');
    ctx = canvas.getContext('2d');
    canvas_best = document.getElementById('tsp-canvas-best');
    ctx_best = canvas_best.getContext('2d');
    // W = canvas.witdh;
    // H = canvas.height;
    NUM = Number(document.getElementById('number').value);
    reload(NUM);
}

function clickNumber() {
    document.getElementById('stop').removeEventListener('click', _stop, true);
    document.getElementById('play').removeEventListener('click', _play, true);
    document.getElementById('best').removeEventListener('click', _best, true);
    reload();
}

function _stop() {
    if (_onplay) {
        clearInterval(interval);
        _onplay = false;
    }
}

function _play() {
    if (!_onplay) {
        interval = setInterval(tsp, 10);
        _onplay = true;
    }
}

function _best() {
    _stop();
    p = p_best;
    // tsp(p, ctx);
    _play();
}

function reload() {
    epoch = 0;
    p = [];
    p_best = [];
    points = [];
    NUM = Number(document.getElementById('number').value);
    for (let index = 0; index < NUM; index++) {
        p.push(index);
        points.push({ x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) });
    }
    p_best = p;
    cost = best = calc_dist();
    ctx.clearRect(0, 0, W, H);
    ctx_best.clearRect(0, 0, W, H);

    draw_tsp(p, ctx);
    draw_tsp(p_best, ctx_best, '#0000FF');

    if (_onplay) {
        clearInterval(interval);
    }

    interval = setInterval(tsp, 10);
    _onplay = true;

    document.getElementById('stop').addEventListener('click', _stop, true);
    document.getElementById('play').addEventListener('click', _play, true);
    document.getElementById('best').addEventListener('click', _best, true);
}
