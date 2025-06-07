import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlansListComponent } from '../plans-list/plans-list.component';
import { authGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
  { path:'', component: PlansListComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingRoutingModule { }
