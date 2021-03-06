import { Component, OnInit } from '@angular/core';
import { Ancillary } from '../../models/ancillary.model';
import { AncillaryService } from '../../service/ancillary.service';

@Component({
  selector: 'app-ancillary',
  templateUrl: './ancillary.component.html',
  styleUrls: ['./ancillary.component.scss'],
})
export class AncillaryComponent implements OnInit {
  displayDialog: boolean;

  ancillary: Ancillary = {};

  selectedAncillary: Ancillary;

  newAncillary: boolean;

  ancillaries: Ancillary[];

  cols: any[];

  constructor(private ancillaryService: AncillaryService) {}

  ngOnInit(): void {
    this.ancillaryService.getAllAncillaries().subscribe((ancillaries) => {
      this.ancillaries = ancillaries;
    });
    this.cols = [
      { field: 'id', header: 'Service ID' },
      { field: 'serviceName', header: 'Service Name' },
      { field: 'charge', header: 'Charge' },
    ];
  }

  showDialogToAdd() {
    this.newAncillary = true;
    this.ancillary = {};
    this.displayDialog = true;
  }

  save() {
    const ancillaries = [...this.ancillaries];
    if (this.newAncillary) {
      if (this.newAncillary) {
        this.ancillaryService
          .saveAncillary(this.ancillary)
          .subscribe((ancillary) => {
            ancillaries.push(ancillary);
          });
      }
    } else {
      this.ancillaryService
        .editAncillary(this.ancillary)
        .subscribe((ancillary) => {
          ancillaries[
            this.ancillaries.indexOf(this.selectedAncillary)
          ] = ancillary;
        });
    }

    this.ancillaries = ancillaries;
    this.ancillary = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.ancillaries.indexOf(this.selectedAncillary);
    this.ancillaries = this.ancillaries.filter((val, i) => i !== index);
    this.ancillaryService.deleteAncillary(this.ancillary).subscribe();

    this.ancillary = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newAncillary = false;
    this.ancillary = this.cloneSeat(event.data);
    this.displayDialog = true;
  }

  cloneSeat(p: Ancillary): Ancillary {
    const ancillary = {};
    // tslint:disable-next-line: forin
    for (const prop in p) {
      ancillary[prop] = p[prop];
    }
    return ancillary;
  }
}
