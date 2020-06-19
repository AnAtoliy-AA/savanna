import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SavannaGameComponent } from './savanna-game.component';
import { SavannaGameService } from './savanna-game.service'

@NgModule({
  declarations: [SavannaGameComponent],
  exports: [SavannaGameComponent],
  providers: [SavannaGameService, HttpClient],
  imports: [
    CommonModule
  ]
})
export class SavannaGameModule { }
