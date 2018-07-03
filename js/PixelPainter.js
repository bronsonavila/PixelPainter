var pixelPainterDiv = document.getElementById('pixelPainter');

function PixelPainter(width, height) {
  for (var i = 0; i < height; i++) {
    // Create div that will be a new row:
    var row = document.createElement('div');
    row.className = 'row';
    for (var j = 0; j < width; j++) {
      // Append cell to new row:
      var cell = document.createElement('div');
      cell.className = 'cell';
      row.appendChild(cell);
    }
    // Append new row to #pixelPainter:
    pixelPainterDiv.appendChild(row);
  }
}

PixelPainter(10, 10);