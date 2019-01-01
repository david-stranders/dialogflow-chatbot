import { TestBed, inject } from '@angular/core/testing';

import { DialogflowService } from './dialogflow.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DialogflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogflowService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([DialogflowService], (service: DialogflowService) => {
    expect(service).toBeTruthy();
  }));
});
