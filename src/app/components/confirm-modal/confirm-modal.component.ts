import { AfterViewInit, Component, OnInit } from '@angular/core';

declare var bootstrap: any;
@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit, AfterViewInit {
  _modalConfirm;
  showModal = false;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this._modalConfirm = new bootstrap.Modal(
      document.getElementById('modalConfirm'),
      {}
    );
  }

  close() {
    this._modalConfirm.hide();
    this.showModal = false;
  }
  open() {
    this._modalConfirm.show();
    this.showModal = true;
  }
}
