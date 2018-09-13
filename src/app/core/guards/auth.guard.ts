// import {Injectable} from '@angular/core';
// import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
//
// import * as swal from 'sweetalert';
// import {Observable, Subject} from 'rxjs/Rx';
//
// /* Services */
// import {AccountService} from '../../core/services/account.service';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//
//     constructor(private router: Router, private accountService: AccountService) {}
//
//     public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//         /* Create a new Subject to hold the result from subscribing to observable returned by activate account service */
//         const subject = new Subject<boolean>();
//         this.accountService.checkSession().subscribe(
//             (response) => {
//                 /* Activate route on successfull response */
//                 subject.next(true);
//             },
//             (error) => {
//                 /* Redirect to login page on error */
//                 this.router.navigate(['login']);
//                 /* Display error message for non 401 and 503 errors */
//                 if (error.status !== 401 && error.status !== 503) {
//                     swal('Oh Snap', `${error.message}`, 'error');
//                 }
//                 /* Prevent route from activating */
//                 subject.next(false);
//             },
//         );
//         return subject.asObservable();
//     }
// }
