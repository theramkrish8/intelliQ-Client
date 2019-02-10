import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/auth/login/login.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsListComponent } from './_components/dashboard/questions-list/questions-list.component';
import { UserService } from './_services/user.service';
import { HttpService } from './_services/http.service';
import { HttpModule } from '@angular/http';
import { RoleSelectionComponent } from './_components/role-selection/role-selection.component';
import { TeacherDashboardComponent } from './_components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { GroupAdminDashboardComponent } from './_components/dashboard/group-admin-dashboard/group-admin-dashboard.component';
import { SchoolAdminDashboardComponent } from './_components/dashboard/school-admin-dashboard/school-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './_components/dashboard/super-admin-dashboard/super-admin-dashboard.component';
import { ApproverDashboardComponent } from './_components/dashboard/approver-dashboard/approver-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    DashboardComponent,
    QuestionsListComponent,
    RoleSelectionComponent,
    TeacherDashboardComponent,
    GroupAdminDashboardComponent,
    SchoolAdminDashboardComponent,
    SuperAdminDashboardComponent,
    ApproverDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [AuthGuard, AuthenticationService, UserService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
