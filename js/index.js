const CLASS_FIELD_COLUMN = 'column';
const CLASS_FIELD_BLOCK = 'block';
const CLASS_FIELD_BLOCK_FILL = 'fill';
const CLASS_FIELD_BLOCK_FOOD = 'food';
const CLASS_FIELD_BLOCK_HEAD = 'head';

// DOM
const fieldDom = document.querySelector('#field');


// 방향 enum
const ARROW = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
}

// 같은 블록인지 체크하는 함수
function isSamePosition(blockA, blockB) {
  return blockA.x === blockB.x && blockA.y === blockB.y;
}

  
// main
const field = new Field(30, 30);
const worm = new Earthworm();
field.init(worm);