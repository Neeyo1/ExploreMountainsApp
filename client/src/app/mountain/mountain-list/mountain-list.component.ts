import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MountainService } from '../../_services/mountain.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mountain-list',
  standalone: true,
  imports: [FormsModule, RouterLink, PaginationModule],
  templateUrl: './mountain-list.component.html',
  styleUrl: './mountain-list.component.css'
})
export class MountainListComponent implements OnInit, OnDestroy{
  mountainService = inject(MountainService);
  accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private offcanvasService = inject(NgbOffcanvas);
  statusList = [
    {value: 'climbed', display: 'Climbed'},
    {value: 'not-climbed', display: 'Not climbed'},
    {value: 'all', display: 'All'}
  ];
  orderByList = [
    {value: 'highest', display: 'Highest'},
    {value: 'shortest', display: 'Shortest'}
  ];

  ngOnInit(): void {
    this.loadMountains();
  }

  ngOnDestroy(): void {
    this.mountainService.paginatedResult.set(null);
  }

  loadMountains(){
    this.mountainService.getMountains();
  }

  createMountain(){
    this.toastrService.info("Modal create mountain");
  }

  resetFilters(){
    this.mountainService.resetMountainParams();
    this.loadMountains();
  }

  pageChanged(event: any){
    if (this.mountainService.mountainParams().pageNumber != event.page){
      this.mountainService.mountainParams().pageNumber = event.page;
      this.loadMountains();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content);
	}

  closeOffcanvas(offcanvas: any){
    offcanvas.close();
  }
}
