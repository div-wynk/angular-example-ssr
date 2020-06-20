import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WarningPopupComponent } from './warning-popup.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Mock class for NgbModalRef
export class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

describe('WarningPopupComponent', () => {
  let component: WarningPopupComponent;
  let fixture: ComponentFixture<WarningPopupComponent>;
  let modal: NgbActiveModal;
  let mockModalRef: MockNgbModalRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningPopupComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();

    modal = TestBed.get(NgbActiveModal);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPopupComponent);
    component = fixture.componentInstance;
    component.heading = 'Warning!';
    component.message = 'This is warning message';
    component.leftBtn = 'cancel';
    component.rightBtn = 'okay';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have apt UI', () => {
    let el = fixture.debugElement.nativeElement;
    let heading = el.querySelector('h2');
    let message = el.querySelector('p');
    let buttons = el.querySelectorAll('button');
    expect(heading.textContent).toEqual('Warning!');
    expect(message.textContent).toEqual('This is warning message');
    expect(buttons[0].textContent).toEqual('cancel');
    expect(buttons[1].textContent).toEqual('okay');
  });

  it('should exit when cancel is clicked', async () => {
    spyOn(modal, 'close').and.returnValue(mockModalRef);
    let el = fixture.debugElement.nativeElement;
    let buttons = el.querySelectorAll('button');
    buttons[0].click();
    fixture.whenStable().then(() => {
      expect(modal.close).toHaveBeenCalled();
    });
  });

  it('should exit with YES when okay is clicked', async () => {
    spyOn(modal, 'close').and.returnValue(mockModalRef);
    let el = fixture.debugElement.nativeElement;
    let buttons = el.querySelectorAll('button');
    buttons[1].click();
    fixture.whenStable().then(() => {
      expect(modal.close).toHaveBeenCalledWith('YES');
    });
  });

});