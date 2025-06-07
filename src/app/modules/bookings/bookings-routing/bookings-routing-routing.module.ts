import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from '../bookings/bookings.component';
import { authGuard } from '../../../core/guard/auth.guard';

const routes: Routes = [
  { path: '', component: BookingsComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingRoutingModule { }
