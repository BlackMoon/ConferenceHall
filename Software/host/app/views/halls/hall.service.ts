import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HallModel } from '../../models/index';

const url = "/api/halls";

@Injectable()
export class HallService {

    get(): Observable<any> {

        let halls: [HallModel] = [{ id: 1, name: "First Hall", description: 'Description', size: '100x100' } ];

        return Observable.of(halls);   

    }
}