import { Component } from '@angular/core';

@Component({
    selector: "appointment-dialog",
    template: `<p-dialog header="Назначить" [(visible)]="visible" [responsive]="true">                
                <p-footer>
                    <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                        <button type="button" pButton icon="fa-close" (click)="display=false" label="Отмена"></button>
                        <button type="button" pButton icon="fa-check" (click)="display=false" label="ОК"></button>
                    </div>
                </p-footer>
              </p-dialog>`
})
export class AppointmentDialogComponent {
    visible: boolean = true;
}