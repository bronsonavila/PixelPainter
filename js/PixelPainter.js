function PixelPainter(width, height) {
  let pixelPainterDiv = document.getElementById('pixelPainter');
  let paletteColors;
  let paintBrushColor;

  function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function rainbow(p, length) {
    var rgb = HSVtoRGB(p / length * 0.5, 1.0, 1.0);
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
  }

  function buildGrid(width, height, id, rowClass, cellClass) {
    var grid = document.createElement('div');
    for (let i = 0; i < height; i++) {
      // Create div that will be a new row:
      const row = document.createElement('div');
      row.className = rowClass;
      for (let j = 0; j < width; j++) {
        // Append cell to new row:
        const cell = document.createElement('div');
        cell.className = cellClass;
        row.appendChild(cell);
      }
      // Append new row to #pixelPainter:
      grid.appendChild(row);
    }
    grid.id = id;
    return grid;
  }

  // Create canvas:
  var canvas = buildGrid(width, height, 'canvas', 'canvas-row', 'canvas-cell');
  pixelPainterDiv.appendChild(canvas);

  // Create palette:
  var palette = buildGrid(16, 2, 'palette', 'palette-row', 'palette-cell');
  pixelPainterDiv.appendChild(palette);
  paletteColors = document.getElementsByClassName('palette-cell');

  // Set palette colors:
  for (let i = 0; i < paletteColors.length; i++) {
    paletteColors[i].style.background = rainbow(i, paletteColors.length / 2);
  }

  // Set paintbrush color upon clicking palette element:
  for (let i = 0; i < paletteColors.length; i++) {
    (function(i) {
      paletteColors[i].addEventListener('click', function() {
        paintBrushColor = this.style.background;
      });
    })(i);
  }

}

PixelPainter(30, 30);