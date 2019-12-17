const fs = require('fs');
const {createCanvas, loadImage, registerFont} = require('canvas');
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
const request = require('request-promise');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Check code and docs at: https://github.com/TasosY2K/quote-image-api');
});

app.get('/generate', async function (req, res) {
  console.log(req.query);

  let quote = await request('https://api.quotable.io/random', {json: true});

  let resolutions = [[1080, 1080], [1080, 608], [1920, 1080]];
  let pair = req.query.width && req.query.height ? [Number.parseInt(req.query.width), Number.parseInt(req.query.height)] : resolutions[Math.floor(Math.random() * resolutions.length)];

  let fonts = ['Arial','Times New Roman','Courier New','Courier','Verdana','Georgia','Trebuchet MS','Arial Black','Impact'];

  const canvas = createCanvas(pair[0], pair[1], 'jpg');
  const ctx = canvas.getContext('2d');

  loadImage(`https://picsum.photos/${pair[0]}/${pair[1]}`).then((image) => {
    let font = fonts[Math.floor(Math.random() * fonts.length) + 1];
    ctx.drawImage(image, 0 , 0, pair[0], pair[1]);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';

    ctx.globalCompositeOperation = req.query.invert && Boolean.valueOf(req.query.invert) ? 'difference' : 'normal';

    CanvasTextWrapper(canvas, quote.content, {font: `60px ${font}`, textAlign: 'center', verticalAlign: 'middle', strokeText: true, paddingX: 100});

    let stream = canvas.createJPEGStream({quality: 0.95, chromaSubsampling: false});

    stream.pipe(res);
  });
});

app.listen(3000, () => {
    console.log('Listening on port 3000\nCheck code and docs at: https://github.com/TasosY2K/quote-image-api');
});
