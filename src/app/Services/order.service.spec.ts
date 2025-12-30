import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { OrderRequest } from '../Interfaces/order.interface';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send an order request and receive a response', () => {
    const orderRequest: OrderRequest = {
      userId: '9ca135b5-655c-4389-965a-faea64b05e5c',
      productId: '5501ada8-6f36-4bc2-bddd-0af637205dec',
      quantity: 2,
    };

    const mockResponse = { success: true };

    service.addOrder(orderRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://uiexercise.theproindia.com/api/Order/AddOrder');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(orderRequest);

    // Respond with mock data
    req.flush(mockResponse);
  });

  afterEach(() => {
    // Ensure no outstanding requests remain after each test
    httpMock.verify();
  });
});
