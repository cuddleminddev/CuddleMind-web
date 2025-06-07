import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayComponent } from '../display/display.component';
import { authGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
  { path: '', component: DisplayComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllListRoutingRoutingModule { }
