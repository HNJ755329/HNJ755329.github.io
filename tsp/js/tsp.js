let p = [];
let points = [];
const num = 100;

for (let index = 0; index < num; index++) {
    p.push(index)
    points.push([Math.random() * 10, Math.random() * 10])
}

const data = {
    datasets: points
};

// グラフオプション
const options = {
    // 自動サイズ変更をしない
    responsive: false,
};

const ctx = document.getElementById('tsp').getContext('2d');
new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: options,
});