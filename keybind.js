var keys = ['Right_Button', 'Left_Button', 'Up_Button', 'Down_Button', 'A_Button', 'B_Button', 'Select_Button', 'Start_Button'];

var app = document.getElementsByClassName('content')[0];
function main() {
    var t = 0;
    keys.forEach(k => {
        var e = document.createElement('div');
        e.className = 'listview focusable';
        e.addEventListener('click', function () { setkey(k) });
        e.innerHTML = '<b>' + k + '</b> > ' + new String(localStorage.getItem(k)).replace('null', 'Not Assaigned') + '<br>';
        e.tabIndex = t;
        app.appendChild(e);
        t++
    });

    document.querySelectorAll('.focusable')[0].focus();
    document.body.addEventListener('keydown', keydownmain);
}




function setkey(k) {
    document.body.removeEventListener('keydown', keydownmain);


    var e = document.createElement('div');
    e.style = 'position: fixed; top: 0px; left:0px; width: 100%; height: 100%; display:flex; justify-content: center; align-items: center;background:rgba(0,0,0,0.5); opacity: 1;';
    e.id = 'key';
    e.innerHTML = '<div style="background: white; padding: 30px; border-radius: 5px;"><center><b>' + k + '</b><br><br><x id="readytopress">loading...</x></center>';
    app.appendChild(e);
    setTimeout(function () {
        document.getElementById('readytopress').innerHTML = 'Press A Key To Setup';
        document.body.addEventListener('keyup', function (e) {
            if (e.key == '1' || e.key == '3' || e.key == '*' || e.key == '#' || e.key == 'SoftRight' || e.key == 'Backspace') {
                alert('This Key Assaigned By Administrator');
window.location.reload();
            } else {
                localStorage.setItem(k, e.keyCode);
                localStorage.setItem('userkeyzone', 'yes');
                window.location.reload();
            }
        });
    }, 700);

}

function keydownmain(e) {
    switch (e.key) {
        case 'ArrowDown': focus(1);
            break;
        case 'ArrowUp': focus(-1);
            break;
        case 'Down': focus(1);
            break;
        case 'Up': focus(-1);
            break;
        case 'Enter': document.activeElement.click();
            break;
        case 'SoftRight': window.location.href = 'index.html';
            break;
        case 'F2': window.location.href = 'index.html';
            break;
        case 'F1': if (window.confirm('Sure To Remove All?')) { keys.forEach(k => { localStorage.removeItem(k); }); localStorage.removeItem('userkeyzone'); window.location.reload(); }
            break;
        case 'SoftLeft': if (window.confirm('Sure To Remove All?')) {
            keys.forEach(k => { localStorage.removeItem(k); });
            localStorage.removeItem('userkeyzone');
            window.location.reload();
        }
            break;
    }



    function focus(move) {
        var currentIndex = document.activeElement.tabIndex;
        var next = currentIndex + move;;
        if (next > document.querySelectorAll('.focusable').length - 1) { next = 0; } else if (next < 0) { next = document.querySelectorAll('.focusable').length - 1; }
        var items = document.querySelectorAll('.focusable');
        var targetElement = items[next];
        targetElement.focus();
        targetElement.scrollIntoView({ block: 'center' });
    }

}

main();