import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class RestService {
	baseUrl: string;
	headers;
	constructor(private http: Http, private spinner: NgxSpinnerService) {
		this.baseUrl = 'http://localhost:8080/';
	}

	get(method: string, queryStrings: any[]) {
		var headers = new Headers();
		this.spinner.show();
		return this.http.get(this.baseUrl + method, { headers: headers }).pipe(
			map((response: Response) => {
				var a = response.json();
				return response.json();
			}),
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
		var headers = new Headers();
		this.spinner.show();
		return this.http.post(this.baseUrl + method, body, { headers: headers }).pipe(
			map((response: Response) => {
				return response.json();
			}),
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
		var headers = new Headers();
		this.spinner.show();
		return this.http.put(this.baseUrl + method, body, { headers: headers }).pipe(
			map((response: Response) => {
				const data = response.json();
				return data;
			}),
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
		var headers = new Headers();
		this.spinner.show();
		return this.http.delete(this.baseUrl + method, { headers: headers, body: body }).pipe(
			map((response: Response) => {
				return response.json();
			}),
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
