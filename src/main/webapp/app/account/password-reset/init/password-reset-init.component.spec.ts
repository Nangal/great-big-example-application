import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Renderer2, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GreatBigExampleApplicationTestModule } from '../../../../mocks/test.module';
import { PasswordResetInitComponent } from './password-reset-init.component';
import { PasswordResetInitService } from './password-reset-init.service';

describe('Component Tests', () => {

    describe('PasswordResetInitComponent', function () {
        let fixture: ComponentFixture<PasswordResetInitComponent>;
        let comp: PasswordResetInitComponent;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                imports: [GreatBigExampleApplicationTestModule],
                declarations: [PasswordResetInitComponent],
                providers: [
                    PasswordResetInitService,
                    {
                        provide: Renderer2,
                        useValue: {
                            invokeElementMethod(renderElement: any, methodName: string, args?: any[]) { }
                        }
                    },
                    {
                        provide: ElementRef,
                        useValue: new ElementRef(null)
                    }
                ]
            }).overrideTemplate(PasswordResetInitComponent, '')
                .createComponent(PasswordResetInitComponent);
            comp = fixture.componentInstance;
            comp.ngOnInit();
        });

        it('should define its initial state', () => {
            expect(comp.success).toBeUndefined();
            expect(comp.error).toBeUndefined();
            expect(comp.errorEmailNotExists).toBeUndefined();
            expect(comp.resetAccount).toEqual({});
        });

        it('sets focus after the view has been initialized',
            inject([ElementRef], (elementRef: ElementRef) => {
                const element = fixture.nativeElement;
                const node = {
                    focus() { }
                };

                elementRef.nativeElement = element;
                spyOn(element, 'querySelector').and.returnValue(node);
                spyOn(node, 'focus');

                comp.ngAfterViewInit();

                expect(element.querySelector).toHaveBeenCalledWith('#email');
                expect(node.focus).toHaveBeenCalled();
            })
        );

        it('notifies of success upon successful requestReset',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.of({}));
                comp.resetAccount.email = 'user@domain.com';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('user@domain.com');
                expect(comp.success).toEqual('OK');
                expect(comp.error).toBeNull();
                expect(comp.errorEmailNotExists).toBeNull();
            })
        );

        it('notifies of unknown email upon email address not registered/400',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.throw({
                    status: 400,
                    data: 'email address not registered'
                }));
                comp.resetAccount.email = 'user@domain.com';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('user@domain.com');
                expect(comp.success).toBeNull();
                expect(comp.error).toBeNull();
                expect(comp.errorEmailNotExists).toEqual('ERROR');
            })
        );

        it('notifies of error upon error response',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.throw({
                    status: 503,
                    data: 'something else'
                }));
                comp.resetAccount.email = 'user@domain.com';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('user@domain.com');
                expect(comp.success).toBeNull();
                expect(comp.errorEmailNotExists).toBeNull();
                expect(comp.error).toEqual('ERROR');
            })
        );

    });
});
