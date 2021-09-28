// 필드 객체
function Field(row, column) {
  this.row = row ? row : 10;
  this.column = column ? column : 10;
  this.food;
  this.earthworm;
  this.interval;
  this.currentArrow;

  // 블록 채우기
  function fillBlock(pos, otherClass = []) {
    if (!pos) return;
    const x = pos.x ? pos.x : 0;
    const y = pos.y ? pos.y : 0;
    const block = fieldDom.children[y].children[x];
    block.classList.add(CLASS_FIELD_BLOCK_FILL);
    for (var index in otherClass) {
      block.classList.add(otherClass[index]);
    }
  }

  // 지렁이 그리기 함수
  function drawEarthWorm(earthworm) {
    for (let index in earthworm.body) {
      fillBlock(earthworm.body[index], index == 0 ? [CLASS_FIELD_BLOCK_HEAD] : undefined);
    }
  }

  // 한턴 진행
  function takeTurn(field) {
    return function () {
      const { newHead, didAte } = field.earthworm.move(field.food);
      field.currentArrow = field.earthworm.getArrow();  // 진행했던 방향
      const isOut = newHead.x < 0 || newHead.x >= field.row || newHead.y < 0 || newHead.y >= field.column;
      const copied = field.earthworm.body.slice();
      copied.splice(0, 1);
      const isConflict = copied.findIndex(function (block) {
        return isSamePosition(block, newHead);
      }) !== -1;
      
      if (isOut || isConflict) {  // 라인아웃 or 머리,몸통 충돌
        field.pause();
        const replay = confirm(`${ isOut ? '라인' : '충돌' } 아웃입니다! \n다시 시작하시겠습니까?`);
        if (replay) {
          field.earthworm.replace();
          field.feed();
          field.reload();
          field.play();
        }
        return;
      }
      else if (didAte) {  // 먹이를 먹었다면
        field.food = undefined;
      }

      field.reload();
    }
  }

  // 필드 블록 지우기
  function clearField() {
    const fillBlocks = fieldDom.querySelectorAll('.' + CLASS_FIELD_BLOCK_FILL);
    if (fillBlocks.length === 0) return;
    for (var i = 0; i < fillBlocks.length; i++) {
      fillBlocks[i].classList.remove(CLASS_FIELD_BLOCK_FILL);
      fillBlocks[i].classList.remove(CLASS_FIELD_BLOCK_FOOD);
      fillBlocks[i].classList.remove(CLASS_FIELD_BLOCK_HEAD);
    }
  }

  // 먹이 생성
  this.feed = function () {
    let food = { x: 0, y: 0 };
      
    let conflictWithBody = false;
    do {
      food = {
        x: Math.floor(Math.random() * (this.row)),
        y: Math.floor(Math.random() * (this.column))
      }
        
      // 먹이와 지렁이가 겹치는지 확인
      conflictWithBody = this.earthworm.body.findIndex(function (block) {
        return isSamePosition(block, food)
      }) !== -1;
  
    } while (conflictWithBody);
  
    this.food = food;
  };



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
        const preArrow = field.currentArrow;
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
    clearField();
    drawEarthWorm(this.earthworm);
    !this.food && this.feed();
    fillBlock(this.food, [CLASS_FIELD_BLOCK_FOOD]);
  }

  // 게임 시작
  this.play = function () {
    this.interval = setInterval(takeTurn(this), 100);
  }

  this.pause = function () {
    clearInterval(this.interval);
  }

}