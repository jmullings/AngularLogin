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

    /**
     * registerAccount
     * @param acc
     */
    registerAccount(acc) {
        this.accountService.create(acc).finally(() => {
        }).subscribe(
            (response) => {
                /* Redirect to profile page on successful response */
                if(response)  {
                    this.accountService.setCookies(Object.values(response)[2]);
                    this.router.navigate(['profile']);
                }
            },
            (error) => {
                /* Display error message */
                alert('Oh Snap ' + error.message);
            }
        );
    }

    /**
     * getSession
     */
    getSession():void {
        
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        
        if (!regex.test(this.register.email)) {
            alert("Invalid email address");
        } else if (this.register.password !== this.register.passwords) {
            alert("Invalid: Passwords do not match");
        } else if (this.register.firstname !== '' && this.register.lastname !== '') {
            var item = {
                firstname: this.register.firstname,
                lastname: this.register.lastname,
                email: this.register.email,
                password:this.register.password,
            };
            this.registerAccount(item);
        } else {
            alert("Invalid credentials");
        }
    }

}
