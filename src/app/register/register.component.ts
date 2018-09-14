import {AccountService} from '../core/services/account.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Register} from '../register';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    register:Register = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwords: ''
    };

    constructor(private accountService:AccountService, private router:Router) {
    
    }

    ngOnInit() {
    }

    registerAccount(acc) {
        this.accountService.create(acc).finally(() => {

        }).subscribe(
            (response) => {
                /* Redirect to profile page on successful response */
                if (response) {
                    this.accountService.setCookies(JSON.stringify(response))
                    this.router.navigate(['profile']);
                }
                else
                    alert('Incorrect email or password!');
            },
            (error) => {
                /* Display error message */
                alert('Oh Snap ' + error.message);
            }
        );
    }

    getSession():void {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        if (!regex.test(this.register.email)) {
            alert("Invalid email address");
        } else if (this.register.password === this.register.passwords) {
            alert("Invalid: Passwords do not match" +this.register.password +" "+ this.register.passwords);
        } else if (this.register.firstname !== '' && this.register.lastname !== '') {
            let account = [
                this.register.firstname,
                this.register.lastname,
                this.register.email,
                this.register.password];
            this.registerAccount(account)
        } else {
            alert("Invalid credentials");
        }
    }

}
