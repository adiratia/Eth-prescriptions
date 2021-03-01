import { Web3Service } from 'src/app/services/web3.service';
import { ClientComponent } from './client/client.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AuthGuardService } from './services/auth-guard.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  {
    path: 'doctor',
    component: DoctorComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'client',
    component: ClientComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
