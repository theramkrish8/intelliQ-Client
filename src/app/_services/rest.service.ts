import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestService {
	baseUrl: string;
	httpOptions: any;

	constructor(private spinner: NgxSpinnerService, private http: HttpClient, private cookieService: CookieService) {
		this.baseUrl = 'https://localhost:8080/';
	}

	createOptions() {
		var xsrf = this.cookieService.get('XSRF-TOKEN');
		if (!xsrf) {
			xsrf = '';
		}
		console.log('XSRF =>', xsrf);
		this.httpOptions = {
			headers: new HttpHeaders({ 'X-Xsrf-Token': xsrf }),
			withCredentials: true
		};
	}

	get(method: string) {
		this.spinner.show();
		this.createOptions();
		return this.http.get(this.baseUrl + method, this.httpOptions).pipe(
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				return of(this.prepareAppResponse(error));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}

	post(method: string, body: any) {
		this.spinner.show();
		this.createOptions();
		return this.http.post(this.baseUrl + method, body, this.httpOptions).pipe(
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				return of(this.prepareAppResponse(error));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}

	put(method: string, body: any) {
		this.spinner.show();
		this.createOptions();
		return this.http.put(this.baseUrl + method, body, this.httpOptions).pipe(
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				return of(this.prepareAppResponse(error));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}

	delete(method: string, body: any) {
		this.spinner.show();
		this.createOptions();
		return this.http.delete(this.baseUrl + method, this.httpOptions).pipe(
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				return of(this.prepareAppResponse(error));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}
	prepareAppResponse(error: HttpErrorResponse) {
		if (error.status === ResponseStatus.FORBIDDEN) {
			return new AppResponse(ResponseStatus.FORBIDDEN, error.error, null);
		}
		return new AppResponse(ResponseStatus.ERROR, 'Something went wrong!', null);
	}
}
