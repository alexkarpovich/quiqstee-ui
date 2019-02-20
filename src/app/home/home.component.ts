import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { AccountService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    account: User;

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.view().pipe(first()).subscribe((res:any) => {
            this.account = res.data;
        });
    }
}
