import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BackService } from './provider/back.service';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphComponent } from './graph/graph.component';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const appRoutes: Routes = [
  { path: 'Graph', component: GraphComponent },
  { path: '**', component: GraphComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, BackService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
