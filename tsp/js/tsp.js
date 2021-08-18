let p = [];
let p_best = [];
let points = [];
let NUM = 30;
let H = 320;
let W = 640;
let cost = 0;
let best = 0;
let epoch = 0;
let vers = [];

let canvas;
let ctx;
let canvas_best;
let ctx_best;
let interval;
let _onplay = true;
let DIST;


function randint(a, b) {
    return a + (Math.floor(Math.random() * 1e9)) % (b - a + 1);
}

function draw_point(x, y, context, color = 'black') {
    context.fillStyle = color;
    context.beginPath();
    context.arc(Math.floor(x * W), Math.floor(y * H), 6, 0, 2 * Math.PI, true);
    context.fill();
}

function draw_line(x, y, z, w, context, color = 'black') {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(Math.floor(x * W), Math.floor(y * H));
    context.lineTo(Math.floor(z * W), Math.floor(w * H));
    context.stroke();
}

function dist(x, y, z, w) {
    return Math.sqrt((x - z) * (x - z) + (y - w) * (y - w));
}

function dist_p(p, q) {
    return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}


function calc_dist() {
    let res = 0;
    for (let i = 0; i < NUM; i++) {
        res += dist_p(points[p[i]], points[p[(i + 1) % NUM]]);
    }
    return res;
}

function choose_4() {
    res = new Array(4, 0);
    for (let i = 0; i < 4; i++) {
        j = randint(i, NUM - 1);
        [vers[i], vers[j]] = [vers[j], vers[i]];
        res[i] = vers[i];
    }
    res.sort((a, b) => a - b);
    return res;
}

function double_bridge() {
    let x = choose_4();
    let y = [];
    for (const elem of x) {
        y.push((Number(elem) + 1) % NUM);
    }
    let res = 0;
    res += DIST[p[x[0]]][p[y[2]]] + DIST[p[x[1]]][p[y[3]]] + DIST[p[x[2]]][p[y[0]]] + DIST[p[x[3]]][p[y[1]]];
    res -= DIST[p[x[0]]][p[y[0]]] + DIST[p[x[1]]][p[y[1]]] + DIST[p[x[2]]][p[y[2]]] + DIST[p[x[3]]][p[y[3]]];
    let p_tmp = [];
    p_tmp = p_tmp.concat(p.slice(0, x[0] + 1));
    p_tmp = p_tmp.concat(p.slice(y[2], x[3] + 1));
    p_tmp = p_tmp.concat(p.slice(y[1], x[2] + 1));
    p_tmp = p_tmp.concat(p.slice(y[0], x[1] + 1));
    p_tmp = p_tmp.concat(p.slice(y[3], NUM));
    p = p_tmp;
    document.getElementById('action').innerHTML = 'action : double_bridge';
    return res;
}

function hightlight(p, i, j, context) {
    const color = '#FF0000';
    draw_point(points[p[i]].x, points[p[i]].y, context, color);
    draw_point(points[p[j]].x, points[p[j]].y, context, color);
}

function draw_tsp(p, context, color = "black") {
    context.clearRect(0, 0, W, H);
    for (let i = 0; i < NUM; i++) {
        draw_point(points[i].x, points[i].y, context, color);
        draw_line(points[p[i]].x, points[p[i]].y, points[p[(i + 1) % NUM]].x, points[p[(i + 1) % NUM]].y, context, color);
    }
}

function update_info(obj) {
    document.getElementById('epoch').innerHTML = 'epoch : ' + obj.epoch;
    document.getElementById('cost').innerHTML = 'cost : ' + obj.cost;
    document.getElementById('best').innerHTML = 'best : ' + obj.best;
}

function calc_diff_two_opt(i, j) {
    if (i > j) {
        [i, j] = [j, i];
    }
    if (i == 0 && j == NUM - 1) {
        return 0;
    }
    let ii = i - 1;
    let jj = j + 1;
    if (ii < 0) ii = NUM - 1;
    if (jj == NUM) jj = 0;
    res = 0;
    res += DIST[p[ii]][p[j]] + DIST[p[i]][p[jj]];
    res -= DIST[p[ii]][p[i]] + DIST[p[j]][p[jj]];
    return res;
}

function apply_two_opt(i, j) {
    if (i > j) {
        [i, j] = [j, i];
    }
    let p_tmp = p.slice(0, i);
    p_tmp = p_tmp.concat(p.slice(i, j + 1).reverse());
    p_tmp = p_tmp.concat(p.slice(j + 1, NUM));
    p = p_tmp;
    document.getElementById('action').innerHTML = 'action : swap ' + i + " " + j;
}

