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

    /**
     * getLogin
     * @param item
     */
    getLogin(item) {
        this.accountService.login(item).finally(() => {
        }).subscribe(
            (response) => {
                if (response){
                    const arrs = Object.values(response);
                    if(!arrs.length)
                        alert('Sorry wrong email or password');
                    else{
                        this.accountService.setCookies(Object.values(response)[4]);
                        this.router.navigate(['profile']);
                    }
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
        
        if (!regex.test(this.login.email)) {
            alert("Invalid email address");
        } else  if (this.login.password !== '') {
            const item ={
                email:this.login.email,
                password:this.login.password
            }
            this.getLogin(item)
        } else {
            alert("Invalid credentials");
        }
    }

}