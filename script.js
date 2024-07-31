var app = document.getElementById('app');
var content = document.getElementsByClassName('content')[0];
var header = document.getElementsByClassName('header')[0];
var f1 = document.getElementsByClassName('footerelement')[0];
var f2 = document.getElementsByClassName('footerelement')[1];
var f3 = document.getElementsByClassName('footerelement')[2];
var emulspeed = document.getElementById('emulspeed');
var importbtn = document.querySelector('#importsavedata');
mainCanvas = document.getElementById("mainCanvas");
var speed = 1;








//get file extension
function fileExtention(filename) {
  var fsplit = filename.split('.');
  var extention = fsplit[fsplit.length - 1];
  return extention;
}

//get base file Name
function baseFileName(filename) {
  var s = filename.split('/');
  var name = s[s.length - 1];
  return name;
}

//create text file
function createTextFile(name, content) {
  var a = document.createElement('a');
  a.href = 'data:text/plain;charset=UTF-8,' + encodeURIComponent(content);
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


function runFreeze(keyName) {
  try {
    windowStacks[8].hide();
    initPlayer();
    openState(keyName, mainCanvas);
  }
  catch (error) {
    cout("A problem with attempting to open the selected save state occurred.", 2);
  }
}

function findValue(key) {
  try {
    if (window.localStorage.getItem(key) != null) {
      return JSON.parse(window.localStorage.getItem(key));
    }
  }
  catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    if (window.globalStorage[location.hostname].getItem(key) != null) {
      return JSON.parse(window.globalStorage[location.hostname].getItem(key));
    }
  }
  return null;
}

function setValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
  }
}
//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
  try {
    window.localStorage.removeItem(key);
  }
  catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    window.globalStorage[location.hostname].removeItem(key);
  }
}

function cout(t) {
  console.log(t);
}
if(localStorage.getItem('userkeyzone') == 'yes') {
  var keyZones = [
    ['right', [localStorage.getItem('Right_Button')]],
    ['left', [localStorage.getItem('Left_Button')]],
    ['up', [localStorage.getItem('Up_Button')]],
    ['down', [localStorage.getItem('Down_Button')]],
    ['a', [localStorage.getItem('A_Button')]],
    ['b', [localStorage.getItem('B_Button')]],
    ['select', [localStorage.getItem('Select_Button')]],
    ['start', [localStorage.getItem('Start_Button')]]
  ];
} else { 
var keyZones = [
  ['right', [39, 54]],
  ['left', [37, 52]],
  ['up', [38, 50]],
  ['down', [40, 56]],
  ['a', [13, 53]],
  ['b', [57]],
  ['select', [55]],
  ['start', [48]]
];
}

function keyDown(event) {
  var keyCode = event.keyCode;
  var keyMapLength = keyZones.length;
  for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
    var keyCheck = keyZones[keyMapIndex];
    var keysMapped = keyCheck[1];
    var keysTotal = keysMapped.length;
    for (var index = 0; index < keysTotal; ++index) {
      if (keysMapped[index] == keyCode) {
        GameBoyKeyDown(keyCheck[0]);
        try {
          event.preventDefault();
        }
        catch (error) { }
      }
    }
  }
}
function keyUp(event) {
  var keyCode = event.keyCode;
  var keyMapLength = keyZones.length;
  for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
    var keyCheck = keyZones[keyMapIndex];
    var keysMapped = keyCheck[1];
    var keysTotal = keysMapped.length;
    for (var index = 0; index < keysTotal; ++index) {
      if (keysMapped[index] == keyCode) {
        GameBoyKeyUp(keyCheck[0]);
        try {
          event.preventDefault();
        }
        catch (error) { }
      }
    }
  }
}





var sdcards = navigator.getDeviceStorages('sdcard');

function main() {

  app.innerHTML = '';
  if (sdcards.length == 2) { externalCard(); }
  else { internalCard(); }
}

