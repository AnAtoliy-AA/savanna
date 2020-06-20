import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';

import { SavannaGameCard } from './savanna-game-card.model'
import { SavannaGameService } from './savanna-game.service';

// enum WordsRandom {
//   quantity = 20,
// }
@Component({
  selector: 'app-savanna-game',
  templateUrl: './savanna-game.component.html',
  styleUrls: ['./savanna-game.component.scss']
})
export class SavannaGameComponent implements OnInit, OnDestroy {

  constructor(private savannaGameService: SavannaGameService) { }

  savannaGameCards: SavannaGameCard[];

  remainGameCards: SavannaGameCard[];

  activeCard: SavannaGameCard;

  randomCards: SavannaGameCard[];

  lives: number = 5;

  rightWords: number = 0;

  mistakes: number = 0;


  // nativeWordsArray: Array = [];

  ngOnInit(): void {
    this.savannaGameService.getWords()
      .pipe(first())
      .subscribe(words => {
        this.savannaGameCards = words;
        this.remainGameCards = [...this.savannaGameCards];
      })

  }

  ngOnDestroy(): void {
    console.log("Destroy");
  }

  getForeignWord(): void {
    this.setActiveCard();
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannaGameCards);
    this.randomCards.push(this.activeCard);

  }

  //TODO
  setActiveCard(): void {
    const activeCardIndex: number = this.getRandomNumber(this.remainGameCards.length);

    this.activeCard = this.remainGameCards[activeCardIndex];

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

  getThreeRandomCardsRandomNumbers(cards: SavannaGameCard[]): SavannaGameCard[] {
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
    wordId === this.activeCard.wordId ? this.guessTheWord() : this.notGuessTheWord();

  }

  notGuessTheWord(): void {
    console.log('LEARN ENGLISH!!!');
    console.log('bad sound');
    this.lives--;
    this.lives === 0 ? this.gameOver() : this.getRandomCards();
    this.mistakes++;
    // this.setActiveCard();
    // this.getRandomCards();
    console.log('REMAIN CARDS LNGT: ', this.remainGameCards.length);
  }

  guessTheWord(): void {
    console.log('You are lucky!!');
    console.log('good sound');
    this.rightWords++;
    this.remainGameCards.length === 0 ? this.gameOver() : this.removeElementFromArray(this.remainGameCards, this.activeCard);
    // this.setActiveCard();
    this.getRandomCards();
    console.log('REMAIN CARDS LNGT: ', this.remainGameCards.length);
  }

  getRandomCards(): void {
    this.setActiveCard();
    const randomActiveNativeWordPosition: number = this.getRandomNumber(this.randomCards.length);
    // +1????????????????????? Don`t touch fourth word
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannaGameCards);
    this.randomCards.splice(randomActiveNativeWordPosition, 0, this.activeCard);
  }

  // removeElementFromArray(array, value) {
  //   // const arr = [...array];
  //   const index : number= array.indexOf(value);

  //   array.splice(index, 1);

  //   return array;
  // }

  gameOver(): void {
    console.log('GAme OVER!!!');
    console.log('YOU HAVE Mistakes: ', this.mistakes);
    console.log('YOU HAVE Right Words: ', this.rightWords);
  }

}
