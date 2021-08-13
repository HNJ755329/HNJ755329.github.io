const canvas = document.getElementById('tsp-canvas');
const ctx = canvas.getContext('2d');


let p = [];
let points = [];
const NUM = 30;
const H = 310;
const W = 630;

function draw_point(x, y, canvas) {
    canvas.beginPath();
    canvas.arc(x, y, 6, 0, 2 * Math.PI, true);
    canvas.fill();
}

function draw_line(x, y, z, w, canvas) {
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(z, w);
    canvas.stroke();
}

for (let index = 0; index < NUM; index++) {
    p.push(index);
    points.push({ x: (Math.random()) * W, y: (Math.random()) * H });
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

for (let index = 0; index < NUM; index++) {
    draw_point(points[index].x, points[index].y, ctx);
    draw_line(points[p[index]].x, points[p[index]].y, points[p[(index + 1) % NUM]].x, points[p[(index + 1) % NUM]].y, ctx);
}

function draw_tsp(canvas) {
    for (let index = 0; index < NUM; index++) {
        draw_point(points[index].x, points[index].y, canvas);
        draw_line(points[p[index]].x, points[p[index]].y, points[p[(index + 1) % NUM]].x, points[p[(index + 1) % NUM]].y, canvas);
    }
}

function clear_canvas(canvas) {
    canvas.clearRect(0, 0, W, H);
}

clear_canvas(ctx);
draw_tsp(ctx);
let sum_dist = calc_dist();
function sleep(msec) {
    return new Promise(function (resolve) {

        setTimeout(function () { resolve() }, msec);

    })
}

async function tsp(canvas) {
    let CNT = 1000;
    while (CNT--) {
        let i = Math.floor(Math.random() * NUM);
        let j = Math.floor(Math.random() * NUM);
        [p[i], p[j]] = [p[j], p[i]];
        let tmp_dist = calc_dist();
        if (tmp_dist < sum_dist) {
            sum_dist = tmp_dist;
            clear_canvas(canvas);
            draw_tsp(canvas);
        }
        else {
            [p[i], p[j]] = [p[j], p[i]];
        }
        await sleep(10);
        console.log(CNT, sum_dist);
    }
};

tsp(ctx);

console.log(p);

// const data = {
//     label: 'tsp',
//     datasets: [{
//         data: points,
//         backgroundColor: 'red',
//     }],
// };

// const options = {
//     responsive: true,
// };

// const config = {
//     type: 'scatter',
//     data: data,
//     options: options,
// };

// new Chart(ctx, config);

// ctx.beginPath();
// ctx.moveTo(points[p[0]].x, points[p[0]].y);
// for (let i = 1; i < NUM; i++) {
//     ctx.lineTo(points[p[i]].x, points[p[i]].y);
// }
// ctx.stroke();