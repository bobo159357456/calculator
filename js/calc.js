var end = true;

$(document).ready(function() {
    var keys = [
        'CE' , 'C' , '←' , '/',
        '7' , '8'  , '9' , '*',
        '4' , '5'  , '6' , '-',
        '1' , '2'  , '3' , '+',
        '0' , '.'  , '±' , '='
    ];
    var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var greens = ['='];

    var cols = [];
    for(var i = 0, id = 0; i < 4; i++) {
      var col = document.createElement('div');
      col.setAttribute('class', 'col-xs-3 keycol');
      keyboard.appendChild(col);
      cols[i] = col;
    }

    for(var i = 0, id = 0; i < 5; i++) {
      for(var j = 0; j < 4 && id < keys.length; j++, id++) {
        var button = document.createElement('button');
        
        button.innerText = keys[id];
        button.setAttribute('class', 'key btn btn-default');
        button.setAttribute('id', 'key-' + keys[id]);
        if(greens.indexOf(button.innerText) >= 0) {
            button.setAttribute('class', 'key btn btn-default green');
        }

        if(nums.indexOf(button.innerText) >= 0) {
            button.addEventListener('click', onNumClick);
        } else {
            button.addEventListener('click', onKeyClick);
        }

        cols[j].appendChild(button);
      }
    }

    document.onselect = returnFalse;
    document.oncontextmenu = returnFalse;
    document.onselectstart = returnFalse;

    window.onresize = function() {
        $('input').css('z-index', '1');
        $('button').css('z-index', '1');

        if(window.hex !== undefined) {
            var rect = hex.screen.windowRect;
            var width = rect.right - rect.left;
            var height = rect.bottom - rect.top;

            if(height < document.body.offsetHeight + 50) {
                hex.sizeTo(width, document.body.offsetHeight + 50);
            }
        }
    }

    window.onKeyClick = function() {
        // TODO 按键输入数字/符号
    }

    document.body.onmousedown = function() {
        document.body.onmousedown = null;
        result.value = '0';
        $(result).css('text-align', '');
        return false;
    }
});

function returnFalse(e) {
    return false;
}

function onNumClick(e) {
    var keyName = e.target.innerText;

    if(keyName != '0' || result.value != '0') {
        if(end) {
            result.value = '';
            end = false;
        }
        result.value += keyName;
    }
}

function onKeyClick(e) {
    var keyName = e.target.innerText;

    if('+-*/'.indexOf(keyName) >= 0) {
        if(end) {
            if(formula.value !== '') {
                formula.value = formula.value.substr(0, formula.value.length - 2);
                formula.value += keyName + ' '
            } else {
                formula.value = result.value + ' ' + keyName + ' ';
            }
            return;
        }

        if(formula.value === '') {
            formula.value = result.value + ' ' + keyName + ' ';
        } else {
            formula.value += result.value;
            result.value = eval(formula.value);
            formula.value += ' ' + keyName + ' '
        }

        end = true;
    } else {
        switch(keyName) {
        case 'CE':
            formula.value = '';
        case 'C':
            result.value = '0';
            end = true;
            break;
        case '←':
            if(!end && result.value.length >= 1) {
                result.value = result.value.substr(0, result.value.length - 1);
            }
            break;
        case '.':
            if(result.value.indexOf('.') < 0) {
                result.value += '.';
            }
            break;
        case '±':
            if(!end) {
                if(result.value.substr(0, 1) == '-') {
                    result.value = result.value.substr(1, result.value.length - 1);
                } else {
                    result.value = '-' + result.value;
                }
            }
            break;
        case '=':
            if(formula.value !== '') {
                if(end) {
                    formula.value = formula.value.substr(0, formula.value.length - 3);
                } else {
                    formula.value += result.value;
                }
                result.value = eval(formula.value);
                formula.value = '';
                end = true;
            }
            break;
        }
    }
}
