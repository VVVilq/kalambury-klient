import { TestBed } from '@angular/core/testing';

import { CustomListServiceService } from './custom-list-service.service';

describe('CustomListServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomListServiceService = TestBed.get(CustomListServiceService);
    expect(service).toBeTruthy();
  });
});
