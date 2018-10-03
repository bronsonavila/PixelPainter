'use strict';

function pixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const heading = document.getElementsByTagName('h1')[0];
  const headingLetters = document.getElementsByClassName('heading');
  const paletteWidth = 8; // Must be set to 8 for proper color arrangement.
  const paletteHeight = 5;
  let mouseIsDown = false;
  let colorRange = 360;
  let mode = 'brush';
  let canvasCells;
  let paletteColumns;
  let paletteCells;
  let paintBrushColor;

  // ----------------------=[  BUILD HTML ELEMENTS  ]=---------------------- //

  // Create "canvas" grid:
  const canvas = buildGrid(
    width,
    height,
    'canvas',
    'canvas-column',
    'canvas-cell'
  );
  pixelPainterDiv.appendChild(canvas);
  canvasCells = document.getElementsByClassName('canvas-cell');

  // Create "palette" grid:
  const palette = buildGrid(
    paletteWidth,
    paletteHeight,
    'palette',
    'palette-column',
    'palette-cell'
  );
  pixelPainterDiv.appendChild(palette);
  paletteColumns = document.getElementsByClassName('palette-column');
  paletteCells = document.getElementsByClassName('palette-cell');

  // Set palette colors:
  for (let i = 0, rgb = 0; i < paletteColumns.length; i++) {
    const hues = [0, 30, 60, 120, 240, 280, 320]; // ROYGBIV
    const columnCells = paletteColumns[i].children;

    // Lightness must initially be set to 50 for maximum color intensity:
    for (let j = 0, lightness = 50; j < paletteHeight; j++) {
      if (i < paletteColumns.length - 1) {
        // Creates 7 ROYGBIV color columns in varying degrees of lightness:
        columnCells[j].style.background = makeColor(hues[i], 100, lightness);
        lightness += 50 / paletteHeight; // Lighten colors on each iteration.
      } else {
        // Creates 1 grayscale color column (including pure white):
        columnCells[j].style.background = makeGrayscale(rgb);
        rgb += 256 / (paletteHeight - 1);
      }
    }
  }

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');

  // Create container for "options" bar:
  const options = document.createElement('div');
  options.id = 'options';
  pixelPainterDiv.appendChild(options);

  // Create "paintbrush" button:
  const brushButton = document.createElement('button');
  brushButton.className = 'brush-button select-mode';
  brushButton.innerHTML = '<span data-jam="brush"></span>';
  options.appendChild(brushButton);

  // Create "clear" button:
  const clearButton = document.createElement('button');
  clearButton.className = 'clear-button';
  clearButton.textContent = 'CLEAR';
  options.appendChild(clearButton);

  // Create "fill" button:
  const fillButton = document.createElement('button');
  fillButton.className = 'fill-button';
  fillButton.innerHTML = '<span data-jam="water-drop"></span>';
  options.appendChild(fillButton);

  // Set heading colors:
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue, 100, 50);
    hue += 360 / (headingLetters.length / 0.5);
    // Prevent flash of white text prior to colors being added to letters:
    heading.style.opacity = '1';
  }

  // ----------------=[  FUNCTIONS (Build HTML Elements)  ]=---------------- //

  function buildGrid(width, height, id, columnClassName, cellClassName) {
    const grid = document.createElement('div');
    // Create number of columns based upon "width":
    for (let i = 0; i < width; i++) {
      const column = document.createElement('div');
      column.className = columnClassName;
      // Create number of cells based upon "height":
      for (let j = 0; j < height; j++) {
        const cell = document.createElement('div');
        cell.className = cellClassName;
        // Apply data attributes only to "canvas" grid (used in applying fill):
        if (id === 'canvas') {
          addCellAttributes(cell, i, j);
        }
        column.appendChild(cell);
      }
      grid.appendChild(column);
    }
    grid.id = id;
    return grid;
  }

  function addCellAttributes(cell, i, j) {
    cell.dataset.column = i;
    cell.dataset.row = j;
  }

  function fillCanvas(target, colorToFill) {
    // Base case:
    if (target === 'abort') {
      return;
    }

    const column = Number(target.dataset.column);
    const row = Number(target.dataset.row);
    const adjacentCells = [
      selectCell(column - 1, row), // ABOVE current cell
      selectCell(column + 1, row), // BELOW current cell
      selectCell(column, row - 1), // LEFT of current cell
      selectCell(column, row + 1)  // RIGHT of current cell
    ];

    for (let cell of adjacentCells) {
      if (!cell || cell.style.background !== colorToFill) {
        // Terminate recursive process if (1) adjacent cell does not exist, or
        // (2) adjacent cell is not the same color as the current cell:
        target.style.background = paintBrushColor;
        fillCanvas('abort', null);
      } else {
        cell.style.background = paintBrushColor;
        fillCanvas(cell, colorToFill);
      }
    }
  }

  function selectCell(column, row) {
    return document.querySelector(
      `[data-column="${column}"][data-row="${row}"]`
    );
  }

  function runEasterEgg(event) {
    event.preventDefault();
    // Animate a fill effect with programmatically generated colors:
    for (let i = 0, hue = 0, milliseconds = 0; i < canvasCells.length; i++) {
      setTimeout(() => {
        canvasCells[i].style.background = makeColor(hue, 100, 50);
      }, milliseconds);
      hue += colorRange / canvasCells.length;
      milliseconds += 1000 / canvasCells.length;
    }
    // Increase color range on each click to create varied color patterns.
    // (NOTE: The number 2.333 is somewhat arbitrary; however, trial-and-error
    // has shown it to yield interesting and aesthetically pleasing results):
    colorRange = Math.round(colorRange * 2.333);
    // Reset color range back to start after 16 clicks (with smooth transition);
    // prevents "broken" color patterns from appearing over time:
    if (colorRange > Math.pow(2, 26)) {
      colorRange = 360;
    }
  }

  function makeColor(hue, saturation, lightness) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  function makeGrayscale(rgb) {
    return `rgb(${rgb}, ${rgb}, ${rgb})`;
  }

  // ------------------------=[  EVENT LISTENERS  ]=------------------------ //

  // Set paintbrush color upon clicking palette element:
  Array.from(paletteCells).forEach(paletteCell => {
    paletteCell.addEventListener('click', handlePaletteCells);
  });

  Array.from(canvasCells).forEach(canvasCell => {
    // Set canvas cell background to match paintbrush color (MOUSE):
    canvasCell.addEventListener('mousedown', handleMouseDown);
    canvasCell.addEventListener('mouseup', handleMouseUp);
    canvasCell.addEventListener('mouseover', handleMouseOver);
    // Set canvas cell background to match paintbrush color (TOUCH):
    canvasCell.addEventListener('touchstart', handleTouchStart);
    canvasCell.addEventListener('touchmove', handleTouchMove);
  });

  // Prevent 'pointermove' from coloring cells while pointer is not down:
  document.body.addEventListener('mouseup', handleMouseUp);

  // Set color mode to "paintbrush":
  brushButton.addEventListener('click', handleBrushButton);

  // Set color mode to "fill":
  fillButton.addEventListener('click', handleFillButton);

  // Clear canvas upon clicking "clear":
  clearButton.addEventListener('click', handleClearButton);

  // Easter Egg - Click first letter of heading to create rainbow canvas:
  headingLetters[0].addEventListener('click', runEasterEgg);

  // ------------------=[  FUNCTIONS (Event Listeners)  ]=------------------ //

  function handlePaletteCells(event) {
    paintBrushColor = event.target.style.background;
    // Place white highlight only around selected color:
    if (event.target.className !== 'palette-cell select-color') {
      for (let i = 0; i < paletteCells.length; i++) {
        paletteCells[i].classList.remove('select-color');
      }
      event.target.classList.add('select-color');
    }
  }

  function handleMouseDown(event) {
    mouseIsDown = true;
    paintCanvas(event);
  }

  function handleMouseUp() {
    mouseIsDown = false;
  }

  function handleMouseOver(event) {
    // Allow user to color with paintbrush via click-and-hold:
    if (mouseIsDown && mode === 'brush') {
      event.target.style.background = paintBrushColor;
    }
  }

  function handleTouchStart(event) {
    event.preventDefault();
    paintCanvas(event);
  }

  function paintCanvas(event) {
    // Apply color to one cell or all adjacent cells depending on selected mode:
    if (mode === 'brush') {
      event.target.style.background = paintBrushColor;
    } else {
      const colorToFill = event.target.style.background;
      fillCanvas(event.target, colorToFill);
    }
  }

  function handleTouchMove(event) {
    event.preventDefault();
    const x = event.touches[0].pageX;
    const y = event.touches[0].pageY;
    const element = document.elementFromPoint(x, y);

    // Only apply color to touched element if it is a canvas cell:
    if (element && element.classList.contains('canvas-cell')) {
      element.style.background = paintBrushColor;
    }
  }

  function handleBrushButton() {
    animateButton(brushButton, 'press-mode');
    mode = 'brush';
    if (!brushButton.classList.contains('select-mode')) {
      fillButton.classList.remove('select-mode');
      brushButton.classList.add('select-mode');
    }
  }

  function handleFillButton() {
    animateButton(fillButton, 'press-mode');
    mode = 'fill';
    if (!fillButton.classList.contains('select-mode')) {
      brushButton.classList.remove('select-mode');
      fillButton.classList.add('select-mode');
    }
  }

  function handleClearButton(event) {
    animateButton(event.target, 'press-clear');
    for (let i = 0; i < canvasCells.length; i++) {
      canvasCells[i].style.background = 'rgb(255, 255, 255)';
    }
  }

  function animateButton(target, className) {
    target.classList.toggle(className);
    setTimeout(() => {
      target.classList.toggle(className);
    }, 50);
  }
}

pixelPainter(16, 16);
