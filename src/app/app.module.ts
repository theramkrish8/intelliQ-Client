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
import { UserService } from './_services/user.service';
import { RestService } from './_services/rest.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RoleSelectionComponent } from './_components/role-selection/role-selection.component';
import { TeacherDashboardComponent } from './_components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { GroupAdminDashboardComponent } from './_components/dashboard/group-admin-dashboard/group-admin-dashboard.component';
import { SchoolAdminDashboardComponent } from './_components/dashboard/school-admin-dashboard/school-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './_components/dashboard/super-admin-dashboard/super-admin-dashboard.component';
import { LocalStorageService } from './_services/local-storage.service';
import { QuestionService } from './_services/question.service';
import { AddGroupComponent } from './_components/dashboard/super-admin-dashboard/add-group/add-group.component';
import { AddSchoolComponent } from './_components/dashboard/super-admin-dashboard/add-school/add-school.component';
import { AddAdminComponent } from './_components/dashboard/super-admin-dashboard/add-admin/add-admin.component';
import { UpsertMetadataComponent } from './_components/dashboard/super-admin-dashboard/upsert-metadata/upsert-metadata.component';
import { GroupService } from './_services/group.service';
import { NotificationService } from './_services/notification.service';
import { UtilityService } from './_services/utility.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SchoolService } from './_services/school.service';
import { MetaService } from './_services/meta.service';
import { GroupProfileComponent } from './_components/dashboard/group-admin-dashboard/group-profile/group-profile.component';
import { GroupSchoolsComponent } from './_components/dashboard/group-admin-dashboard/group-schools/group-schools.component';
import { GroupSubjectsComponent } from './_components/dashboard/group-admin-dashboard/group-subjects/group-subjects.component';
import { CsvPipe } from './_pipes/csv.pipe';
import { AddressPipe } from './_pipes/address.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SchoolProfileComponent } from './_components/dashboard/school-admin-dashboard/school-profile/school-profile.component';
import { SchoolUsersComponent } from './_components/dashboard/school-admin-dashboard/school-users/school-users.component';
import { UserTypePipe } from './_pipes/user-type.pipe';
import { UserProfileComponent } from './_components/user-profile/user-profile.component';
import { SchoolUpsertUsersComponent } from './_components/dashboard/school-admin-dashboard/school-upsert-users/school-upsert-users.component';
import { CookieService } from 'ngx-cookie-service';
import { AddQuestionComponent } from './_components/dashboard/teacher-dashboard/add-question/add-question.component';
import { ViewQuestionsComponent } from './_components/dashboard/teacher-dashboard/view-questions/view-questions.component';
import { ViewRequestsComponent } from './_components/dashboard/teacher-dashboard/view-requests/view-requests.component';
import { GeneratePaperComponent } from './_components/dashboard/teacher-dashboard/generate-paper/generate-paper.component';
import { QuestionRequestService } from './_services/questionRequest.service';
import { EnumPipe } from './_pipes/enum.pipe';
import { TrimPipe } from './_pipes/trim.pipe';
import { ReviewerDashboardComponent } from './_components/dashboard/reviewer-dashboard/reviewer-dashboard.component';
import { ReviewRequestsComponent } from './_components/dashboard/reviewer-dashboard/review-requests/review-requests.component';
import { QuestionDisplayComponent } from './_components/dashboard/question-display/question-display.component';
import { QuestionListItemComponent } from './_components/dashboard/question-list-item/question-list-item.component';
import { QuestionPaperService } from './_services/question-paper.service';
import { QuillModule } from 'ngx-quill';
import { MustMatchDirective } from './directives/match-field.directive';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		PageNotFoundComponent,
		DashboardComponent,
		RoleSelectionComponent,
		TeacherDashboardComponent,
		GroupAdminDashboardComponent,
		SchoolAdminDashboardComponent,
		SuperAdminDashboardComponent,
		ReviewerDashboardComponent,
		AddGroupComponent,
		AddSchoolComponent,
		AddAdminComponent,
		UpsertMetadataComponent,
		GroupProfileComponent,
		GroupSchoolsComponent,
		GroupSubjectsComponent,
		CsvPipe,
		AddressPipe,
		SchoolProfileComponent,
		SchoolUsersComponent,
		UserTypePipe,
		UserProfileComponent,
		SchoolUpsertUsersComponent,
		AddQuestionComponent,
		ViewQuestionsComponent,
		ViewRequestsComponent,
		GeneratePaperComponent,
		EnumPipe,
		TrimPipe,
		ReviewRequestsComponent,
		QuestionDisplayComponent,
		QuestionListItemComponent,
		MustMatchDirective
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot(),
		AngularFontAwesomeModule,
		NgxSpinnerModule,
		QuillModule
	],
	providers: [
		AuthGuard,
		AuthenticationService,
		UserService,
		RestService,
		LocalStorageService,
		QuestionService,
		QuestionRequestService,
		GroupService,
		NotificationService,
		UtilityService,
		SchoolService,
		MetaService,
		CookieService,
		QuestionPaperService
	],

	bootstrap: [ AppComponent ]
})
export class AppModule {}
