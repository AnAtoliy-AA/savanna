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
    const activeCardIndex = this.getRandomNumber(this.remainGameCards.length);

    this.activeCard = this.remainGameCards[activeCardIndex];

    // console.log('INDEX:',activeCardIndex);

    // console.log('REMAINS GAME CARDS:', this.remainGameCards);
    // this.remainGameCards.length === 0 ? this.gameOver() : this.remainGameCards.splice(activeCardIndex, 1);
    this.remainGameCards.length === 0 ? this.gameOver() : this.removeElementFromArray(this.remainGameCards, activeCardIndex);

    // console.log('REMAINS GAME CARDS:', this.remainGameCards);
// console.log('REMAIN CARDS LNGT: ', this.remainGameCards.length);
  }

   removeElementFromArray(array, index: number) {
    // const arr = [...array];
    // const index : number= array.indexOf(value);

    array.splice(index, 1);

    return array;
  }


  getRandomNumber(maxValue: number): number {
    return Math.floor(Math.random() * Math.floor(maxValue));
  }

  getThreeRandomCardsRandomNumbers(cards: SavannaGameCard[]): [SavannaGameCard, SavannaGameCard, SavannaGameCard] {
    const length = cards.length;
    return [
      cards[this.getRandomNumber(length)],
      cards[this.getRandomNumber(length)],
      cards[this.getRandomNumber(length)],
    ]
  }

  checkResult(wordId: string): void {
       wordId === this.activeCard.wordId ? this.guessTheWord() : this.notGuessTheWord();
    this.setActiveCard();
    this.getRandomCards();
  }

  notGuessTheWord(): void {
    console.log('LEARN ENGLISH!!!');
    this.lives--;
    this.lives === 0 ? this.gameOver() : console.log('ss');

  }

  guessTheWord(): void {
    console.log('You are lucky!!');
  }

  getRandomCards(): void {
   const randomActiveNativeWordPosition : number = this.getRandomNumber(this.randomCards.length + 1);
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
  }

}
