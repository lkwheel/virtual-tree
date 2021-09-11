import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
