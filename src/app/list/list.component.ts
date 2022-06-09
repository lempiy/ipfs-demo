import { Component, OnInit } from '@angular/core';
import { UploadsService } from '../uploads.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  constructor(public uploadService: UploadsService) { }

  ngOnInit(): void {
    this.uploadService.updateList().subscribe(() => {});
  }
}
