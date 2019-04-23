const glob = require('glob');

const getPixels = require('get-pixels')
const GifEncoder = require('gif-encoder');
const gif = new GifEncoder(498, 374);
const file = require('fs').createWriteStream('mygif.gif');

gif.pipe(file);
gif.setQuality(20);
gif.setDelay(100);
gif.writeHeader();

const addToGif = function(images, counter = 0) {
  getPixels(images[counter], function(err, pixels) {
    gif.addFrame(pixels.data);
    gif.read();
    if (counter === images.length - 1) {
      gif.finish();
    } else {
      addToGif(images, ++counter);
    }
  })
}

module.exports = async (globPattern) => {
  // convert a PNG to a JPEG
  glob(globPattern, async (error, files) => {
    if(error) throw error;
    addToGif(files)
  })
}
