import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { MustMatch } from '../../_helpers/must-match.validator';

@Component({
  templateUrl: 'confirm-signup.component.html'
})
export class ConfirmSignupComponent implements OnInit {
    confirmSignupForm: FormGroup;
    loading = false;
    submitted = false;
    token: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {         
    }

    ngOnInit() {
        this.token = this.route.snapshot.paramMap.get('token')
        this.confirmSignupForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        this.authenticationService.logout();             
    }

    get f() { return this.confirmSignupForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.confirmSignupForm.invalid) {
            return;
        }

        console.log(this.confirmSignupForm.value)

        this.loading = true;
        this.authenticationService.confirmSignup(this.token, this.confirmSignupForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/auth/login']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
