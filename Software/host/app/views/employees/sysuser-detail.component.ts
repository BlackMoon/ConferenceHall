import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { SysUserModel, UserRole } from '../../models';

@Component({
    selector: "sysuser-detail",
    templateUrl: "sysuser-detail.component.html"
})
export class SysUserDetailComponent implements OnInit {

    /**
    * id sysUser
    */
    id: number;
    operationLabel: string = "Привязать";
    requireValidation: boolean;

    @Input("group")
    sysUserForm: FormGroup;

    roles: SelectItem[];    

    constructor(        
        private fb: FormBuilder) {

        let roleKeys = Object
            .keys(UserRole)
            .filter(k => typeof UserRole[k] !== "function");

        this.roles = roleKeys
            .slice(roleKeys.length / 2)
            .map(k => {
                let role = UserRole[k];
                return <SelectItem>
                    {
                        label: UserRole.toName(role),
                        value: role
                    }
            });
    }    

    ngOnInit() {

        this.sysUserForm.get("id")
            .valueChanges
            .subscribe(value => {                
                this.id = value;
                this.operationLabel = "Отвязать";
            });

        this.sysUserForm.get("operation")
            .valueChanges
            .subscribe(value => {
                
                this.requireValidation = value && !this.id;

                let loginControl = this.sysUserForm.get("login");
                if (loginControl) {
                    loginControl.setValidators(this.requireValidation ? [Validators.required] : null);
                    loginControl.updateValueAndValidity();
                }

                let passwdControl = this.sysUserForm.get("password");
                if (passwdControl) {
                    passwdControl.setValidators(this.requireValidation ? [Validators.required] : null);
                    passwdControl.updateValueAndValidity();
                }
            });
    }    
}
