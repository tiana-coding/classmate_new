import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agenda } from './agenda';

describe('Agenda', () => {
  let component: Agenda;
  let fixture: ComponentFixture<Agenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Agenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
