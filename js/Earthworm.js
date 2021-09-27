
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