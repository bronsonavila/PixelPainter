function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  let canvasCells;
  let paletteCells;
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
    const grid = document.createElement('div');
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

  function animateButton(btn, $class) {
    btn.classList.toggle($class);
    setTimeout(function () {
      btn.classList.toggle($class);
    }, 50);
  }

  // Create "canvas" grid:
  const canvas = buildGrid(width, height, 'canvas', 'canvas-row', 'canvas-cell');
  pixelPainterDiv.appendChild(canvas);
  canvasCells = document.getElementsByClassName('canvas-cell');

  // Create "palette" grid:
  const palette = buildGrid(8, 4, 'palette', 'palette-row', 'palette-cell');
  pixelPainterDiv.appendChild(palette);
  paletteCells = document.getElementsByClassName('palette-cell');

  // Create container for "options" bar:
  const options = document.createElement('div');
  options.id = 'options';
  pixelPainterDiv.appendChild(options);

  // Create "erase" button:
  const eraseButton = document.createElement('button');
  eraseButton.className = 'erase-button';
  eraseButton.textContent = 'ERASE';
  options.appendChild(eraseButton);

  // Create "clear" button:
  const clearButton = document.createElement('button');
  clearButton.className = 'clear-button';
  clearButton.textContent = 'CLEAR';
  options.appendChild(clearButton);

  // Set palette colors:
  for (let i = 0; i < paletteCells.length; i++) {
    paletteCells[i].style.background = rainbow(i, paletteCells.length / 2);
  }

  // Set paintbrush color upon clicking palette element:
  for (let i = 0; i < paletteCells.length; i++) {
    paletteCells[i].addEventListener('click', function () {
      paintBrushColor = this.style.background;
      // Place white highlight only around selected color:
      if (this.className !== 'palette-cell select-color') {
        for (let i = 0; i < paletteCells.length; i++) {
          paletteCells[i].classList.remove('select-color');
        }
        this.classList.add('select-color');
      }
      // Remove .select-erase from "erase" button:
      eraseButton.classList.remove('select-erase');
    });
  }

  // Set canvas cell background to match paintbrush color:
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('mousedown', function () {
      this.style.background = paintBrushColor;
    });
    canvasCells[i].addEventListener('mouseover', function (event) {
      if (event.which === 1 || event.which === 3) {
        this.style.background = paintBrushColor;
      }
    });
  }

  // Set paintbrush color to white upon clicking "erase":
  eraseButton.addEventListener('click', function () {
    animateButton(this, 'press-erase');
    paintBrushColor = 'rgb(255, 255, 255)';
    this.classList.add('select-erase');
    // Remove white highlight around any currently selected palette color:
    for (let i = 0; i < paletteCells.length; i++) {
      paletteCells[i].classList.remove('select-color');

    }
  })

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', function () {
    animateButton(this, 'press-clear');
    for (let i = 0; i < canvasCells.length; i++) {
      canvasCells[i].style.background = 'rgb(255, 255, 255)';
    }
  })

    // Set default color upon initialization:
    paintBrushColor = paletteCells[0].style.background;
    paletteCells[0].classList.add('select-color');

}

PixelPainter(20, 20);