function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const heading = document.getElementsByTagName('h1')[0];
  const pHeight = 5;
  const pWidth = 8;
  let mouseIsDown = false;
  let colorRange = 360;
  let headingLetters;
  let canvasCells;
  let paletteColumns;
  let paletteCells;
  let paintBrushColor;

  // ----------------------------------------------------------------------- //

  function buildGrid(width, height, id, groupClass, cellClass) {
    const grid = document.createElement('div');
    for (let i = 0; i < width; i++) {
      const group = document.createElement('div');
      group.className = groupClass;
      for (let j = 0; j < height; j++) {
        const cell = document.createElement('div');
        cell.className = cellClass;
        group.appendChild(cell);
      }
      grid.appendChild(group);
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

  function makeColor(h, s, l) {
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  function makeGrayscale(val) {
    return 'rgb(' + val + ',' + val + ',' + val + ')';
  }

  function handlePaletteCells(event) {
    paintBrushColor = event.target.style.background;
    // Place white highlight only around selected color:
    if (event.target.className !== 'p-cell select-color') {
      for (let i = 0; i < paletteCells.length; i++) {
        paletteCells[i].classList.remove('select-color');
      }
      event.target.classList.add('select-color');
    }
  }

  function handleMouseDown(event) {
    mouseIsDown = true;
    event.target.style.background = paintBrushColor;
  }

  function handleMouseUp() {
    mouseIsDown = false;
  }

  function handleMouseOver(event) {
    if (mouseIsDown) {
      event.target.style.background = paintBrushColor;
    }
  }

  function handleTouchStart(event) {
    event.preventDefault();
    event.target.style.background = paintBrushColor;
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const x = event.touches[0].pageX;
    const y = event.touches[0].pageY;
    const element = document.elementFromPoint(x, y);
    if (element && element.classList.contains('c-cell')) {
      element.style.background = paintBrushColor;
    }
  }

  function handleClearButton(event) {
    animateButton(event.target, 'press-clear');
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
        canvasCells[i].style.background = makeColor(hue, 100, 50);
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
  const canvas = buildGrid(width, height, 'canvas', 'c-row', 'c-cell');
  pixelPainterDiv.appendChild(canvas);
  canvasCells = document.getElementsByClassName('c-cell');

  // Create "palette" grid:
  const palette = buildGrid(pWidth, pHeight, 'palette', 'p-column', 'p-cell');
  pixelPainterDiv.appendChild(palette);
  paletteColumns = document.getElementsByClassName('p-column');
  paletteCells = document.getElementsByClassName('p-cell');

  // Create "clear" button:
  const clearButton = document.createElement('button');
  clearButton.className = 'clear-button';
  clearButton.textContent = 'CLEAR';
  pixelPainterDiv.appendChild(clearButton);

  // ----------------------------------------------------------------------- //

  // Set heading colors:
  changeHeading();
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue, 100, 50);
    hue += 360 / (headingLetters.length / 0.5);
    heading.style.opacity = '1';
  }

  // Set palette colors:
  for (let i = 0, rgb = 0; i < paletteColumns.length; i++) {
    const hues = [0, 30, 60, 120, 240, 280, 320]; // ROYGBIV
    const columnCells = paletteColumns[i].children;
    for (let j = 0, l = 50; j < pHeight; j++) {
      if (i < paletteColumns.length - 1) {
        columnCells[j].style.background = makeColor(hues[i], 100, l);
        l += 10; // Lighten colors on each iteration.
      } else {
        columnCells[j].style.background = makeGrayscale(rgb);
        rgb += Math.round(256 / (width / 4));
      }
    }
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

  // Set canvas cell background to match paintbrush color (TOUCH):
  for (let i = 0; i < canvasCells.length; i++) {
    canvasCells[i].addEventListener('touchstart', handleTouchStart);
    canvasCells[i].addEventListener('touchmove', handleTouchMove);
  }

  // Prevent 'pointermove' from coloring cells while pointer is not down:
  document.body.addEventListener('mouseup', handleMouseUp);

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', handleClearButton);

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');

  // Easter Egg - Click first letter of heading to create rainbow canvas:
  headingLetters[0].addEventListener('click', easterEgg);
}

PixelPainter(16, 16);
