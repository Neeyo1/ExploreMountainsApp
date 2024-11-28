import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { AccountService } from './account.service';
import { ToastrService } from 'ngx-toastr';
import { MountainService } from './mountain.service';
import { MountainModalComponent } from '../modals/mountain-modal/mountain-modal.component';
import { Mountain } from '../_models/mountain';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private mountainService = inject(MountainService);

  openCreateMountainModal(){
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false
      }
    };
    this.bsModalRef = this.modalService.show(MountainModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let mountainForm = this.bsModalRef.content.mountainForm;
          this.mountainService.createMountain(mountainForm.value).subscribe({
            next: _ => this.mountainService.getMountains()
          })
        }
      }
    })
  }

  openEditOfficeModal(mountain: Mountain){
    if (mountain == null) return;
    const config: ModalOptions = {
      class: 'modal-lg',
      initialState:{
        completed: false,
        mountain: mountain
      }
    };
    this.bsModalRef = this.modalService.show(MountainModalComponent, config);
    return this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.completed){
          let mountainForm = this.bsModalRef.content.mountainForm;
          this.mountainService.editMountain(mountain.id, mountainForm.value).subscribe({
            next: _ => this.mountainService.getMountains()
          })
        }
      }
    })
  }
}
