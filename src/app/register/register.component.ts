import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from '../register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    register: Register = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password1: ''
    };

    constructor(private router : Router) { }

    ngOnInit() {
    }

    getSession() : void {
        if (this.register.password === this.register.password1 ){
            alert("Invalid: Passwords do not match");
        }else if (this.register.password == 'admin' && this.register.password == 'admin') {
            this.router.navigate(["profile"]);
        } else {
            alert("Invalid credentials");
        }
    }
    
}
