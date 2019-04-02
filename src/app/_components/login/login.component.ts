import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/user.model';
import { AppResponse } from 'src/app/_models/app-response.model';
import { ResponseStatus } from 'src/app/_models/enums';
import { UserService } from 'src/app/_services/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	private returnUrl: string;
	responseMsg: string;
	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			mobile: [ '8888888888', Validators.required ],
			password: [ 'TP_8888888888', Validators.required ]
		});
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/roles';
		this.userService.userDetailsUpdated.next(null);
	}

	onSubmit() {
		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}
		var u = new User();
		u.mobile = this.loginForm.get('mobile').value;
		u.password = this.loginForm.get('password').value;
		this.authenticationService.login(u).subscribe((appResponse: AppResponse) => {
			if (appResponse.status === ResponseStatus.ERROR) {
				this.responseMsg = appResponse.msg;
			} else if (appResponse.status === ResponseStatus.SUCCESS) {
				this.authenticationService.persistUser(appResponse.body);
				this.router.navigate([ this.returnUrl ]);
			}
		});
	}
}
