import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';

import { SavannahGameCard } from './savannah-game-card.model'
import { SavannahGameService } from './savannah-game.service';

// enum WordsRandom {
//   quantity = 20,
// }

// export enum KEY_CODE {
//   NUMBER_ONE = 49,
//   NUMBER_TWO = 50,
//   NUMBER_THREE = 51,
//   NUMBER_FOUR = 52,
// }

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
}
@Component({
  selector: 'app-savannah-game',
  templateUrl: './savannah-game.component.html',
  styleUrls: ['./savannah-game.component.scss', './savannah-game-loader.scss', './savannah-game-title.scss']
})
export class SavannahGameComponent implements OnInit, OnDestroy {

  constructor(private savannahGameService: SavannahGameService) { }

  savannahGameCards: SavannahGameCard[];

  remainGameCards: SavannahGameCard[];

  activeCard: SavannahGameCard;

  randomCards: SavannahGameCard[];

  livesArray: Array<number> = [1, 1, 1, 1, 1];

  lives: number;

  rightWords: number;

  mistakes: number;

  isHiddenDescription: boolean = false;

  isHiddenLoader: boolean = true;

  isHiddenButton: boolean = false;

  isHiddenFinalScreen: boolean = true;

  isAnimationStart: boolean = true;

  isAnimationBullet: boolean = false;


  // nativeWordsArray: Array = [];

  ngOnInit(): void {
    // this.savannahGameService.getWords()
    //   .pipe(first())
    //   .subscribe(words => {
    //     this.savannahGameCards = words;
    //     this.remainGameCards = [...this.savannahGameCards];
    //   })

  }

  ngOnDestroy(): void {
    console.log("Destroy");
  }

  getDefaultAdditionalGameValues(): void {
    this.isHiddenDescription = true;
    this.isHiddenButton = true;
    this.isHiddenLoader = false;
    this.lives = 5;
    this.mistakes = 0;
    this.rightWords = 0;
    this.isHiddenFinalScreen = true;

    this.livesArray = [1, 1, 1, 1, 1];

    // this.livesArray.fill(1,0,4);
  }
  // TODO life_count  speed_falling  quantity_words
  startGame(): void {
    this.getDefaultAdditionalGameValues();
    this.savannahGameService.getWords()
      .pipe(first())
      .subscribe(words => {
        this.savannahGameCards = words;
        this.remainGameCards = [...this.savannahGameCards];
        this.getForeignWord();
      })
    // this.getForeignWord();
    // setTimeout(this.getForeignWord, 3000);
  }


