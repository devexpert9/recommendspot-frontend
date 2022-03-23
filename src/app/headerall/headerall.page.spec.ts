import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HeaderallPage } from './headerall.page';

describe('HeaderallPage', () => {
  let component: HeaderallPage;
  let fixture: ComponentFixture<HeaderallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
