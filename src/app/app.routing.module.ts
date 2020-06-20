import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
{
  path:'music',
  component: HomeComponent,
  children:[
    {
      path:'',
      loadChildren: ()=> import('./modules/featured/featured.module').then(m => m.FeaturedModule)
    }
  ]
},
{
  path: '**',
  redirectTo: 'music'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
