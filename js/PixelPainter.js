function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const headingColl = document.getElementsByTagName('h1');
  let headingLetters;
  let canvasCells;
  let paletteCells;
  let paintBrushColor;

  // ----------------------------------------------------------------------- //

  function buildGrid(width, height, id, rowClass, cellClass) {
    const grid = document.createElement('div');
    for (let i = 0; i < height; i++) {
      const row = document.createElement('div');
      row.className = rowClass;
      for (let j = 0; j < width; j++) {
        const cell = document.createElement('div');
        cell.className = cellClass;
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
    grid.id = id;
    return grid;
  }

  function animateButton(btn, $class) {
    btn.classList.toggle($class);
    setTimeout(function() {
      btn.classList.toggle($class);
    }, 50);
  }

  function changeHeading() {
    headingColl[0].innerHTML =
      '<span class="heading">P</span>' +
      '<span class="heading">i</span>' +
      '<span class="heading">x</span>' +
      '<span class="heading">e</span>' +
      '<span class="heading">l</span>' +
      ' ' +
      '<span class="heading">P</span>' +
      '<span class="heading">a</span>' +
      '<span class="heading">i</span>' +
      '<span class="heading">n</span>' +
      '<span class="heading">t</span>' +
      '<span class="heading">e</span>' +
      '<span class="heading">r</span>';
    headingLetters = document.getElementsByClassName('heading');
  }

  function makeColor(num) {
    return 'hsl(' + num + ', 100%, 50%)';
  }

  function makeGrayscale(num) {
    return 'rgb(' + num + ',' + num + ',' + num + ')';
  }

  // ----------------------------------------------------------------------- //

  // Create "canvas" grid:
  const canvas = buildGrid(width, height, 'canvas', 'canvas-row', 'canvas-cell');
  pixelPainterDiv.appendChild(canvas);
  canvasCells = document.getElementsByClassName('canvas-cell');

  // Create "palette" grid:
  const palette = buildGrid(8, 5, 'palette', 'palette-row', 'palette-cell');
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

  // ----------------------------------------------------------------------- //

  // Set paintbrush color upon clicking palette element:
  for (let i = 0; i < paletteCells.length; i++) {
    paletteCells[i].addEventListener('click', function() {
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

  // Set canvas cell background to match paintbrush color (MOUSE):
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('mousedown', function() {
      this.style.background = paintBrushColor;
    });
    canvasCells[i].addEventListener('mouseover', function(event) {
      // Source (Stack Overflow): https://goo.gl/yYrFgz
      if (event.which === 1 || event.which === 3) {
        this.style.background = paintBrushColor;
      }
    });
  }

  // Set canvas cell background to match paintbrush color (TOUCH):
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('touchstart', function(event) {
      event.preventDefault();
      this.style.background = paintBrushColor;
    });
    canvasCells[i].addEventListener('touchmove', function(event) {
      event.preventDefault();
      const x = event.touches[0].pageX;
      const y = event.touches[0].pageY;
      const element = document.elementFromPoint(x, y);
      if (element && element.classList.contains('canvas-cell')) {
        element.style.background = paintBrushColor;
      }
    });
  }

  // Set paintbrush color to white upon clicking "erase":
  eraseButton.addEventListener('click', function() {
    animateButton(this, 'press-erase');
    paintBrushColor = 'rgb(255, 255, 255)';
    this.classList.add('select-erase');
    // Remove white highlight around any currently selected palette color:
    for (let i = 0; i < paletteCells.length; i++) {
      paletteCells[i].classList.remove('select-color');
    }
  });

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', function() {
    animateButton(this, 'press-clear');
    for (let i = 0; i < canvasCells.length; i++) {
      canvasCells[i].style.background = 'rgb(255, 255, 255)';
    }
  });

  // ----------------------------------------------------------------------- //

  // Set heading colors:
  changeHeading();
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue);
    hue += (360 / (headingLetters.length / 0.5));
  }

  // Set palette colors:
  for (let i = 0, hue = 0, rgb = 0; i < paletteCells.length; i++) {
    if (i < paletteCells.length * 0.8) {
      paletteCells[i].style.background = makeColor(hue);
      hue += (360 / (paletteCells.length * 0.8));
    } else {
      paletteCells[i].style.background = makeGrayscale(rgb);
      rgb += Math.round(255 / 8);
    }
  }

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');
}

PixelPainter(16, 16);
