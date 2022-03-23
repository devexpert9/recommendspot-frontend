import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SidebarnewPage } from './sidebarnew.page';

describe('SidebarnewPage', () => {
  let component: SidebarnewPage;
  let fixture: ComponentFixture<SidebarnewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarnewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarnewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
