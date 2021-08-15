// git.dev
javascript: if (window.location.host == "github.com") { window.open(window.location.href.replace('github.com', 'github.dev'), '_blank'); }
// show border
javascript: (function dfs(v, d) { Object.values(v.children).map(e => { e.style.border = 'solid 1px rgba(' + (d * 25) % 255 + ',0,0,' + d / 10 + ')'; dfs(e, d + 1); }); })(document.body, 0);
// show tags
javascript: (function dfs(v) { Object.values(v.children).map(e => { if (e.hasChildNodes) dfs(e); e.innerHTML = '<span style="position:absolute;color:white;background:rgba(0,0,128,0.4)">&lt' + e.tagName.toLowerCase() + '&gt</span>' + e.innerHTML + '<span style="position: absolute;color:white;background:rgba(0,0,128,0.4)">&lt/' + e.tagName.toLowerCase() + '&gt</span>'; }); })(document.body);
javascript: (function dfs(v) { Object.values(v.children).map(e => { if (e.hasChildNodes) dfs(e); e.innerHTML = '<span style="color:white;background:rgba(0,0,128,0.4)">&lt' + e.tagName.toLowerCase() + '&gt</span>' + e.innerHTML + '<span style="color:white;background:rgba(0,0,128,0.4)">&lt/' + e.tagName.toLowerCase() + '&gt</span>'; }); })(document.body);
// show div border
javascript: Object.values(document.getElementsByTagName('div')).map(v => { v.style.border = 'solid 1px red'; });
// show image size
javascript: Object.values(document.getElementsByTagName('img')).map(v => { v.outerHTML = '<span style="position:absolute;color:white;background:rgba(255, 64,0,0.5)">' + v.width + "x" + v.height + '</span>' + v.outerHTML; });
