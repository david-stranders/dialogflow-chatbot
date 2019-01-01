import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MessageListComponent} from "./components/message-list/message-list.component";
import {MessageFormComponent} from "./components/message-form/message-form.component";
import {MessageItemComponent} from "./components/message-item/message-item.component";
import {FormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, MessageListComponent, MessageFormComponent, MessageItemComponent
      ],
      imports: [ FormsModule, HttpClientTestingModule]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
