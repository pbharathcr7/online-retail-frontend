import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaceOrderComponent } from './place-order.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/Services/order.service';

describe('PlaceOrderComponent', () => {
  let component: PlaceOrderComponent;
  let fixture: ComponentFixture<PlaceOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceOrderComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule,ToastrModule.forRoot()], // Include forms if used
      providers: [OrderService,ToastrService], 
    }).compileComponents();
    fixture = TestBed.createComponent(PlaceOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
