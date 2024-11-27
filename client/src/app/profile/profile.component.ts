import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { MemberDetailed } from '../_models/memberDetailed';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TabsModule, PaginationModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy{
  memberService = inject(MemberService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  accountService = inject(AccountService);
  member = signal<MemberDetailed | null>(null)
  orderByList = [
    {value: 'most-recent', display: 'Most recent'},
    {value: 'most-latest', display: 'Most latest'}
  ];

  ngOnInit(): void {
    this.loadMember();
  }

  ngOnDestroy(): void {
    this.memberService.resetMemberParams();
    this.memberService.paginatedResultMountain.set(null);
  }

  loadMember(){
    const memberId = Number(this.route.snapshot.paramMap.get("id"));
    if (!memberId) this.router.navigateByUrl("/not-found");

    this.memberService.getMember(memberId).subscribe({
      next: member => this.member.set(member),
      error: _ => this.router.navigateByUrl("/")
    })
  }

  editProfile(){
    this.toastrService.info("Modal edit profile");
  }

  loadMountainsClimbedByMember(){
    const newParams = this.memberService.memberParams();
    newParams.knownAs = this.member()!.knownAs;
    this.memberService.memberParams.set(newParams)
    this.memberService.getMountainsClimbedByMember();
  }

  resetFilters(){
    this.memberService.resetMemberParams();
    this.loadMountainsClimbedByMember();
  }

  pageChanged(event: any){
    if (this.memberService.memberParams().pageNumber != event.page){
      this.memberService.memberParams().pageNumber = event.page;
      this.loadMountainsClimbedByMember();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
