import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MountainListComponent } from './mountain/mountain-list/mountain-list.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'mountains', component: MountainListComponent},
            {path: 'profile', component: ProfileComponent},
            {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
        ]
    },
    {path: 'info', component: InfoComponent},
    {path: 'register', component: RegisterComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
