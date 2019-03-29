import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RestService {
	baseUrl: string;
	constructor(private spinner: NgxSpinnerService, private http: HttpClient) {
		this.baseUrl = 'http://localhost:8080/';
	}

	get(method: string) {
		this.spinner.show();
		return this.http.get(this.baseUrl + method).pipe(
			catchError((error) => {
				console.log(error);
				return of(new AppResponse(ResponseStatus.ERROR, 'Oops..Something went wrong!', error));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}

	post(method: string, body: any) {
		this.spinner.show();
		return this.http.post(this.baseUrl + method, body).pipe(
			catchError((error) => {
				console.log(error);
				return of(new AppResponse(ResponseStatus.ERROR, 'Something went wrong!', null));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}

	put(method: string, body: any) {
		this.spinner.show();
		return this.http.put(this.baseUrl + method, body).pipe(
			catchError((error) => {
				console.log(error);
				return of(new AppResponse(ResponseStatus.ERROR, 'Something went wrong!', null));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}
	delete(method: string, body: any) {
		this.spinner.show();
		return this.http.delete(this.baseUrl + method).pipe(
			catchError((error) => {
				console.log(error);
				return of(new AppResponse(ResponseStatus.ERROR, 'Something went wrong!', null));
			}),
			finalize(() => {
				this.spinner.hide();
			})
		);
	}
}
