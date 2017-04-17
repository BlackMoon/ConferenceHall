import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HallModel } from '../../models/index';

@Injectable()
export class HallService {

    get(): Observable<any> {

        let halls: [HallModel] = [{ id: 1, name: "First Hall" } ];

        return Observable.of(halls);   

    }
}