import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { uploadFile, UploadsService } from '../uploads.service';

enum Status {
  pick = 'pick',
  loading = 'loading',
  waitReady = 'waitReady',
  transcoding = 'transcoding',
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass']
})
export class AddComponent implements OnInit {
  filename: string | undefined;
  status: Status = Status.pick;
  value: number = 0;
  text = '1';

  constructor(public uploadService: UploadsService, private router: Router) { }

  ngOnInit(): void {
  }

  async onFileSelected(event: Event) {
    const file:File = (<HTMLInputElement>event.target).files![0];
    if (file) {
        this.filename = file.name;
        this.value = 0;
        setTimeout(() => {
          this.onLoading();
        })
        const asset = await uploadFile(file, (total: number, sent: number) => this.onProgressCallback(total, sent), () => {
          this.status = Status.waitReady;
        }, () => {
          this.status = Status.transcoding;
        })
        this.router.navigate([asset.id])
    }
  }

  onLoading() {
    this.status = Status.loading;
  }

  onProgressCallback(total: number, sent: number) {
    this.value = Math.floor(sent / total * 100);
  }
}
