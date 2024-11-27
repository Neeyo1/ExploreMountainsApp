import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MountainListComponent } from './mountain/mountain-list/mountain-list.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';
import { MountainDetailComponent } from './mountain/mountain-detail/mountain-detail.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ProfilePrivateComponent } from './errors/profile-private/profile-private.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            {path: 'mountains', component: MountainListComponent},
            {path: 'mountains/:id', component: MountainDetailComponent},
            {path: 'profile/:id', component: ProfileComponent},
            {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
        ]
    },
    {path: 'info', component: InfoComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: 'profile-private', component: ProfilePrivateComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},
];
