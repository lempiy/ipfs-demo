import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ItemComponent } from './item/item.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: "",
    component: ListComponent,
  },
  {
    path: ":id",
    component: ItemComponent,
  },
  {
    path: "video/add",
    component: AddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
