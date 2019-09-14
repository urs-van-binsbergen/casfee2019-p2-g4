import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { AuthService } from './auth/auth.service';

class MockAuthService {
}

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatToolbarModule,
                MatMenuModule,
                MatIconModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                { provide: AuthService, useClass: MockAuthService }
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'CAS FEE 2019 Projekt 2 Gruppe 4'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('CAS FEE 2019 Projekt 2 Gruppe 4');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h3').textContent).toContain('CAS FEE 2019 Projekt 2 Gruppe 4');
    });
});
