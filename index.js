const fs = require('fs');
const Canvas = require('canvas');
const pixelUtil= require('pixel-util');
const pinyin = require('chinese-to-pinyin');
const QRCode = require('qrcode');

// A simple test here
// TODO: command line tool support
const id = pinyin('羡辙', { removeTone: true }).split(' ').join('-');
run('./test/input.jpg', 'http://zhangwenli.com/?ref=', 758, 1613, 340, 340, '羡 辙', 443, 1728, '#333', '100px bold "PingFang SC"', id);

function run(
    imgUrl, baseUrl,
    qrX, qrY, qrWidth, qrHeight,
    name, nameCenterX, nameCenterY, nameColor, nameFont,
    id
) {
    createCanvasContext(imgUrl, ctx => {
        // Write name
        ctx.textAlign = 'center';
        ctx.font = nameFont;
        ctx.fillStyle = nameColor;
        ctx.fillText(name, nameCenterX, nameCenterY);

        // Write QR code
        const link = baseUrl + id;
        const qrCanvas = Canvas.createCanvas(qrWidth, qrHeight);
        QRCode.toCanvas(qrCanvas, link, () => {
            ctx.drawImage(qrCanvas, qrX, qrY, qrWidth, qrHeight);
            // Write to file
            writeCanvas(ctx, 'test/output.jpg');
        });
    });
}

function createCanvasContext(imgUrl, callback) {
    pixelUtil.createBuffer(imgUrl).then(function(buffer){
        const img = new Canvas.Image;
        img.src = buffer;
        const canvas = new Canvas.createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        callback(ctx);
    });
}

function writeCanvas(ctx, url) {
    const base64 = ctx.canvas.toDataURL();
    const data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(url, buf);
}
