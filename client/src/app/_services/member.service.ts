import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { MemberParams } from '../_models/memberParams';
import { Mountain } from '../_models/mountain';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { MemberDetailed } from '../_models/memberDetailed';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  memberCache = new Map();
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberParams = signal<MemberParams>(new MemberParams);

  resetMemberParams(){
    this.memberParams.set(new MemberParams);
  }

  getMembersWhoClimbedMountain(){
    const response = this.memberCache.get(Object.values(this.memberParams()).join('-'));

    if (response) return setPaginatedResponse(response, this.paginatedResult);
    let params = setPaginationHeaders(this.memberParams().pageNumber, this.memberParams().pageSize)

    params = params.append("mountainId", this.memberParams().mountainId);
    params = params.append("knownAs", this.memberParams().knownAs as string);
    params = params.append("orderBy", this.memberParams().orderBy as string);

    return this.http.get<Member[]>(this.baseUrl + "mountains/members-who-climbed-mountain", {observe: 'response', params}).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.memberParams()).join("-"), response);
      }
    });
  }

  getMember(id: number){
    const member = this.memberCache.get("member-detailed-" + id);

    if (member) return of(member);
    
    return this.http.get<MemberDetailed>(this.baseUrl + `users/${id}`).pipe(
        tap(response => {
            this.memberCache.set("member-detailed-" + id, response);
        })
    )
  }
}

