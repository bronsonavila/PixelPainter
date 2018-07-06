function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const heading = document.getElementsByTagName('h1')[0];
  let mouseIsDown = false;
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

  function handleMouseDown() {
    mouseIsDown = true;
    this.style.background = paintBrushColor;
  }

  function handleMouseUp() {
    mouseIsDown = false;
  }

  function handleMouseOver() {
    if (mouseIsDown) {
      this.style.background = paintBrushColor;
    }
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
    // Remove .select-erase from "erase" button:
    eraseButton.classList.remove('select-erase');
  }

  function handleTouchStart(event) {
    event.preventDefault();
    this.style.background = paintBrushColor;
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const x = event.touches[0].pageX;
    const y = event.touches[0].pageY;
    const element = document.elementFromPoint(x, y);
    if (element && element.classList.contains('canvas-cell')) {
      element.style.background = paintBrushColor;
    }
  }

  function handleEraseButton() {
    animateButton(this, 'press-erase');
    paintBrushColor = 'rgb(255, 255, 255)';
    this.classList.add('select-erase');
    // Remove white highlight around any currently selected palette color:
    for (let i = 0; i < paletteCells.length; i++) {
      paletteCells[i].classList.remove('select-color');
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
    colorRange *= 2;
    if (colorRange === 184320) {
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

  // Set heading colors:
  changeHeading();
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue);
    hue += 360 / (headingLetters.length / 0.5);
    heading.style.opacity = '1';
  }

  // Set paintbrush color upon clicking palette element:
  for (let i = 0; i < paletteCells.length; i++) {
    paletteCells[i].addEventListener('click', handlePaletteCells);
  }

  // Set canvas cell background to match paintbrush color (MOUSE):
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('mousedown', handleMouseDown);
    canvasCells[i].addEventListener('mouseup', handleMouseUp);
    canvasCells[i].addEventListener('mouseover', handleMouseOver);
  }

  // Prevent 'mouseover' from coloring cells while mouse is not clicked down:
  document.body.addEventListener('mouseup', handleMouseUp);

  // Set canvas cell background to match paintbrush color (TOUCH):
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('touchstart', handleTouchStart);
    canvasCells[i].addEventListener('touchmove', handleTouchMove);
  }

  // Set paintbrush color to white upon clicking "erase":
  eraseButton.addEventListener('click', handleEraseButton);

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', handleClearButton);

  // Set palette colors:
  for (let i = 0, hue = 0, rgb = 0; i < paletteCells.length; i++) {
    if (i < paletteCells.length * 0.8) {
      paletteCells[i].style.background = makeColor(hue);
      hue += 360 / (paletteCells.length * 0.8);
    } else {
      paletteCells[i].style.background = makeGrayscale(rgb);
      rgb += Math.round(255 / (width / 2));
    }
  }

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');

  // Easter Egg - Click first letter of heading to create rainbow canvas:
  headingLetters[0].addEventListener('click', easterEgg);
}

PixelPainter(16, 16);
