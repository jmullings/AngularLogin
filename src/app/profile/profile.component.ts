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

    public email: string;
    public isSecure: boolean;
    public jokeText: string;
    public cookData: string;
    public firstname: string;
    public lastname: string;

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

    /**
     * Call cookie or redirect
     */
    ngOnInit() {
        this.getCookies();
        this.getRandomQuote();

    }

    /**
     * getCookies
     */
    getCookies(){
        this.cookData = this.accountService.getCookies();
        if(!this.cookData)
            this.router.navigate(['landing']);
        else
        this.accountService.getUser(this.cookData).finally(() => {
        }).subscribe(
            (response) => {
                if (response){
                    const arrs = Object.values(response);
                    this.firstname =arrs[1];
                    this.lastname =arrs[2];
                    this.email =arrs[3];
                    if(!arrs.length)
                        this.router.navigate(['landing']);
                }
            },
            (error) => {
                alert('Oh Snap ' + error.message);
            }
        );

    }

    /**
     * getRandomQuote API Call..
     */
    getRandomQuote() {
        this.accountService.quote().finally(() => {
        }).subscribe(
            (response) => {
                this.jokeText = response.toString();},
            (error) => {
                console.log(error);
                /* Display error message */
                alert('Oh Snap ' + error.message);
            }
        );
    }

}
