import {AccountService} from '../core/services/account.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Login} from '../login';

@Component({
    selector: 'app-log in',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    login:Login = {
        email: '',
        password: ''
    };

    constructor(private accountService:AccountService,
                private router:Router) {

    }

    ngOnInit() {
    }

    getLogin(pass,email) {
        this.accountService.login([pass,email]).finally(() => {

        }).subscribe(
            (response) => {
                /* Redirect to profile page on successfull response */
                if(response)
                    this.router.navigate(['profile']);
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
        if (!regex.test(this.login.email)) {
            alert("Invalid email address");
        } else  if (this.login.password !== '') {
            this.getLogin(this.login.email,this.login.password)
        } else {
            alert("Invalid credentials");
        }
    }

}