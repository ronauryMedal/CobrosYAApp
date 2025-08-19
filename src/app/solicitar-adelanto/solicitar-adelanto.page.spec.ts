import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarAdelantoPage } from './solicitar-adelanto.page';

describe('SolicitarAdelantoPage', () => {
  let component: SolicitarAdelantoPage;
  let fixture: ComponentFixture<SolicitarAdelantoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarAdelantoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
