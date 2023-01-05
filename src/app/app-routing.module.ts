import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersComponent } from './component/members/members.component';
import { PersonDetailComponent } from './component/person-detail/person-detail.component';

const routes: Routes = [
  {path: '', component: MembersComponent},
  {path: 'personDetail/:id', component: PersonDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
