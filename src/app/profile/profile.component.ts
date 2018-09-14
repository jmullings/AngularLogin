import {AccountService} from '../core/services/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from '../register';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public isSecure: boolean;
    public jokeText: string;
    public cookData: string;

    register: Register = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwords: ''
    };

    constructor(private accountService:AccountService,
                // private customValidators: CustomValidatorService,
                private router:Router) {

    }

    ngOnInit() {
        this.getCookies();
        this.getRandomQuote();

    }

    getCookies(){
        this.cookData = this.accountService.getCookies()

    }
    getRandomQuote() {
        this.accountService.quote().finally(() => {
        }).subscribe(
            (response) => {
                this.jokeText = response.toString();
                console.log(response)
            },
            (error) => {
                console.log(error)
                /* Display error message */
                alert('Oh Snap ' + error.message);
            }
        );
    }

}
