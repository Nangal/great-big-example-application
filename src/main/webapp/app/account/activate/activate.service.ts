import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActivateService {

    constructor(private http: HttpClient) { }

    get(key: string): Observable<any> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('key', key);

        return this.http.get('api/activate', {
            search: params
        }).map((res: Response) => res);
    }
}
