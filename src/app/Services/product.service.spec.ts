import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../Interfaces/product.interface';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products with quantity >= 1', () => {
    const mockProducts: Product[] = [
      { _id: '37135a1a-5c18-4e53-aae8-1be32fa404d7', productName: 'buds', quantity: 3, isActive: true,price:4,category:"f" },
      { _id: '95762050-7436-4893-a5b7-1c2cd3789803', productName: 'onePad', quantity: 4,isActive: true,price:4,category:"f" },
    ];

    const filteredProducts = mockProducts.filter(product => product.quantity >= 1);

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(filteredProducts);
    });

    const req = httpMock.expectOne('https://uiexercise.theproindia.com/api/Product/GetAllProduct');
    expect(req.request.method).toBe('GET');
    
    // Respond with the mock data
    req.flush(mockProducts);
  });

  
});
