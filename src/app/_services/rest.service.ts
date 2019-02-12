import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { map, catchError } from 'rxjs/operators';
import { throwError } from "rxjs";
import { MaskService } from "./mask.service";

@Injectable()
export class RestService {
    baseUrl: string;
    headers;
    constructor(private http: Http, private maskService: MaskService) {
        this.baseUrl = "https://intelliq-61df8.firebaseio.com/";
        this.headers = new Headers({ 'test': 'myHeader' });
    }

    get(method: string, queryStrings: any[]) {
        this.maskService.showMask = true;
        return this.http.get(this.baseUrl + method, { headers: this.headers }).pipe(map((response: Response) => {
            const data = response.json();
            this.maskService.showMask = false;
            return data;
        }), catchError((error) => {
            this.maskService.showMask = false;
            console.log(error);
            return throwError("Something went wrong!");
        }));
    }
    put(method: string, body: any) {
        this.maskService.showMask = true;
        return this.http.put(this.baseUrl + method, body, { headers: this.headers }).pipe(map((response: Response) => {
            const data = response.json();
            this.maskService.showMask = false;
            return data;
        }), catchError((error) => {
            this.maskService.showMask = false;
            console.log(error);
            return throwError("Something went wrong!");
        }));
    }


    post(method: string, body: any) {
        this.maskService.showMask = true;
        return this.http.post(this.baseUrl + method, body, { headers: this.headers }).pipe(map((response: Response) => {
            const data = response.json();
            this.maskService.showMask = false;
            return data;
        }), catchError((error) => {
            this.maskService.showMask = false;
            console.log(error);
            return throwError("Something went wrong!");
        }));
    }

    delete(method: string, body: any) {
        this.maskService.showMask = true;
        return this.http.delete(this.baseUrl + method, { headers: this.headers }).pipe(map((response: Response) => {
            const data = response.json();
            this.maskService.showMask = false;
            return data;
        }), catchError((error) => {
            this.maskService.showMask = false;
            console.log(error);
            return throwError("Something went wrong!");
        }));
    }


}