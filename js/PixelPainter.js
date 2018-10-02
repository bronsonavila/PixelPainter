'use strict';

function PixelPainter(width, height) {
  const pixelPainterDiv = document.getElementById('pixelPainter');
  const heading = document.getElementsByTagName('h1')[0];
  const headingLetters = document.getElementsByClassName('heading');
  const paletteHeight = 5;
  const paletteWidth = 8;
  let mouseIsDown = false;
  let colorRange = 360;
  let mode = 'brush';
  let canvasCells;
  let paletteColumns;
  let paletteCells;
  let paintBrushColor;

  // ---------------------------=[  FUNCTIONS  ]=--------------------------- //

  function buildGrid(width, height, id, groupClass, cellClass) {
    const grid = document.createElement('div');
    for (let i = 0; i < width; i++) {
      const group = document.createElement('div');
      group.className = groupClass;
      for (let j = 0; j < height; j++) {
        const cell = document.createElement('div');
        cell.className = cellClass;
        if (id === 'canvas') {
          addCellAttributes(cell, i, j);
        }
        group.appendChild(cell);
      }
      grid.appendChild(group);
    }
    grid.id = id;
    return grid;
  }

  function addCellAttributes(cell, i, j) {
    cell.dataset.row = i;
    cell.dataset.column = j;
  }

  function makeColor(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  function makeGrayscale(val) {
    return `rgb(${val}, ${val}, ${val})`;
  }

  function makeDirection(row, column) {
    return document.querySelector(
      `[data-row="${row}"][data-column="${column}"]`
    );
  }

  function fillCanvas(target, colorToFill) {
    // Base case:
    if (target === 'abort') {
      return;
    }

    const row = Number(target.dataset.row);
    const column = Number(target.dataset.column);
    const directions = [
      makeDirection(row - 1, column), // ABOVE current cell
      makeDirection(row + 1, column), // BELOW current cell
      makeDirection(row, column - 1), // LEFT of current cell
      makeDirection(row, column + 1)  // RIGHT of current cell
    ];

    for (let direction of directions) {
      if (!direction || direction.style.background !== colorToFill) {
        target.style.background = paintBrushColor;
        fillCanvas('abort', null);
      } else {
        direction.style.background = paintBrushColor;
        fillCanvas(direction, colorToFill);
      }
    }
  }

  function paintCanvas(event) {
    if (mode === 'brush') {
      event.target.style.background = paintBrushColor;
    } else {
      const colorToFill = event.target.style.background;
      fillCanvas(event.target, colorToFill);
    }
  }

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
    if (mouseIsDown && mode === 'brush') {
      event.target.style.background = paintBrushColor;
    }
  }

  function handleTouchStart(event) {
    event.preventDefault();
    paintCanvas(event);
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
    setTimeout(function() {
      target.classList.toggle(className);
    }, 50);
  }

  function runEasterEgg(event) {
    event.preventDefault();
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

  // ----------------------=[  BUILD HTML ELEMENTS  ]=---------------------- //

  // Create "canvas" grid:
  const canvas = buildGrid(
    width,
    height,
    'canvas',
    'canvas-row',
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

  // ------------------------------=[  INIT  ]=------------------------------ //

  // Set heading colors:
  for (let i = 0, hue = 0; i < headingLetters.length; i++) {
    headingLetters[i].style.color = makeColor(hue, 100, 50);
    hue += 360 / (headingLetters.length / 0.5);
    // Prevent flash of white text prior to colors being added to letters:
    heading.style.opacity = '1';
  }

  // Set palette colors:
  for (let i = 0, rgb = 0; i < paletteColumns.length; i++) {
    const hues = [0, 30, 60, 120, 240, 280, 320]; // ROYGBIV
    const columnCells = paletteColumns[i].children;

    for (let j = 0, l = 50; j < paletteHeight; j++) {
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

  // Set default color upon initialization:
  paintBrushColor = paletteCells[0].style.background;
  paletteCells[0].classList.add('select-color');

  // Easter Egg - Click first letter of heading to create rainbow canvas:
  headingLetters[0].addEventListener('click', runEasterEgg);
}

PixelPainter(16, 16);
