import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { Logger } from "../../common/logger";
import { TickerModel } from '../../models';
import { TickerService } from './ticker.service';

@Component({
    selector: "ticker-table",
    templateUrl: "ticker-table.component.html"
})
export class TickerTableComponent {

    editMode: boolean;
    tickerForm: FormGroup;

    tickers: TickerModel[] = [];
    selectedTickers: TickerModel[] = [];

    // ReSharper disable InconsistentNaming
    private _conferenceId: number;

    get conferenceId(): number {
        return this._conferenceId;
    }

    @Input()
    set conferenceId(value: number) {
        this._conferenceId = value;
        value && this.loadTickers();
    }

    constructor(
        private confirmationService: ConfirmationService,
        private tickerService: TickerService,
        private fb: FormBuilder,
        private logger: Logger) { }

    ngOnInit() {

        this.tickerForm = this.fb.group({
            content: [null, Validators.required]    
        });
    }

    addTicker(ticker) {

        ticker.active = true;
        ticker.conferenceId = this.conferenceId;

        this.tickerService
            .add(ticker)
            .subscribe(
                key => {
                    ticker.id = key;
                    this.tickers.push(ticker);
                    this.tickerForm.reset();
                },
                error => this.logger.error2(error));
    }

    changeActive(e, message) {
        
        e.originalEvent.stopPropagation();

        this.tickerService
            .changeActive(message.id, e.checked)
            .subscribe(
                _ => message.active = e.checked,
                error => this.logger.error2(error));
    }

    changeContent(e, message) {

        let content = e.currentTarget.value;

        if (content !== message.content) {
            this.tickerService
                .changeContent(message.id, content)
                .subscribe(
                    _ => message.content = content,
                    error => this.logger.error2(error));
        }
    }

    changeEditMode() {
        this.editMode = !this.editMode;
        this.selectedTickers.length = 0;
    }
    

    loadTickers() {
       
        this.tickerService
            .getAll(this.conferenceId)
            .subscribe(
                tickers => this.tickers = tickers,
                error => this.logger.error2(error)
            );
    }

    removeRows() {

        this.confirmationService.confirm({
            header: 'Вопрос',
            icon: 'fa fa-trash',
            message: `Удалить выбранные записи?`,
            accept: _ => {
                
                this.tickerService
                    .delete(this.selectedTickers.map(s => s.id))
                    .subscribe(
                    _ => {

                        this.selectedTickers.forEach(h => {
                            let ix = this.tickers.findIndex(n => n.id === h.id);
                            this.tickers.splice(ix, 1);
                        });

                        this.selectedTickers.length = 0;
                    },
                    error => this.logger.error2(error));
            }
        });    
    }
}