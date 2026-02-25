import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { MapViewComponent } from './components/map-view/map-view.component';
import { RightPanelComponent } from './components/right-panel/right-panel.component';

@Component({
  selector: 'app-map-view',
  template: '<div data-testid="map-view-stub"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MapViewStubComponent {}

@Component({
  selector: 'app-right-panel',
  template: '<div data-testid="right-panel-stub"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RightPanelStubComponent {}

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, {
        remove: { imports: [MapViewComponent, RightPanelComponent] },
        add: { imports: [MapViewStubComponent, RightPanelStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render map and right panel sections', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('[data-testid="map-view-stub"]')).toBeTruthy();
    expect(host.querySelector('[data-testid="right-panel-stub"]')).toBeTruthy();
  });
});
