import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SavannahGameComponent } from './savannah.component';
import { SavannahGameService } from './savannah.service';

@NgModule({
  declarations: [SavannahGameComponent],
  exports: [SavannahGameComponent],
  providers: [SavannahGameService, HttpClient],
  imports: [CommonModule],
})
export class SavannahGameModule {}
