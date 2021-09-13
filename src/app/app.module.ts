import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

import { AppComponent } from './app.component';
import { VirtualCheckboxTreeComponent } from './virtual-checkbox-tree/virtual-checkbox-tree.component';
import { VirtualCheckboxTreeChildComponent } from './virtual-checkbox-tree/virtual-checkbox-tree-child.component';
import { TristateCheckboxComponent } from './tristate-checkbox/tristate-checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    VirtualCheckboxTreeComponent,
    VirtualCheckboxTreeChildComponent,
    TristateCheckboxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenuModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