function internalCard() {
  var sd = navigator.getDeviceStorages('sdcard')[0];
  var ti = 0;
  var cursor = sd.enumerate();

  cursor.onsuccess = function () {
    if (this.result.name.lastIndexOf('.gb') === this.result.name.length - 3 || this.result.name.lastIndexOf('.GB') === this.result.name.length - 3 || this.result.name.lastIndexOf('.gbc') === this.result.name.length - 4 || this.result.name.lastIndexOf('.GBC') === this.result.name.length - 4) {
      var file = this.result;
      var filename = file.name;
      var filepath = filename.replace('/sdcard/', '');
      var item = document.createElement('div');
      item.className = 'listview file';
      item.tabIndex = ti;
      ti++;
      item.innerHTML = baseFileName(file.name.substring(file.name.lastIndexOf('/') + 1));
      item.addEventListener('click', function () {
        machine(file);
      });
      if (app.appendChild(item)) {
        app.style.display = 'block';
        document.getElementById('nofilenotice').style.display = 'none';
        app.appendChild(item);
        app.style = 'z-index: 1';
      } else {
        app.style.display = 'none';
        document.getElementById('nofilenotice').style.display = 'block';
        app.style = 'z-index: 0';
      }
    }
    if (!this.done) {
      this.continue();
    }
  }

  cursor.onerror = function () {
    console.warn('No file found: ' + this.error);
    app.innerHTML = 'No file found: ' + this.error;
  }

  header.innerHTML = 'Gameboy Emulator';
  f1.innerHTML = 'Help';
  f2.innerHTML = 'OK';
  f3.innerHTML = 'Exit';
  document.body.removeEventListener('keydown', keyDown);
  document.body.removeEventListener('keyup', function (event) {
    if (event.keyCode == 27) { } else { keyUp(event); }
  });
  document.body.removeEventListener('keydown', keydownmachine);
  document.body.removeEventListener('keydown', keydownhelp);
  document.body.removeEventListener('keydown', keyDown);
  document.body.removeEventListener('keyup', keyUp);
  document.body.addEventListener('keydown', keydownlistview);
}

function externalCard() {
  var sd = navigator.getDeviceStorages('sdcard')[0];
  var ti = 0;
  var cursor = sd.enumerate();

  cursor.onsuccess = function () {
    if (this.result.name.lastIndexOf('.gb') === this.result.name.length - 3 || this.result.name.lastIndexOf('.GB') === this.result.name.length - 3 || this.result.name.lastIndexOf('.gbc') === this.result.name.length - 4 || this.result.name.lastIndexOf('.GBC') === this.result.name.length - 4) {
      var file = this.result;
      var filename = file.name;
      var filepath = filename.replace('/sdcard/', '');
      var item = document.createElement('div');
      item.className = 'listview file';
      item.tabIndex = ti;
      ti++;
      item.innerHTML = baseFileName(file.name.substring(file.name.lastIndexOf('/') + 1));
      item.addEventListener('click', function () {
        machine(file);
      });
      if (app.appendChild(item)) {
        app.style.display = 'block';
        document.getElementById('nofilenotice').style.display = 'none';
        app.appendChild(item);
        app.style = 'z-index: 1';
      } else {
        app.style.display = 'none';
        document.getElementById('nofilenotice').style.display = 'block';
        app.style = 'z-index: 0';
      }
    }
    if (!this.done) {
      this.continue();
    }
  }

  cursor.onerror = function () {
    console.warn('No file found: ' + this.error);
    app.innerHTML = 'No file found: ' + this.error;
  }


  sd = navigator.getDeviceStorages('sdcard')[1];
  var cursor = sd.enumerate();

  cursor.onsuccess = function () {
    if (this.result.name.lastIndexOf('.gb') === this.result.name.length - 3 || this.result.name.lastIndexOf('.GB') === this.result.name.length - 3 || this.result.name.lastIndexOf('.gbc') === this.result.name.length - 4 || this.result.name.lastIndexOf('.GBC') === this.result.name.length - 4) {
      var file = this.result;
      var filename = file.name;
      var filepath = filename.replace('/sdcard/', '');
      var item = document.createElement('div');
      item.className = 'listview file';
      item.tabIndex = ti;
      ti++;
      item.innerHTML = baseFileName(file.name.substring(file.name.lastIndexOf('/') + 1));
      item.addEventListener('click', function () {
        machine(file);
      });
      if (app.appendChild(item)) {
        app.style.display = 'block';
        document.getElementById('nofilenotice').style.display = 'none';
        app.appendChild(item);
        app.style = 'z-index: 1';
      } else {
        app.style.display = 'none';
        document.getElementById('nofilenotice').style.display = 'block';
        app.style = 'z-index: 0';
      }
    }
    if (!this.done) {
      this.continue();
    }
  }

  cursor.onerror = function () {
    console.warn('No file found: ' + this.error);
    app.innerHTML = 'No file found: ' + this.error;
  }

  header.innerHTML = 'Gameboy Emulator';
  f1.innerHTML = 'Help';
  f2.innerHTML = 'OK';
  f3.innerHTML = 'Exit';
  document.body.removeEventListener('keydown', keyDown);
  document.body.removeEventListener('keyup', function (event) {
    if (event.keyCode == 27) { } else { keyUp(event); }
  });
  document.body.removeEventListener('keydown', keydownhelp);
  document.body.removeEventListener('keydown', keydownmachine);
  document.body.removeEventListener('keydown', keyDown);
  document.body.removeEventListener('keyup', keyUp);
  document.body.addEventListener('keydown', keydownlistview);
}


