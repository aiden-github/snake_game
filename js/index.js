const CLASS_FIELD_COLUMN = 'column';
const CLASS_FIELD_BLOCK = 'block';
const CLASS_FIELD_BLOCK_FILL = 'fill';

// DOM
const fieldDom = document.querySelector('#field');


// 방향 enum
const ARROW = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
}

  
// main
const field = new Field(30, 30);
const worm = new Earthworm();
field.init(worm);