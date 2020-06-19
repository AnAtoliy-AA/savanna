import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';

import { SavannaGameCard } from './savanna-game-card.model'
import { SavannaGameService } from './savanna-game.service';

enum WordsRandom {
  quantity = 20,
}
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

  getForeignWord() {
    this.setActiveCard();
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannaGameCards);
    this.randomCards.push(this.activeCard);

  }

  setActiveCard(): void {
    this.activeCard = this.savannaGameCards[this.getRandomNumber(WordsRandom.quantity)];
  }

  // getNativeWordsArray() {
  //   const nativeWordsArray = [];
  //   const nativeWordCard = this.activeCard;

  //   nativeWordsArray.push(nativeWordCard);
  //   console.log('WORDS_ARRAY', nativeWordsArray);
  // }

  getRandomNumber(maxValue: number) {
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

  checkResult(word: string) {
    // return wordId === this.activeCard.
    // this.getNativeWordsArray();
    console.log('Result: ', word);

    this.setActiveCard();


    this.getRandomCards();


  }

  getRandomCards() {
    this.randomCards = this.getThreeRandomCardsRandomNumbers(this.savannaGameCards);
    this.randomCards.push(this.activeCard);
  }

  // removeElementFromArray(array, value) {
  //   const arr = [...array];
  //   const index = arr.indexOf(value);

  //   arr.splice(index, 1);

  //   return arr;
  // }


}
