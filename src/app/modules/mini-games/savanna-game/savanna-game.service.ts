import { catchError, filter, map, shareReplay, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavannaGameApi } from './savanna-game-api.model';
import { SavannaGameCard } from './savanna-game-card.model';

enum WordsPageNumber {
  pageNumber = 1,
  wordsLevel = 1
}

@Injectable()
export class SavannaGameService {
  constructor(public http: HttpClient) { }

  // response: any;

  getWords(): Observable<SavannaGameCard[]> {

    return this.http.get(`https://api-rslang.herokuapp.com/words?page=${WordsPageNumber.pageNumber}&group=${WordsPageNumber.wordsLevel}`)
      .pipe(
        map((response: SavannaGameApi[]) => {

          const wordsArray: SavannaGameCard[] = response.map(el => {
            return {
              wordId: el.id,
              foreignWord: el.word,
              nativeWord: el.wordTranslate,
            }
          });


          console.log('RESPONSE', response);
          // console.log('WORDS',this.response[0].word);
          console.log('WORDS ARRAY', wordsArray);
          return wordsArray;
        }),
        shareReplay()
      )

  }

  getForeignWord() {

  }

}
