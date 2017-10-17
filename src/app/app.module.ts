import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BackService } from './provider/back.service';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphComponent } from './graph/graph.component';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { GraphComponentComponent } from './graph-component/graph-component.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

const appRoutes: Routes = [
  { path: 'Graph', component: GraphComponent },
  { path: '**', component: GraphComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    GraphComponentComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    Ng4LoadingSpinnerModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, BackService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
