import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadDataService } from 'src/app/services/load-data.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit{
  member: any

  constructor(private route: ActivatedRoute, private dataLoader:LoadDataService){}

  ngOnInit(): void{
    let id = +(this.route.snapshot.paramMap.get('id') ?? 0)
    console.log("PersonDetail:" , id)

    this.dataLoader.getMemberFullData(id).subscribe((member:any) => {
      this.member = member
    })
  }
}

/*
columns = [
{
  columnDef: 'name',
  header: 'Name',
  cell: (element: any) => `${element.ActualName}`,
},
{
  columnDef: 'abbreviation',
  header: 'Abbreviation',
  cell: (element: any) => `${element.Abbreviation}`,
}
];
displayedColumns = this.columns.map(c => c.columnDef);
*/
