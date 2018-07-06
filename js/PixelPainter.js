function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const heading = document.getElementsByTagName('h1')[0];
  let pointerIsDown = false;
  let colorRange = 360;
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

  function changeHeading() {
    heading.innerHTML =
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

  function handlePaletteCells() {
    paintBrushColor = this.style.background;
    // Place white highlight only around selected color:
    if (this.className !== 'palette-cell select-color') {
      for (let i = 0; i < paletteCells.length; i++) {
        paletteCells[i].classList.remove('select-color');
      }
      this.classList.add('select-color');
    }
  }

  function handlePointerDown() {
    pointerIsDown = true;
    this.style.background = paintBrushColor;
  }

  function handlePointerUp() {
    pointerIsDown = false;
  }

  function handlePointerMove(event) {
    if (pointerIsDown) {
      event.preventDefault();
      const x = event.pageX;
      const y = event.pageY;
      const element = document.elementFromPoint(x, y);
      if (element && element.classList.contains('canvas-cell')) {
        element.style.background = paintBrushColor;
      }
    }
  }

  function handleClearButton() {
    animateButton(this, 'press-clear');
    for (let i = 0; i < canvasCells.length; i++) {
      canvasCells[i].style.background = 'rgb(255, 255, 255)';
    }
  }

  function animateButton(btn, $class) {
    btn.classList.toggle($class);
    setTimeout(function() {
      btn.classList.toggle($class);
    }, 50);
  }

  function easterEgg() {
    for (let i = 0, hue = 0, ms = 0; i < canvasCells.length; i++) {
      setTimeout(function() {
        canvasCells[i].style.background = makeColor(hue);
      }, ms);
      hue += colorRange / canvasCells.length;
      ms += 1000 / canvasCells.length;
    }
    colorRange = Math.round(colorRange * 2.333);
    if (colorRange > Math.pow(2, 26)) {
      colorRange = 360;
    }
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

  // Create "clear" button:
  const clearButton = document.createElement('button');
  clearButton.className = 'clear-button';
  clearButton.textContent = 'CLEAR';
  pixelPainterDiv.appendChild(clearButton);

  // ----------------------------------------------------------------------- //

  // Set heading colors:
  changeHeading();
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue);
    hue += 360 / (headingLetters.length / 0.5);
    heading.style.opacity = '1';
  }

  // Set palette colors:
  for (let i = 0, hue = 0, rgb = 0; i < paletteCells.length; i++) {
    if (i < paletteCells.length * 0.8) {
      paletteCells[i].style.background = makeColor(hue);
      hue += 360 / (paletteCells.length * 0.8);
    } else {
      paletteCells[i].style.background = makeGrayscale(rgb);
      rgb += Math.round(256 / ((width / 2) - 1));
    }
  }

  // Set paintbrush color upon clicking palette element:
  for (let i = 0; i < paletteCells.length; i++) {
    paletteCells[i].addEventListener('click', handlePaletteCells);
  }

  // Set canvas cell background to match paintbrush color:
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('pointerdown', handlePointerDown);
    canvasCells[i].addEventListener('pointerup', handlePointerUp);
    canvasCells[i].addEventListener('pointermove', handlePointerMove);
  }

  // Prevent 'pointermove' from coloring cells while pointer is not down:
  document.body.addEventListener('pointerup', handlePointerUp);

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', handleClearButton);

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');

  // Easter Egg - Click first letter of heading to create rainbow canvas:
  headingLetters[0].addEventListener('click', easterEgg);
}

PixelPainter(16, 16);
