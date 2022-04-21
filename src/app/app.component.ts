import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { IfStmt, ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface Buy {
  accion: string;
  precio: number;
  titulos: number;
  total: number;
}

export interface Sell {
  accion: string;
  precio: number;
  titulos: number;
  total: number;
}

export interface Forward {
  total1: number
  total2: number
  monto: number
  plazo: number
  spot: number
  precioAdelantado: number
  valorNominal: number
  porcentaje: number
  tc1: number
  tc2: number
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ELEMENT_DATA_BUY: Buy[] = [];
  ELEMENT_DATA_SELL: Sell[] = [];

  ELEMENT_DATA_FORWARD: any[] = [];

  displayedColumns: string[] = ['accion', 'precio', 'titulos', 'total'];
  displayedColumnsForward: string[] = ['monto', 'plazo', 'spot', 'precioAdelantado', 'valorNominal', 'porcentaje', 'tc1', 'tc2', 'total1', 'total2'];

  dataSourceBuy: any
  dataSourceSell: any;
  dataSourceForward: any

  title = 'proyecto';

  tc1: any
  tc2: any
  total1 = 0
  total2 = 0

  sell = false
  buy = false
  error = false
  error1 = false
  error2 = false
  error3 = false

  formBuy!: FormGroup
  formSell!: FormGroup
  formForward!: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formBuy = this.fb.group({
      accion: [''],
      precio: [''],
      titulos: [''],
    })
    this.formSell = this.fb.group({
      accion: [''],
      precio: [''],
      titulos: [''],
    })
    this.formForward = this.fb.group({
      monto: [''],
      plazo: [''],
      spot: [''],
      precioAdelantado: [''],
      valorNominal: [''],
      porcentaje: [''],
      tc1: [''],
      tc2: ['']
    })
  }

  submitBuy() {
    const acc = { ...this.formBuy.value };

    this.dataSourceBuy = new MatTableDataSource<any>(this.ELEMENT_DATA_BUY);

    const repeat = this.ELEMENT_DATA_BUY.find(r => r.accion === acc.accion);
    const rep = false
    if (repeat) {
      // repeat.precio = repeat.precio + Number(acc.precio);
      repeat.titulos += Number(acc.titulos);
      // repeat.precioPromedio = Number(repeat.precio) / Number(repeat.titulos)
      const precioTotal = acc.precio * acc.titulos
      console.log((precioTotal + repeat.total) / repeat.titulos);
      repeat.precio = (precioTotal + repeat.total) / repeat.titulos;
      // const comisionTotal = (repeat.comision / 100) * precioTotal
      // const ivaTotal = (repeat.iva / 100) * comisionTotal
      // repeat.iva = ivaTotal
      // repeat.comision = comisionTotal
      repeat.total = repeat.total + precioTotal
    } else {
      acc.precio = Number(acc.precio);
      acc.titulos = Number(acc.titulos);
      acc.precioTotal = this.formBuy.controls.precio.value * this.formBuy.controls.titulos.value
      // acc.comisionTotal = (this.formBuy.controls.comision.value / 100) * acc.precioTotal
      // acc.ivaTotal = (this.formBuy.controls.iva.value / 100) * acc.comisionTotal
      acc.total = acc.precioTotal // + acc.comisionTotal + acc.ivaTotal
      this.ELEMENT_DATA_BUY.push(acc);
    }
  }

  submitSell() {

    const acc = { ...this.formSell.value };
    console.log(acc);


    this.dataSourceSell = new MatTableDataSource<any>(this.ELEMENT_DATA_SELL);

    const repeat = this.ELEMENT_DATA_SELL.find(r => r.accion === acc.accion);

    if (repeat) {
      repeat.precio = repeat.precio + Number(acc.precio);
      repeat.titulos += Number(acc.titulos);
    } else {
      for (var i = 0; i < this.ELEMENT_DATA_BUY.length; i++) {
        if (this.ELEMENT_DATA_BUY[i].accion == this.formSell.controls.accion.value) {
          acc.precio = Number(acc.precio);
          acc.titulos = Number(acc.titulos);
          acc.total = (acc.precio * acc.titulos) - (acc.titulos * this.ELEMENT_DATA_BUY[i].precio)
          this.ELEMENT_DATA_BUY[i].titulos = this.ELEMENT_DATA_BUY[i].titulos - acc.titulos
          this.ELEMENT_DATA_BUY[i].total = this.ELEMENT_DATA_BUY[i].total - (acc.precio * acc.titulos)
          this.ELEMENT_DATA_SELL.push(acc);
        }
      }
    }

    if (this.ELEMENT_DATA_BUY.length < 1) {
      this.error = true
    }
    else {
      console.log(this.ELEMENT_DATA_BUY);
      this.error = false
    }
  }

  submitForward(){
    this.dataSourceForward = new MatTableDataSource<any>(this.ELEMENT_DATA_FORWARD);

    const acc = { ...this.formForward.value };
    this.tc1 =  this.formForward.controls.tc1.value
    this.tc2 = this.formForward.controls.tc2.value
    const valor1 = this.formForward.controls.precioAdelantado.value - this.formForward.controls.tc1.value
    const valor2 = this.formForward.controls.precioAdelantado.value - this.formForward.controls.tc2.value
    this.total1 = valor1 * this.formForward.controls.monto.value
    this.total2 = valor2 * this.formForward.controls.monto.value
    
    this.ELEMENT_DATA_FORWARD.push(acc);
  }

  buyAc() {
    this.buy = true
    this.sell = false
  }

  sellAc() {
    this.sell = true
    this.buy = false
  }


}
