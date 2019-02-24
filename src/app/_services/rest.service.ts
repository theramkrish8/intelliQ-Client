import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { MaskService } from './mask.service';
import { AppResponse } from '../_models/app-response.model';
import { ResponseStatus } from '../_models/enums';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class RestService {
	baseUrl: string;
	headers;
	constructor(
		private http: Http,
		private maskService: MaskService,
		private localStorageService: LocalStorageService
	) {
		this.baseUrl = 'http://localhost:8080/';
	}

	get(method: string, queryStrings: any[]) {
		var headers = new Headers();
		this.maskService.showMask = true;
		return this.http.get(this.baseUrl + method, { headers: headers }).pipe(
			map((response: Response) => {
				return response.json();
			}),
			catchError((error) => {
				console.log(error);
				return throwError('Something went wrong!');
			}),
			finalize(() => {
				this.maskService.showMask = false;
			})
		);
	}

	post(method: string, body: any) {
		var headers = new Headers();
		this.maskService.showMask = true;
		return this.http.post(this.baseUrl + method, body, { headers: headers }).pipe(
			map((response: Response) => {
				return response.json();
			}),
			catchError((error) => {
				console.log(error);
				return of(new AppResponse(ResponseStatus.ERROR, 'Something went wrong!', null));
			}),
			finalize(() => {
				this.maskService.showMask = false;
			})
		);
	}
	put(method: string, body: any) {
		var headers = new Headers();
		this.maskService.showMask = true;
		return this.http.put(this.baseUrl + method, body, { headers: headers }).pipe(
			map((response: Response) => {
				const data = response.json();
				return data;
			}),
			catchError((error) => {
				console.log(error);
				return throwError('Something went wrong!');
			}),
			finalize(() => {
				this.maskService.showMask = false;
			})
		);
	}
	delete(method: string, body: any) {
		var headers = new Headers();
		this.maskService.showMask = true;
		return this.http.delete(this.baseUrl + method, { headers: headers }).pipe(
			map((response: Response) => {
				return response.json();
			}),
			catchError((error) => {
				console.log(error);
				return throwError('Something went wrong!');
			}),
			finalize(() => {
				this.maskService.showMask = false;
			})
		);
	}
}