function help() {
  var e = document.createElement('div');
  e.className = 'flex';
  e.id = 'helpScreen';
  e.innerHTML = '<div class="header" style="position: fixed; top: 0px;left: 0px;">Help (default keys)</div><div class="content"><br><center><table width="100%" style="border: 0px solid #ccc;font-size: 13px" cellspadding="0" cellspacing = "0"><tr><td>A</td><td> = </td><td>Enter/5</td></tr><tr><td>B</i></td><td> = </td><td>9</td></tr><tr><td>SELECT</i></i></td><td> = </td><td>7</td></tr><tr><td> START</i></td><td> = </td><td>0</td></tr><tr><td>UP</i></td><td> = </td><td>ArrowUp/2</td></tr><tr><td>DOWN</i></td><td> = </td><td>ArrowDown/8</td></tr><tr><td>LEFT</i></td><td> = </td><td>ArrowLeft/4</td></tr><tr><td>RIGHT</i></td><td> = </td><td>ArrowRight/6</td></tr><tr><td>Increse Speed</td><td> = </td><td>3</td></tr><tr><td>Decrese Speed</td><td> = </td><td>1</td></tr><tr><td>Save State</td><td> = </td><td>*</td></tr><tr><td>Load State</td><td> = </td><td>#</td></tr></table><center> <div class="footer"><span class="footerelement">Set</span><span class="footerelement">OK</span><span class="footerelement">Back</span></div></div>';

  document.body.appendChild(e);

  document.body.removeEventListener('keydown', keydownlistview);
  document.body.addEventListener('keydown', keydownhelp);
}



