const mangso = [ 'không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín' ];

function dochangchuc(so, daydu) {
    let chuoi = '', chuc = ~~(so / 10), donvi = so % 10;
    if (chuc > 1) {
        chuoi = ' ' + mangso[ chuc ] + ' mươi';
        if (donvi === 1) {
            chuoi += ' mốt';
        }
    } else if (chuc === 1) {
        chuoi = ' mười';
        if (donvi === 1) {
            chuoi += ' một';
        }
    } else if (daydu && donvi > 0) {
        chuoi = ' lẻ';
    }
    if (donvi === 5 && chuc > 1) {
        chuoi += ' lăm';
    } else if (donvi > 1 || (donvi === 1 && chuc === 0)) {
        chuoi += ' ' + mangso[ donvi ];
    }
    return chuoi;
}

function docblock(so, daydu) {
    let chuoi = '', tram = ~~(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
        chuoi = ' ' + mangso[ tram ] + ' trăm';
        chuoi += dochangchuc(so, true);
    } else {
        chuoi = dochangchuc(so, false);
    }
    return chuoi;
}

function dochangtrieu(so, daydu) {
    let chuoi = '', trieu = ~~(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
        chuoi = docblock(trieu, daydu) + ' triệu';
        daydu = true;
    }
    let nghin = ~~(so / 1000);
    so = so % 1000;
    if (nghin > 0) {
        chuoi += docblock(nghin, daydu) + ' nghìn';
        daydu = true;
    }
    if (so > 0) {
        chuoi += docblock(so, daydu);
    }
    return chuoi;
}

const dochangty = function (so) {
    if (so === '0') return mangso[ 0 ];
    let len = so.length, tyL = len, chuoi = '', hauto = '', ty = '';
    do {
        tyL = len > 9 ? 9 : len;
        ty = Number(so.substring(len - tyL));
        so = so.substring(0, len - tyL);
        if (so > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = ' tỷ';
        len = so.length;
    } while (len > 0);
    return chuoi;
};

const docso = (so) => {
    if (typeof so !== 'string' || !(so instanceof String)) {
        so = String(so);
    }
    so = so.replace(/[^\d.]/gi, '');
    let p = so.split('.');
    let chuoi = dochangty(p[0]);
    if (p.length === 2) {
        chuoi += ' chấm gì đó ';
        // TODO
    }
    return chuoi.replace(/^\s+|\s+$/gm,'');
};

export default docso;