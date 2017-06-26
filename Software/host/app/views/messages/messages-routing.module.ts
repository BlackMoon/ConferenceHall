import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SendMessageComponent } from './send-message.component';

const messageRoutes: Routes = [
    { path: 'send', component: SendMessageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(messageRoutes)],
    exports: [RouterModule]
})
export class MessageRoutingModule { }