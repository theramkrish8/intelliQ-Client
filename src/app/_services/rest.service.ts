import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { map, catchError } from 'rxjs/operators';
import { throwError, of } from "rxjs";
import { MaskService } from "./mask.service";
import { AppResponse } from "../_models/app-response.model";
import { ResponseStatus } from "../_models/enums";

@Injectable()
export class RestService {
    baseUrl: string;
    headers;
    constructor(private http: Http, private maskService: MaskService) {
        // this.baseUrl = "https://intelliq-61df8.firebaseio.com/";
        // this.headers = new Headers({ 'Access-Control-Allow-Origin': '*' });
        this.baseUrl = "http://localhost:8080/";

    }

    get(method: string, queryStrings: any[]) {
        this.maskService.showMask = true;
        return this.http.get(this.baseUrl + method).pipe(map((response: Response) => {
            console.log(response);
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
        return this.http.post(this.baseUrl + method, body).pipe(map((response: Response) => {
            this.maskService.showMask = false;
            return response.json();

        }), catchError((error) => {
            this.maskService.showMask = false;
            console.log(error);
            return of(new AppResponse(ResponseStatus.ERROR, "Something went wrong!", null));

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