  getForeignWord(): void {
    this.isHiddenLoader = true;
    this.setActiveCard();
    // this.soundForeignWord();
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannahGameCards);
    this.randomCards.push(this.activeCard);

  }

  //TODO
  setActiveCard(): void {
    const activeCardIndex: number = this.getRandomNumber(this.remainGameCards.length);

    this.activeCard = this.remainGameCards[activeCardIndex];
    // this.isAnimationBullet = false;

    // console.log('INDEX:',activeCardIndex);

    // console.log('REMAINS GAME CARDS:', this.remainGameCards);
    // this.remainGameCards.length === 0 ? this.gameOver() : this.remainGameCards.splice(activeCardIndex, 1);


    // this.remainGameCards.length === 0 ? this.gameOver() : this.removeElementFromArray(this.remainGameCards, activeCardIndex);

    // console.log('REMAINS GAME CARDS:', this.remainGameCards);
    // console.log('REMAIN CARDS LNGT: ', this.remainGameCards.length);
  }

  //  removeElementFromArray(array, index: number) {
  //   // const arr = [...array];
  //   // const index : number= array.indexOf(value);

  //   array.splice(index, 1);

  //   return array;
  // }
  removeElementFromArray(array, value) {
    // const arr = [...array];
    const index: number = array.indexOf(value);

    array.splice(index, 1);

    return array;
  }


  getRandomNumber(maxValue: number): number {
    return Math.floor(Math.random() * Math.floor(maxValue));
  }

  getThreeRandomCardsRandomNumbers(cards: SavannahGameCard[]): SavannahGameCard[] {
    const ar = [...cards];
    const length = 3;

    this.removeElementFromArray(ar, this.activeCard);

    const result = [];
    for (let i = 0; i < length; i++) {
      // const result = [ar[this.getRandomNumber(length)]];
      let index = this.getRandomNumber(ar.length);
      let curCard = ar[index];
      ar.splice(index, 1);
      result.push(curCard);


    }

    return result;
  }

  checkResult(wordId: string): void {
    this.isAnimationStart = false;
    this.isAnimationBullet = false;
    wordId === this.activeCard.wordId ? this.guessTheWord() : this.notGuessTheWord();

    // this.isAnimationStart = true;
    // console.log('THIS_KEY_RANDOM_CARDS', this.randomCards);

  }

  notGuessTheWord(): void {
    // console.log('LEARN ENGLISH!!!');
    // console.log('bad sound');
    this.audioPlay(AUDIO_NAMES.ERROR);
    this.lives--;
    this.livesArray.splice(0, 1);
    // this.lives === 0 ? this.gameOver() : this.getRandomCards();
    this.livesArray.length === 0 ? this.gameOver() : this.getRandomCards();
    this.mistakes++;
    // console.log('ANSWER:', this.activeCard.nativeWord);
    // this.setActiveCard();
    // this.getRandomCards();
    // console.log('REMAIN CARDS LNGT mist: ', this.remainGameCards.length);
  }

  guessTheWord(): void {
    // console.log('You are lucky!!');
    // console.log('good sound');
    this.audioPlay(AUDIO_NAMES.CORRECT);
    this.isAnimationBullet = true;
    this.rightWords++;
    // console.log('REMAIN CARDS LNGT befor: ', this.remainGameCards.length);
    // this.remainGameCards.length === 0 ? this.gameOver() : this.getNextRandomCards();
    this.rightWords === 20 ? this.gameOver() : this.getNextRandomCards();
    // this.setActiveCard();

    // console.log('REMAIN CARDS LNGT after: ', this.remainGameCards.length);
    //
  }

  soundForeignWord() {

    const msg = new SpeechSynthesisUtterance();

    const foreignWordText = this.activeCard.foreignWord;

    msg.text = foreignWordText;
    // msg.lang = language;

    speechSynthesis.speak(msg);
  }


  // getVoiceLocation(): void {
  //   window.SpeechRecognition = window.SpeechRecognition || window['webkitSpeechRecognition'];

  //   const recognition = new SpeechRecognition();

  //   recognition.interimResults = true;

  //   recognition.addEventListener('result', e => {

  //     const transcript = Array.from(e.results)
  //       .map(result => result[0])
  //       .map(result => result.transcript)
  //       .join('')

  //     if (transcript.includes('weather')) {
  //       this.soundWeather();
  //     } else {
  //       this.appStateService.setSearchValue(transcript);
  //     }
  //   });

  //   recognition.start();
  // }

  // activeLanguageConfig: any = {
  //   english: 'en',
  //   russian: 'ru',
  //   belorussian: 'be'
  // }
  soundWeather(): void {

  }

  getNextRandomCards(): void {
    this.removeElementFromArray(this.remainGameCards, this.activeCard);
    this.getRandomCards();
    // console.log('ANSWER:', this.activeCard.nativeWord);
  }

  getRandomCards(): void {
    // this.isAnimationStart = true;
    this.setActiveCard();
    this.soundForeignWord();
    const randomActiveNativeWordPosition: number = this.getRandomNumber(this.randomCards.length);
    // +1????????????????????? Don`t touch fourth word
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannahGameCards);
    this.randomCards.splice(randomActiveNativeWordPosition, 0, this.activeCard);
    this.isAnimationStart = true;
  }

  // removeElementFromArray(array, value) {
  //   // const arr = [...array];
  //   const index : number= array.indexOf(value);

  //   array.splice(index, 1);

  //   return array;
  // }

  audioPlay(name: string) {
    if (name) {
      // const audio = new Audio(`./assets/audio/${name}.mp3`);

      const audio = new Audio(`../../../../assets/savannah-game-${name}.mp3`);

      audio.play();
    }
  }

  gameOver(): void {
    this.isHiddenFinalScreen = false;
    this.isHiddenButton = false;
    this.activeCard = null;
    this.livesArray.length > 0 ? this.audioPlay(AUDIO_NAMES.SUCCESS) : this.audioPlay(AUDIO_NAMES.FAILURE);
    // console.log('GAme OVER!!!');
    // console.log('YOU HAVE Mistakes: ', this.mistakes);
    // console.log('YOU HAVE Right Words: ', this.rightWords);
  }

  closeGame() {
    console.log('CLOSE_GAME');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (this.activeCard) {
      if (event.key === KEY_CODE.NUMBER_ONE.toString()) {
        // console.log('1',this.randomCards[0].wordId);
        this.checkResult(this.randomCards[CARD_NUMBER.FIRST].wordId);
      }

      if (event.key === KEY_CODE.NUMBER_TWO.toString()) {
        // console.log('2',this.randomCards[1].wordId);
        this.checkResult(this.randomCards[CARD_NUMBER.SECOND].wordId);
      }
      if (event.key === KEY_CODE.NUMBER_THREE.toString()) {
        // console.log('3',this.randomCards[2].wordId);
        this.checkResult(this.randomCards[CARD_NUMBER.THIRD].wordId);
      }
      if (event.key === KEY_CODE.NUMBER_FOUR.toString()) {
        // console.log('4',this.randomCards[3].wordId);
        this.checkResult(this.randomCards[CARD_NUMBER.FOURTH].wordId);
      }
    }

  }

}


