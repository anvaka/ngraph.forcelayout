// Label images. Each label is drawn once with the canvas 2D API (so any script, with the
// browser's kerning and shaping) into a canvas that mirrors a texture, at the device's pixel
// ratio, so text stays sharp at its fixed size on screen. The text is drawn red over a green halo:
// once in a texture (premultiplied), red is the text's coverage and green the halo's, and the
// shader colors each.
//
// Space is handed out in shelves (rows of equal height). When the atlas is full it starts over,
// and whoever asks for a label again draws it again.

const WIDTH = 2048, HEIGHT = 1024;
// Pixels kept clear around each image, so filtering never reads a neighbour
const PAD = 1;

export function createLabelAtlas(gl) {
  let canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  let context = canvas.getContext('2d', {willReadFrequently: true});
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, WIDTH, HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  let shelves = [];
  let bottom = 0;
  let entries = new Map();
  let dirty = null;
  let generation = 0;

  return {
    texture,
    width: WIDTH,
    height: HEIGHT,
    /** Increases every time the atlas starts over (entries from before are gone) */
    get generation() { return generation; },
    get(key) {
      return entries.get(key);
    },
    /** Width of `text` in `font` (a CSS font), in the font's pixels */
    measure(text, font) {
      context.font = font;
      return context.measureText(text).width;
    },
    /**
     * Draws `text` in `font` (CSS font, sized in device pixels) with a halo `halo` device pixels
     * wide, into a box of `width` x `height` device pixels. Returns {x, y, width, height} in the
     * atlas, or null when it is full.
     */
    add(key, text, font, halo, width, height) {
      let known = entries.get(key);
      if (known) return known;
      let at = allocate(width + 2 * PAD, height + 2 * PAD);
      if (!at) return null;
      let entry = {x: at.x + PAD, y: at.y + PAD, width, height};
      context.save();
      context.beginPath();
      context.rect(entry.x, entry.y, width, height);
      context.clip();
      context.font = font;
      context.textBaseline = 'middle';
      context.textAlign = 'left';
      context.lineJoin = 'round';
      let x = entry.x + halo + 1, y = entry.y + height / 2;
      if (halo > 0) {
        context.lineWidth = 2 * halo;
        context.strokeStyle = '#00ff00';
        context.strokeText(text, x, y);
      }
      context.fillStyle = '#ff0000';
      context.fillText(text, x, y);
      context.restore();
      entries.set(key, entry);
      grow(entry);
      return entry;
    },
    /** Sends what was drawn since the last call to the texture */
    upload() {
      if (!dirty) return;
      let x = dirty.x0, y = dirty.y0, w = dirty.x1 - dirty.x0, h = dirty.y1 - dirty.y0;
      dirty = null;
      if (w <= 0 || h <= 0) return;
      let image = context.getImageData(x, y, w, h);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    },
    /** Forgets every image */
    reset() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      shelves = [];
      bottom = 0;
      entries.clear();
      generation += 1;
      // The texture keeps its old pixels: every new image (and its padding) is uploaded over them
    },
    dispose() {
      gl.deleteTexture(texture);
      entries.clear();
    }
  };

  function allocate(width, height) {
    if (width > WIDTH) return null;
    for (let i = 0; i < shelves.length; ++i) {
      let shelf = shelves[i];
      if (shelf.height === height && shelf.x + width <= WIDTH) {
        let at = {x: shelf.x, y: shelf.y};
        shelf.x += width;
        return at;
      }
    }
    if (bottom + height > HEIGHT) return null;
    let shelf = {y: bottom, height, x: width};
    shelves.push(shelf);
    bottom += height;
    return {x: 0, y: shelf.y};
  }

  function grow(entry) {
    let x0 = entry.x - PAD, y0 = entry.y - PAD, x1 = entry.x + entry.width + PAD, y1 = entry.y + entry.height + PAD;
    if (!dirty) dirty = {x0, y0, x1, y1};
    else {
      dirty.x0 = Math.min(dirty.x0, x0);
      dirty.y0 = Math.min(dirty.y0, y0);
      dirty.x1 = Math.max(dirty.x1, x1);
      dirty.y1 = Math.max(dirty.y1, y1);
    }
  }
}
