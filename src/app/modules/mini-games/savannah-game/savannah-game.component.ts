import { Component, HostListener, OnInit } from '@angular/core';

import { SavannahGameCard } from './savannah-game-card.model';
import { SavannahGameService } from './savannah-game.service';
import { first } from 'rxjs/operators';

export enum KEY_CODE {
  NUMBER_ONE = 1,
  NUMBER_TWO = 2,
  NUMBER_THREE = 3,
  NUMBER_FOUR = 4,
}

export enum CARD_NUMBER {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
  FOURTH = 3,
}

const AUDIO_NAMES = {
  ERROR: 'error',
  FAILURE: 'failure',
  SUCCESS: 'succes',
  CORRECT: 'correct',
};
@Component({
  selector: 'app-savannah-game',
  templateUrl: './savannah-game.component.html',
  styleUrls: [
    './savannah-game.component.scss',
    './savannah-game-loader.scss',
    './savannah-game-title.scss',
  ],
})
export class SavannahGameComponent implements OnInit {
  constructor(private savannahGameService: SavannahGameService) { }

  savannahGameCards: SavannahGameCard[];
  remainGameCards: SavannahGameCard[];
  activeCard: SavannahGameCard;
  randomCards: SavannahGameCard[];
  livesArray: Array<number> = [1, 1, 1, 1, 1];
  lives: number;
  rightWords: number;
  mistakes: number;
  isHiddenDescription = false;
  isHiddenLoader = true;
  isHiddenButton = false;
  isHiddenFinalScreen = true;
  isAnimationStart = true;
  isAnimationEnd = true;
  isAnimationBullet = false;
  isSoundSelected = true;

  title: string[] = 'SAVANAH'.split('').reverse();

  ngOnInit(): void { }

  getDefaultAdditionalGameValues(): void {
    this.isHiddenDescription = true;
    this.isHiddenButton = true;
    this.isHiddenLoader = false;
    this.lives = 5;
    this.mistakes = 0;
    this.rightWords = 0;
    this.isHiddenFinalScreen = true;
    this.livesArray = [1, 1, 1, 1, 1];
  }

  startGame(): void {
    this.getDefaultAdditionalGameValues();
    this.savannahGameService
      .getWords()
      .pipe(first())
      .subscribe((words) => {
        this.savannahGameCards = words;
        this.remainGameCards = [...this.savannahGameCards];
        this.getForeignWord();
      });
  }

  getForeignWord(): void {
    this.isHiddenLoader = true;
    this.setActiveCard();
    this.randomCards = this.getThreeRandomCardsRandomNumbers(
      this.savannahGameCards
    );
    this.randomCards.push(this.activeCard);
  }


  fallingBlock: ReturnType<typeof setTimeout>;

  setActiveCard(): void {
    this.correctWordSelected = false;

    const activeCardIndex: number = this.getRandomNumber(
      this.remainGameCards.length
    );

    this.activeCard = this.remainGameCards[activeCardIndex];
    this.fallingBlock = setTimeout(() => {
      this.ifGuessTheWord();
    }, 5000);
  }

  removeElementFromArray(array: SavannahGameCard[], value: SavannahGameCard) {
    const index: number = array.indexOf(value);

    array.splice(index, 1);

    return array;
  }

  getRandomNumber(maxValue: number): number {
    return Math.floor(Math.random() * Math.floor(maxValue));
  }

  getThreeRandomCardsRandomNumbers(
    cards: SavannahGameCard[]
  ): SavannahGameCard[] {
    const ar = [...cards];
    const length = 3;
    const result = [];

    this.removeElementFromArray(ar, this.activeCard);

    for (let i = 0; i < length; i++) {
      let index = this.getRandomNumber(ar.length);
      let curCard = ar[index];
      ar.splice(index, 1);
      result.push(curCard);
    }

    return result;
  }

  checkResult(wordId: string): void {
    clearTimeout(this.fallingBlock);
    this.correctWordSelected = true;
    wordId === this.activeCard.wordId
      ? this.guessTheWord()
      : this.notGuessTheWord();
  }

  correctWordSelected: boolean = false;

  ifGuessTheWord(): void {
    if (!this.correctWordSelected) {
      this.notGuessTheWord();
    }
  }

  notGuessTheWord(): void {
    this.audioPlay(AUDIO_NAMES.ERROR);
    this.lives--;
    this.livesArray.splice(0, 1);
    this.livesArray.length === 0 ? this.gameOver() : this.getRandomCards();
    this.isAnimationEnd = false;
    this.mistakes++;
  }

  guessTheWord(): void {
    this.audioPlay(AUDIO_NAMES.CORRECT);
    this.isAnimationEnd = false;
    this.isAnimationBullet = true;
    this.rightWords++;
    this.rightWords === 20 ? this.gameOver() : this.getNextRandomCards();
  }

  soundForeignWord(): void {
    const msg = new SpeechSynthesisUtterance();
    const foreignWordText = this.activeCard.foreignWord;

    if (this.isSoundSelected) {
      msg.text = foreignWordText;
      speechSynthesis.speak(msg);
    }
  }

  getNextRandomCards(): void {
    this.removeElementFromArray(this.remainGameCards, this.activeCard);
    this.getRandomCards();
  }

  getRandomCards(): void {
    const randomActiveNativeWordPosition: number = this.getRandomNumber(
      this.randomCards.length
    );

    this.setActiveCard();
    this.soundForeignWord();
    this.randomCards = this.getThreeRandomCardsRandomNumbers(
      this.savannahGameCards
    );
    this.randomCards.splice(randomActiveNativeWordPosition, 0, this.activeCard);
    setTimeout(() => {
      this.isAnimationEnd = true;
    }, 1);

    setTimeout(() => {
      this.isAnimationBullet = false;
    }, 1000);
  }

  audioPlay(name: string): void {
    if (name && this.isSoundSelected) {
      const audio = new Audio(`../../../../assets/savannah-game-${name}.mp3`);

      audio.play();
    }
  }

  selectSound(): void {
this.isSoundSelected = !this.isSoundSelected;
  }

  gameOver(): void {
    this.isHiddenFinalScreen = false;
    this.isHiddenButton = false;
    this.activeCard = null;
    this.livesArray.length > 0
      ? this.audioPlay(AUDIO_NAMES.SUCCESS)
      : this.audioPlay(AUDIO_NAMES.FAILURE);
  }

  closeGame() { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.activeCard) {
      switch (event.key) {
        case KEY_CODE.NUMBER_ONE.toString():
          this.checkResult(this.randomCards[CARD_NUMBER.FIRST].wordId);
          break;
        case KEY_CODE.NUMBER_TWO.toString():
          this.checkResult(this.randomCards[CARD_NUMBER.SECOND].wordId);
          break;
        case KEY_CODE.NUMBER_THREE.toString():
          this.checkResult(this.randomCards[CARD_NUMBER.THIRD].wordId);
          break;
        case KEY_CODE.NUMBER_FOUR.toString():
          this.checkResult(this.randomCards[CARD_NUMBER.FOURTH].wordId);
          break;
      }
    }
  }
}