function keydownlistview(e) {
  switch (e.key) {
    case 'ArrowUp':
      nav(-1);
      break;
    case 'ArrowDown':
      nav(1);
      break;
    case 'ArrowLeft':
      nav(-1);
      break;
    case 'ArrowRight':
      nav(1);
      break;
    case 'SoftLeft':
      help();
      break;
    case 'F1':
      help();
      break;
    case 'SoftRight':
      window.close();
      break;
    case 'F2':
      window.close();
      break;
    case 'Enter':
      document.activeElement.click();
      break;
  }
  function nav(move) {
    var currentIndex = document.activeElement.tabIndex;
    var next = currentIndex + move;
    var items = document.querySelectorAll('.file');
    var targetElement = items[next];
    targetElement.focus();
    targetElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

function keydownhelp(e) {
  if (e.key == 'SoftRight' || e.key == 'F2') {
    document.body.removeChild(document.querySelector('#helpScreen'));
    main();
  }
  if (e.key == 'SoftLeft' || e.key == 'F1') {
    window.location.href = 'keybind.html';
  }
}

function machine(file) {
  //window.location.href = 'machine.html?f='+files;

  document.getElementById('blur').style.display = 'block';
  var binaryHandle = new FileReader();
  binaryHandle.onload = function () {
    if (this.readyState == 2) {
      cout('file loaded.', 0);
      try {
        start(mainCanvas, this.result);
      }
      catch (error) {
        alert(error.message + ' file: ' + error.fileName + ' line: ' + error.lineNumber);
      }
    }
    else {
      cout('loading file, please wait...', 0);
    }
  }

  f3.innerHTML = 'Back';
  f2.innerHTML = '1.00x';
  f1.innerHTML = '';
  binaryHandle.readAsBinaryString(file);
  document.getElementById('header').innerHTML = baseFileName(file.name);
  document.body.removeEventListener('keydown', keydownlistview);
  document.body.addEventListener('keydown', keydownmachine);
  document.body.addEventListener('keydown', keyDown);
  document.body.addEventListener('keyup', keyUp);
}

function keydownmachine(e) {
  if (e.key == 'F2' || e.key == 'SoftRight') { window.location.reload(); }
  if (e.key == 1) {
    if (GameBoyEmulatorInitialized()) {
      speed -= 0.1;
      gameboy.setSpeed(speed);
      f2.innerHTML = '<span style="color: yellow">' + speed.toFixed(2) + 'x</span>';
    }
  }
  if (e.key == 3) {
    if (GameBoyEmulatorInitialized()) {
      speed += 0.1;
      gameboy.setSpeed(speed);
      f2.innerHTML = '<span style="color: yellow">' + speed.toFixed(2) + 'x</span>';
    }
  }
  if (e.key == '*') {
    if (navigator.getDeviceStorages('sdcard')[0]) {
      var sdcard = navigator.getDeviceStorages('sdcard')[0];
      sdcard.delete('gameboy_emul/state_' + gameboy.name + '.data');
      var file = new Blob([JSON.stringify(gameboy.saveState())], { type: 'application/json' });
      var req = sdcard.addNamed(file, 'gameboy_emul/state_' + gameboy.name + '.data');
      req.onsuccess = function () {
        alert('State Saved Successfully.');
      }
      req.onerror = function () {
        alert(this.error);
      }
    } else {
      createTextFile('state_' + gameboy.name + '.data', gameboy.saveState());
    }

    /*saveState('state_'+gameboy.name);*/
  }

  if (e.key == '#' || e.key == '/') {

    /*  if(localStorage.getItem('state_'+gameboy.name)!=null) { openState('state_'+gameboy.name, mainCanvas); } else { alert('no saved state found'); }*/

    if (navigator.getDeviceStorages('sdcard')[0]) {
      var sdcard = navigator.getDeviceStorages('sdcard')[0];
      var request = sdcard.get('gameboy_emul/state_' + gameboy.name + '.data');

      request.onsuccess = function () {
        var reader = new FileReader()
        reader.onload = function () {
          var slotObject = null;
          try {
            slotObject = JSON.parse(reader.result);
          } catch (e) {
            console.log('Corrupt save data!')
          }
          if (slotObject) {
            clearLastEmulation();
            gameboy = new GameBoyCore(mainCanvas, '');
            gameboy.savedStateFileName = 'state_' + gameboy.name + '.data';
            gameboy.returnFromState(slotObject);
            run();
          }
          else run();
        }
        reader.readAsBinaryString(request.result);
      }
      request.onerror = function (e) {
        alert('No State Saved For This Rom');
      }

    }

    else {
      var e = document.createElement('input');
      e.type = 'file';
      e.addEventListener('change', function () {
        file = this.files[0];
        filename = this.files[0].name.replace('.data', '');
        var reader = new FileReader()
        reader.onload = function () {
          var slotObject = null;
          try {
            slotObject = JSON.parse(reader.result);
          } catch (e) {
            console.log('Corrupt save data!')
          }
          if (slotObject) {
            clearLastEmulation();
            gameboy = new GameBoyCore(mainCanvas, '');
            gameboy.savedStateFileName = 'state_' + gameboy.name + '.data';
            gameboy.returnFromState(slotObject);
            run();
          }
          else run();
        }
        reader.readAsBinaryString(this.files[0]);
      });
      document.body.appendChild(e);
      e.click();
      document.body.removeChild(e);
    }
  }
}


function relasenote() {
  if (localStorage.getItem('viewrelesenote') == null) {
    document.body.style = 'background:#fff; padding:10px';
    document.body.innerHTML = '<b><center>- Relese -</center></b><br><font style="font-size: 12px"><b>Version <span id="version">1.0.0</span></b><br><br><small>* Fix Few Bugs<br>* Set Your Own Key</small></font><div style="width: 100%;text-align: center; font-weight: bold;background: #dedede; padding:5px 0px; margin-top:10px; position: fixed; left: 0px;bottom: 0px;">OK</div>';
    document.addEventListener('keydown', function (e) {
      if (e.key == 'Enter') {
        localStorage.setItem('viewrelesenote', 'yes');
        if (window.confirm('Restart Required. Want To Continue ?')) { window.close(); }
      }
    });
  } else { main(); }
}

try { relasenote(); } catch (e) { alert(e.message); }


document.addEventListener('DOMContentLoaded', (() => { getKaiAd({ publisher: '080b82ab-b33a-4763-a498-50f464567e49', app: 'gameboy_emul', slot: 'gameboy_emul', onerror: e => { }, onready: e => { e.call('display') } }) }));

document.body.addEventListener('keyup', (() => { getKaiAd({ publisher: '080b82ab-b33a-4763-a498-50f464567e49', app: 'gameboy_emul', slot: 'gameboy_emul', onerror: e => { }, onready: e => { e.call('display') } }) }));


document.body.addEventListener('click', function () {
  console.info('Width: ' + window.innerWidth + '\nHeight: ' + window.innerHeight);
});




var xhttp = new XMLHttpRequest();
xhttp.onload = function () {
  var json = JSON.parse(this.responseText);
  var v = json.version;
  document.getElementById('version').innerHTML = v;
}
xhttp.open('GET', 'manifest.webapp', true);
xhttp.send();