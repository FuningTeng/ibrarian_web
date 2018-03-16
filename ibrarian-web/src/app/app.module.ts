import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { D3Service } from 'd3-ng2-service';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { ForceDragViewComponent } from './force-drag-view/force-drag-view.component';
import { HttpModule } from '@angular/http';
import { IbrarianService } from './ibrarian.service';


@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    ForceDragViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [D3Service, IbrarianService],
  bootstrap: [AppComponent]
})
export class AppModule { }
