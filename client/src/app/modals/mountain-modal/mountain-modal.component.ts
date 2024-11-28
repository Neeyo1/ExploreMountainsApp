import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Mountain } from '../../_models/mountain';

@Component({
  selector: 'app-mountain-modal',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './mountain-modal.component.html',
  styleUrl: './mountain-modal.component.css'
})
export class MountainModalComponent implements OnInit{
  bsModalRef = inject(BsModalRef);
  completed = false;
  mountain?: Mountain;
  private fb = inject(FormBuilder);
  mountainForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.mountainForm = this.fb.group({
      name: [this.mountain?.name == null ? '' : this.mountain.name, [Validators.required]],
      description: [this.mountain?.description == null ? '' : this.mountain.description, [Validators.required]],
      height: [this.mountain?.height == null ? '' : this.mountain?.height, [Validators.required]],
      latitude: [this.mountain?.latitude == null ? '' : this.mountain.latitude, [Validators.required]],
      longitude: [this.mountain?.longitude == null ? '' : this.mountain.longitude, [Validators.required]]
    })
  }

  complete(){
    this.completed = true;
    this.bsModalRef.hide();
  }
}
