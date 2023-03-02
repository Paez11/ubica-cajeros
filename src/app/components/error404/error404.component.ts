import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error404',
  template: `
    <p>
      error404, page not found
    </p>
  `,
  styles: [
  ]
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
