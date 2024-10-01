export default class CounterAnimation {
  constructor(
      selector
  ) {
    this.secondsElement = selector[1];
    this.minutesElement = selector[0];
    this.fpsInterval = 1000;
    this.elapsed = 0;
    this.lastUpdateTime = Date.now();
    this.animationCounter = null;
    this.seconds = 0;
    this.minutes = 5;
  }

  startCounter() {
    this.tick();
  }

  stopCounter() {
    cancelAnimationFrame(this.animationCounter);
    this.minutesElement.innerText = `05`;
    this.secondsElement.innerText = `00`;
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
    if (this.seconds === 0) {
      this.seconds = 59;
      this.minutes -= 1;
    } else {
      this.seconds -= 1;
    }

    this.minutesElement.innerText = this.prepareValue(this.minutes);
    this.secondsElement.innerText = this.prepareValue(this.seconds);

    if (this.minutes === 0 && this.seconds === 0) {
      this.stopCounter();
    }
  }

  prepareValue(value) {
    return value < 10 ? `0${value}` : value;
  }
}
