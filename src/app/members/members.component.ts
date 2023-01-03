import { Component } from '@angular/core';
import { LoadDataService } from '../services/load-data.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent {
  members: any
  constructor(private loadData: LoadDataService){}

  ngOnInit():void {
    this.loadData.getMembers().subscribe((data: any) => {
      this.members = Object.keys(data).map((id) => {
        let foo = data[id].ParliamentaryName.split(',')
        let surname = foo[0].trim()
        let name = foo[1].trim()
        data[id]['Name'] = name
        data[id]['Surname'] = surname
        if(data[id]['PhotoURL'] == "")
          data[id]['PhotoURL'] = 'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg'

        return data[id]
      })
      console.log(this.members)
    })
  }
}

