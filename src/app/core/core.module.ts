import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';

/* Core Components */
import {NotFoundComponent} from './404/404.component';

/* Core Guards */
// import {AuthGuard} from './guards/auth.guard';

// /* Core Services */
// import {AccountService} from './services/account.service';
// import {CustomValidatorService} from './services/custom-validator.service';

@NgModule({
    imports: [CommonModule, RouterModule, HttpModule],
    declarations: [ NotFoundComponent],
    exports: [NotFoundComponent],
})
export class CoreModule {

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            // providers: [AccountService, CustomValidatorService, AuthGuard],
            // providers: [AuthGuard],
        };
    }


    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
