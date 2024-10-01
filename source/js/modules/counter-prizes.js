export default class CounterPrizesAnimation {
  constructor(
      selector,
      minNumber,
      maxNumber,
      delay
  ) {
    this.element = selector;
    this.fpsInterval = 1000 / 12;
    this.elapsed = 0;
    this.lastUpdateTime = Date.now();
    this.animationCounter = null;
    this.number = minNumber;
    this.maxNumber = maxNumber;
    this.delay = delay;
  }

  startCounter() {
    if (window.innerWidth > 1024) {
      this.element.innerText = this.number;

      setTimeout(()=> {
        this.tick();
      }, this.delay);
    }
  }

  stopCounter() {
    cancelAnimationFrame(this.animationCounter);
    this.element.innerText = this.maxNumber;
  }

  tick() {
    this.animationCounter = requestAnimationFrame(this.tick.bind(this));

    const currentTime = Date.now();
    this.elapsed = currentTime - this.lastUpdateTime;

    // проверяем, достаточно ли прошло времени с предыдущей отрисовки кадра
    if (this.elapsed > this.fpsInterval) {
      // сохранение времени текущей отрисовки кадра
      this.lastUpdateTime = currentTime - (this.elapsed % this.fpsInterval);

      // запуск функции отрисовки
      this.draw();
    }
  }

  draw() {
    const step = Math.round((this.fpsInterval * this.maxNumber) / 1000);

    this.number += step;
    this.element.innerText = this.number;

    if (this.number >= this.maxNumber) {
      this.stopCounter();
    }
  }

  prepareValue(value) {
    return value < 10 ? `0${value}` : value;
  }
}