function sleep(interval) {
    return new Promise((resolve) => setTimeout(resolve, interval));
}

async function intervalRepeater(callback, interval) {
    while (_onplay) {
        await Promise.all([callback(), sleep(interval)])
    }
    return sleep(10);
}

async function tsp_heuristic() {
    let p_pre = p.concat();
    let diff = (randint(0, 60) == 0) ? 0 : double_bridge();
    let best_d = cost;
    while (_onplay) {
        update = false;
        for (let i = 0; i < NUM; i++) {
            for (let j = i + 1; j < NUM; j++) {
                if (!_onplay) {
                    return sleep(10);
                }
                let d = calc_diff_two_opt(i, j);
                if (d < 0) {
                    update = true;
                    apply_two_opt(i, j);
                    epoch++;
                    diff += d;
                    draw_tsp(p, ctx);
                    // p_best = p.concat();
                    // draw_tsp(p, ctx_best, '#0000FF');
                    best_d = Math.min(best_d, cost + diff);
                    update_info({ epoch: epoch, cost: cost + diff, best: best_d });
                    await sleep(10);
                }
            }
        }
        if (!update) {
            break;
        }
    }
    if (diff < 0) {
        cost += diff;
        if (cost < best) {
            best = cost;
            p_best = p.concat();
            document.getElementById('output').value = p_best;
        }
    }
    else {
        p = p_pre.concat();
    }
    epoch++;
    draw_tsp(p, ctx);
    draw_tsp(p_best, ctx_best, '#0000FF');
    update_info({ epoch: epoch, cost: cost, best: best });
    return sleep(10);
};



async function clickNumber() {
    // document.getElementById('stop').removeEventListener('click', _stop, true);
    // document.getElementById('play').removeEventListener('click', _play, true);
    await _stop();
    init();
    resize();
    reload();
}

let intr;

async function _stop() {
    if (_onplay) {
        _onplay = false;
        await intr;
    }
}

async function _play() {
    if (!_onplay) {
        await intr;
        _onplay = true;
        intr = intervalRepeater(tsp_heuristic, 10);
    }
}

function init() {
    epoch = 0;
    p = [];
    vers = [];
    p_best = [];
    points = [];
    NUM = Number(document.getElementById('number').value);
    for (let i = 0; i < NUM; i++) {
        p.push(i);
        vers.push(i);
        points.push({ x: Math.random(), y: Math.random() });
    }
    DIST = new Array(NUM);

    for (let i = 0; i < NUM; i++) {
        DIST[i] = new Array(NUM, 0);
        for (let j = 0; j < NUM; j++) {
            DIST[i][j] = dist(points[i].x, points[i].y, points[j].x, points[j].y);
        }
    }
    document.getElementById('input').value = NUM + "\n";
    for (const elem of points) {
        document.getElementById('input').value += elem.x + " " + elem.y + "\n";
    }

    p_best = p.concat();
    cost = best = calc_dist();
    _onplay = true;
}

function reload() {
    intr = intervalRepeater(tsp_heuristic, 10);
}

// インターバル処理が重複しないようにasync/awaitを利用．
// https://qiita.com/asa-taka/items/888bc5a1d7f30ee7eda2

// main()に相当．
// ベージが読み込まれてから処理
window.onload = function () {
    canvas = document.getElementById('tsp-canvas');
    ctx = canvas.getContext('2d');
    canvas_best = document.getElementById('tsp-canvas-best');
    ctx_best = canvas_best.getContext('2d');
    NUM = Number(document.getElementById('number').value);
    // document.getElementById('stop').addEventListener('click', _stop, true);
    // document.getElementById('play').addEventListener('click', _play, true);

    init();
    resize();
    reload();
}

window.onresize = function () {
    resize();
}


function resize() {
    // canvas.height = innerHeight;
    W = document.getElementsByClassName('container')[0].offsetWidth;
    W /= 2;
    // console.log(W);
    let cws = document.getElementsByClassName('canvas-wrapper');
    // console.log(cws);
    for (const div of cws) {
        div.style.width = W + "px";
    }
    canvas.width = W;
    canvas_best.width = W;
    H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx_best.clearRect(0, 0, W, H);

    draw_tsp(p, ctx);
    draw_tsp(p_best, ctx_best, '#0000FF');
}

class TSP {
    // init

    // Modec
    
    // View
    draw_tsp() {

    }
    // Controll
    creat() {

    }
    read() {

    }
    update() {

    }
    delete() {

    }
    play() {

    }
    stop() {

    }
}