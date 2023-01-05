import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadDataService } from 'src/app/services/load-data.service';
import { Observable } from "rxjs"

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit{
  members: any

  constructor(private route: ActivatedRoute, private dataLoader:LoadDataService){}

  ngOnInit():void {
    //console.log("Members")

    this.dataLoader.getMembers().subscribe((data:any) => {
      this.members = data
    })
  }
}

      /*
      //Adding the deafult profile image
      for(let i = 0; i < this.members.length; i++)
        if(this.members[i]['PhotoURL'] == "")
          this.members[i]['PhotoURL'] = '/assets/img/default-avatar-profile.png'
      */
