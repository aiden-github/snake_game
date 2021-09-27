const CLASS_FIELD_COLUMN = 'column';
const CLASS_FIELD_BLOCK = 'block';
const CLASS_FIELD_BLOCK_FILL = 'fill';

const fieldDom = document.querySelector('#field');


// 방향 enum
const ARROW = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
}

// 필드 객체
function Field(row, column) {
  this.row = row ? row : 10;
  this.column = column ? column : 10;
  this.earthworm;
  this.interval;


  // 지렁이 그리기 함수
  function drawEarthWorm(earthworm) {

    const fillBlock = function (pos = { x: 0, y: 0 }) {
      const x = pos.x ? pos.x : 0;
      const y = pos.y ? pos.y : 0;
      const block = fieldDom.children[y].children[x];
      block.classList.add(CLASS_FIELD_BLOCK_FILL);  
    }
    for (let index in earthworm.body) {
      fillBlock(earthworm.body[index]);
    }
  }

  // 한턴 진행
  function takeTurn(field) {
    return function () {
      const pos = field.earthworm.move();
      // 아웃인지 체크
      if (pos.x < 0 || pos.x >= field.row || pos.y < 0 || pos.y >= field.column) {
        field.pause();
        const replay = confirm('아웃입니다! 다시 시작하시겠습니까?');
        if (replay) {
          field.earthworm.replace();
          field.reload();
          field.play();
        }
        return;
      }


      field.reload();
    }
  }

  // 지렁이 지우기
  function eraseEarthworm() {
    const oldEarthworm = fieldDom.querySelectorAll('.' + CLASS_FIELD_BLOCK_FILL);
    if (oldEarthworm.length === 0) return;
    for (var i = 0; i < oldEarthworm.length; i++) {
      oldEarthworm[i].classList.remove(CLASS_FIELD_BLOCK_FILL);
    }
  }


  // 필드 초기화
  this.init = function (earthworm) {
    // 필드 그리기
    fieldDom.innerHTML = '';
    for (var i = 0; i < this.column; i++) {
      // 행 DOM 생성
      const columnDom = document.createElement('div');
      columnDom.classList.add(CLASS_FIELD_COLUMN);
  
      for (var j = 0; j < this.row; j++) {
        // 열 DOM 생성
        const rowDom = document.createElement('div');
        rowDom.classList.add(CLASS_FIELD_BLOCK);
        fieldDom.appendChild(columnDom).appendChild(rowDom);
      }
    }

    this.earthworm = earthworm;

    // 조작 설정
    const handleKey = (function (field) {
      return function (e) {
        const preArrow = field.earthworm.getArrow();
        switch (e.key) {
          case 'ArrowUp':
            if(preArrow !== ARROW.down)
              field.earthworm.setArrow(ARROW.up);
            break;
          case 'ArrowDown':
            if(preArrow !== ARROW.up)
              field.earthworm.setArrow(ARROW.down);
            break;
          case 'ArrowLeft':
            if(preArrow !== ARROW.right)
              field.earthworm.setArrow(ARROW.left);
            break;
          case 'ArrowRight':
            if(preArrow !== ARROW.left)
              field.earthworm.setArrow(ARROW.right);
            break;
        }
      };
    })(this);

    window.onkeydown = handleKey;


    this.reload();
    this.play();
  }

  // 필드 리셋
  this.reload = function () {
    eraseEarthworm();
    drawEarthWorm(this.earthworm);
  }

  // 게임 시작
  this.play = function () {
    this.interval = setInterval(takeTurn(this), 100);
  }

  this.pause = function () {
    clearInterval(this.interval);
  }

}

// 지렁이 객체
function Earthworm() {
  const startBody = [{ x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }];
  const startArrow = ARROW.right;

  this.body = startBody.slice();
  this.arrow = startArrow;
  
  this.replace = function () {
    this.body = startBody.slice();
    this.arrow = startArrow;
  }

  this.move = function () {
    const head = this.body[0];
    const movingX = this.arrow === ARROW.left ? -1
      : this.arrow === ARROW.right ? 1 : 0;
    const movingY = this.arrow === ARROW.up ? -1
      : this.arrow === ARROW.down ? 1 : 0;

    const newHead = { x: head.x + movingX, y: head.y + movingY };
    this.body.unshift(newHead);
    this.body.pop();

    return newHead;  // 새로운 머리 위치 반환
  }

  this.setArrow = function (newArrow) {
    this.arrow = newArrow ? newArrow : ARROW.up;
  }

  this.getArrow = function () {
    return this.arrow;
  }
}


// main
(function main() {
  const field = new Field(30, 30);
  const worm = new Earthworm();
  field.init(worm);


}) ();