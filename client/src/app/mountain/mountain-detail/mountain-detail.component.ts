import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MountainService } from '../../_services/mountain.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { Mountain } from '../../_models/mountain';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberService } from '../../_services/member.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-mountain-detail',
  standalone: true,
  imports: [TabsModule, FormsModule, PaginationModule, RouterLink, GoogleMapsModule],
  templateUrl: './mountain-detail.component.html',
  styleUrl: './mountain-detail.component.css'
})
export class MountainDetailComponent implements OnInit, OnDestroy{
  private mountainService = inject(MountainService);
  memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  mountain = signal<Mountain | null>(null);
  orderByList = [
    {value: 'most-recent', display: 'Most recent'},
    {value: 'most-latest', display: 'Most latest'}
  ];

  ngOnInit(): void {
    this.loadMountain();
  }

  ngOnDestroy(): void {
    this.memberService.resetMemberParams();
    this.memberService.paginatedResult.set(null);
  }

  loadMountain(){
    const mountainId = Number(this.route.snapshot.paramMap.get("id"));
    if (!mountainId) this.router.navigateByUrl("/not-found");;

    this.mountainService.getMountain(mountainId).subscribe({
      next: mountain => this.mountain.set(mountain)
    })
  }

  markMountainAsClimbed(mountainId: number){
    this.mountainService.markMountainAsClimbed(mountainId).subscribe({
      next: _ => this.loadMountain()
    })
  }

  unmarkMountainAsClimbed(mountainId: number){
    this.mountainService.unmarkMountainAsClimbed(mountainId).subscribe({
      next: _ => this.loadMountain()
    })
  }

  loadMembersWhoClimbedMountain(){
    const newParams = this.memberService.memberParams();
    newParams.mountainId = this.mountain()!.id;
    this.memberService.memberParams.set(newParams)
    this.memberService.getMembersWhoClimbedMountain();
  }

  resetFilters(){
    this.memberService.resetMemberParams();
    this.loadMembersWhoClimbedMountain();
  }

  pageChanged(event: any){
    if (this.memberService.memberParams().pageNumber != event.page){
      this.memberService.memberParams().pageNumber = event.page;
      this.loadMembersWhoClimbedMountain();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
