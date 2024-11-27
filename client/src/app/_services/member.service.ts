import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { MemberParams } from '../_models/memberParams';

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

    if (response) return this.setPaginatedResponse(response);
    let params = this.setPaginationHeaders(this.memberParams().pageNumber, this.memberParams().pageSize)

    params = params.append("mountainId", this.memberParams().mountainId);
    params = params.append("knownAs", this.memberParams().knownAs as string);
    params = params.append("orderBy", this.memberParams().orderBy as string);

    return this.http.get<Member[]>(this.baseUrl + `mountains/${this.memberParams().mountainId}/climbedBy`, {observe: 'response', params}).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.memberCache.set(Object.values(this.memberParams()).join("-"), response);
      }
    });
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();

    if (pageNumber && pageSize){
      params = params.append("pageNumber", pageNumber);
      params = params.append("pageSize", pageSize);
    }

    return params;
  }

  private setPaginatedResponse(response: HttpResponse<Member[]>){
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get("pagination")!)
    })
  }
}

