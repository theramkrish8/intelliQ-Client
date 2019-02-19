import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsListComponent } from './_components/dashboard/questions-list/questions-list.component';
import { UserService } from './_services/user.service';
import { RestService } from './_services/rest.service';
import { HttpModule } from '@angular/http';
import { RoleSelectionComponent } from './_components/role-selection/role-selection.component';
import { TeacherDashboardComponent } from './_components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { GroupAdminDashboardComponent } from './_components/dashboard/group-admin-dashboard/group-admin-dashboard.component';
import { SchoolAdminDashboardComponent } from './_components/dashboard/school-admin-dashboard/school-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './_components/dashboard/super-admin-dashboard/super-admin-dashboard.component';
import { ApproverDashboardComponent } from './_components/dashboard/approver-dashboard/approver-dashboard.component';
import { LocalStorageService } from './_services/local-storage.service';
import { QuestionService } from './_services/question.service';
import { MaskService } from './_services/mask.service';
import { AddGroupComponent } from './_components/dashboard/super-admin-dashboard/add-group/add-group.component';
import { AddSchoolComponent } from './_components/dashboard/super-admin-dashboard/add-school/add-school.component';
import { AddAdminComponent } from './_components/dashboard/super-admin-dashboard/add-admin/add-admin.component';
import { UpsertMetadataComponent } from './_components/dashboard/super-admin-dashboard/upsert-metadata/upsert-metadata.component';
import { GroupService } from './_services/group.service';
import { NotificationService } from './_services/notification.service';
import { UtilityService } from './_services/utility.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
    ApproverDashboardComponent,
    AddGroupComponent,
    AddSchoolComponent,
    AddAdminComponent,
    UpsertMetadataComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuard, AuthenticationService, UserService, RestService, LocalStorageService,
    QuestionService, MaskService, GroupService, NotificationService, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
