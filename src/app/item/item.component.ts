import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UploadsService } from '../uploads.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit {
  public id: string | null = null;
  public gateway: string = window.localStorage.getItem('gateway') || 'https://meshsignaller.net'
  public link: string | null = null;
  constructor(
    private route: ActivatedRoute,
    public uploadService: UploadsService,
  ) {}

  ngOnInit(): void {
    this.uploadService.updateList().pipe(
      switchMap(() => this.route.params),
      map((params: Params) => {
        this.id = params['id'] as string;
        this.uploadService.setItem(this.id);
        this.link = this.uploadService.currentItem!.cid ? this.gateway + '/ipfs/' + this.uploadService.currentItem!.cid : null;
        console.log(this.uploadService.currentItem);
      })
    ).subscribe()
  }

  setGateway() {
    window.localStorage.setItem('gateway', this.gateway);
    this.link = this.uploadService.currentItem!.cid ? this.gateway + '/ipfs/' + this.uploadService.currentItem!.cid : null;
  }
}
