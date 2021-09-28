
// 지렁이 객체
function Earthworm() {
  const startBody = [{ x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }];
  const startArrow = ARROW.right;

  this.body = startBody.slice();
  this.arrow = startArrow;
  
  // 시작위치 복원
  this.replace = function () {
    this.body = startBody.slice();
    this.arrow = startArrow;
  }

  // 한칸 이동
  this.move = function (feed) {
    const head = this.body[0];
    const movingX = this.arrow === ARROW.left ? -1
      : this.arrow === ARROW.right ? 1 : 0;
    const movingY = this.arrow === ARROW.up ? -1
      : this.arrow === ARROW.down ? 1 : 0;

    const newHead = { x: head.x + movingX, y: head.y + movingY };
    this.body.unshift(newHead);

    // 먹이 체크
    let didAte = true;
    if (!feed || !isSamePosition(head, feed)) {
      didAte = false;
      this.body.pop();
    }

    return {
      newHead,  // 새로운 머리 위치
      didAte    // 먹이를 먹은지
    }; 
  }

  // 방향 설정
  this.setArrow = function (newArrow) {
    this.arrow = newArrow ? newArrow : ARROW.up;
  }

  // 방향 값 반환
  this.getArrow = function () {
    return this.arrow;
  }
}