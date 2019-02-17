import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { LoginComponent } from './_components/login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { QuestionsListComponent } from './_components/dashboard/questions-list/questions-list.component';
import { RoleSelectionComponent } from './_components/role-selection/role-selection.component';
import { TeacherDashboardComponent } from './_components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { SuperAdminDashboardComponent } from './_components/dashboard/super-admin-dashboard/super-admin-dashboard.component';
import { GroupAdminDashboardComponent } from './_components/dashboard/group-admin-dashboard/group-admin-dashboard.component';
import { SchoolAdminDashboardComponent } from './_components/dashboard/school-admin-dashboard/school-admin-dashboard.component';
import { ApproverDashboardComponent } from './_components/dashboard/approver-dashboard/approver-dashboard.component';
import { AddGroupComponent } from './_components/dashboard/super-admin-dashboard/add-group/add-group.component';
import { AddSchoolComponent } from './_components/dashboard/super-admin-dashboard/add-school/add-school.component';
import { AddAdminComponent } from './_components/dashboard/super-admin-dashboard/add-admin/add-admin.component';
import { UpsertMetadataComponent } from './_components/dashboard/super-admin-dashboard/upsert-metadata/upsert-metadata.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'teacher', component: TeacherDashboardComponent,
      children: [{ path: 'my-questions', component: QuestionsListComponent },
      { path: 'all-questions', component: QuestionsListComponent }]
    }, {
      path: 'super-admin', component: SuperAdminDashboardComponent,
      children: [{ path: 'group', component: AddGroupComponent },
      { path: 'school', component: AddSchoolComponent },
      { path: 'admin', component: AddAdminComponent },
      { path: 'metadata', component: UpsertMetadataComponent }]
    }, {
      path: 'group-admin', component: GroupAdminDashboardComponent,
      children: [{ path: 'my-questions', component: QuestionsListComponent },
      { path: 'all-questions', component: QuestionsListComponent }]
    }, {
      path: 'school-admin', component: SchoolAdminDashboardComponent,
      children: [{ path: 'my-questions', component: QuestionsListComponent },
      { path: 'all-questions', component: QuestionsListComponent }]
    }, {
      path: 'approver', component: ApproverDashboardComponent,
      children: [{ path: 'my-questions', component: QuestionsListComponent },
      { path: 'all-questions', component: QuestionsListComponent }]
    }]

  },

  { path: '', redirectTo: 'dashboard', pathMatch: "full" },

  { path: 'roles', component: RoleSelectionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },

  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
