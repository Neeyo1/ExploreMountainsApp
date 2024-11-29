import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { RouterLink } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MountainService } from '../_services/mountain.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AlertModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  memberService = inject(MemberService);
  mountainService = inject(MountainService);
  accountService = inject(AccountService);

  ngOnInit(): void {
    if (this.accountService.currentUser()){
      this.loadLastMountains();
    }
  }

  ngOnDestroy(): void {
    this.memberService.resetMemberParams();
    this.mountainService.paginatedResult.set(null);
  }

  loadLastMountains(){
    const newParams = this.memberService.memberParams();
    newParams.pageNumber = 1;
    newParams.pageSize = 5;
    console.log(this.accountService.currentUser()?.knownAs);
    if (this.accountService.currentUser()){
      newParams.knownAs = this.accountService.currentUser()!.knownAs;
    }
    newParams.orderBy = "most-recent";
    this.memberService.memberParams.set(newParams);

    this.mountainService.getMountainsClimbedByMember();
  }
}
