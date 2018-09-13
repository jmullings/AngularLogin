/**
 * Created by jlmconsulting on 9/13/18.
 */

import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
    let appRoutingModule: AppRoutingModule;

    beforeEach(() => {
        appRoutingModule = new AppRoutingModule();
    });

    it('should create an instance', () => {
        expect(appRoutingModule).toBeTruthy();
    });
});