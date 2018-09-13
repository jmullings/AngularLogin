// import {Injectable} from '@angular/core';
// import {AbstractControl, FormControl, ValidatorFn} from '@angular/forms';
//
// import * as zxcvbn from 'zxcvbn';
//
// /**
//  * This class provides custom form control validators.
//  */
// @Injectable()
// export class CustomValidatorService {
//     /**
//      * Validator that requires controls to have a valid email.
//      * @param {FormControl} control - A FormControl object.
//      * @return {Validation} - A validation result object.
//      */
//     public email(control: FormControl): Validation {
//         const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
//         return regex.test(control.value) ? null : {email: true};
//     }
//     /**
//      * Validator that requires controls to have a valid password.
//      * @param {FormControl} control - A FormControl object.
//      * @return {Validation} - A validation result object.
//      */
//     public password(control: FormControl): Validation {
//         const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
//         return regex.test(control.value) ? null : {password: true};
//     }
//     /**
//      * Validator function provider that returns a validator which requires controls to have a minimum zxcvbn value.
//      * @param {number} threshold - The minimum zxcvbn value required by the FormControl.
//      * @return {ValidationFn} - A validation function.
//      */
//     public zxcvbn(threshold: number): ValidatorFn {
//         return (control: AbstractControl): Validation => {
//             return zxcvbn(control.value || '').score >= threshold ? null : {zxcvbn: true};
//         };
//     }
// }
