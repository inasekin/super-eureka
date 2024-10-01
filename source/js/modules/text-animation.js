export default class AccentTypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      isOneWord,
      delay
  ) {
    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._isOneWord = isOneWord;
    this._delay = delay;

    this.prePareText();
  }

  random(min, max) {
    const random = Math.floor(Math.random() * (max - min) + min);

    return Math.floor(random / min) * min;
  }

  createElement(letter, wordLength, numberWord) {
    const span = document.createElement(`span`);
    const msForLetter = 25;
    const delay = this.random(msForLetter, wordLength * msForLetter);

    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms ease ${numberWord * (wordLength * msForLetter) + delay + this._delay}ms`;

    if (letter === ` `) {
      span.classList.add(`space`);
    }

    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }

    let text;

    if (!this._isOneWord) {
      text = this._element.textContent.trim().split(` `).filter((latter)=>latter !== ``);
    } else {
      text = [this._element.textContent];
    }

    const content = text.reduce((fragmentParent, word, numberWord) => {
      const wordElement = Array.from(word).reduce((fragment, latter, index, arr) => {
        fragment.appendChild(this.createElement(latter, arr.length, numberWord));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`animation-text__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}
