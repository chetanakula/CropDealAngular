import { Component, OnInit } from '@angular/core';
import { CropOnSale } from 'Models/croponsale.model';
import { Invoice } from 'Models/invoice.model';
import { CroponsaleService } from 'Service/croponsale.service';
import { EmailService } from 'Service/email.service';
import { InvoiceService } from 'Service/invoice.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  cropinfo!: CropOnSale;
  decisioninfo: boolean = false;
  router: any;
  constructor(
    private invoice: InvoiceService,
    //private toastr: ToastrService, 
    private cropservice: CroponsaleService,
    private emailservice: EmailService,
    //private supplierservice: SupplierService   
  ) { }
  ngOnInit(): void {
    this.GetOrderDetails();
  }
  InvoiceList: Invoice[] = [];

  GetOrderDetails() {
    this.invoice.GetOrders()
      .subscribe((data) => {
        //console.log(data);
        for (let x of data) {
          //console.log(x.farmerId);
          if (x.review == 'status pending') {
            this.InvoiceList.push(x);
          }
        }
        this.InvoiceList = data;
      });
  }
  //ConfirmOrder(order: Order) {} 
  RejectOrder(order: Invoice) {
    order.review = 'Rejected';
    this.invoice.UpdateOrder(order.invoiceId, order).subscribe((data) => {
      console.log(data);
    });
    alert('order was rejected');
    location.reload();
  }
  ReduceCropQuantity(order: Invoice) {
    this.cropservice.getCropOnSale(order.cropSaleId).subscribe((data) => {
      this.cropinfo = data;
      console.log(this.cropinfo);
      if (this.cropinfo.cropQty >= order.cropQty) {
        this.decisioninfo = true;
        this.cropinfo.cropQty = this.cropinfo.cropQty - order.cropQty;
        console.log(this.cropinfo.cropQty);
        this.cropservice.updateCropOnSale(order.cropSaleId, this.cropinfo)
          .subscribe((data) => {
            console.log(data);
          });
        order.review = 'Confirmed';
        if (this.decisioninfo) {
          this.invoice.UpdateOrder(order.invoiceId, order).subscribe((data) => {
            console.log(data);
          });
          alert('order confirmed');
          alert('Mail sent');
          //this.toastr.success('Mail Sent');  
          this.emailservice.AdminConfirmedEmail(order).subscribe((data) => {
            //console.log(data);
          });
          location.reload();
        }
        //this.decisioninfo = true;  
      }
    });
  }
  LogOut() {
    this.router.navigate[('/home')]
    localStorage.removeItem('role');
  }
//   delete(invoiceId: any) {
  //      {
    //       this.invoice.DeleteOrder(invoiceId).subscribe(result => {
      //        alert("order was rejected"); 
    //  });
    // }
    // function delay(time: any) {
      //   return new Promise((resolve) => setTimeout(resolve, time));
      // }
      // delay(4000).then(() => console.log('ran after 1 second1 passed'));
      //this.SendMail(this.InvoiceEmaillst); 
      //  location.reload();
      //   }


}


