import { Component, OnInit } from '@angular/core';

import { FlightService } from '../../flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss'],
})
export class FlightListComponent implements OnInit {
  displayDialog: boolean;

  flight: Flight = {};

  selectedFlight: Flight;

  newFlight: boolean;

  flights: Flight[];

  cols: any[];

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.flightService.getAllFlights().subscribe((flights) => {
      this.flights = flights;
    });

    this.cols = [
      { field: 'id', header: 'Flight No' },
      { field: 'flightName', header: 'Flight Name' },
      { field: 'departureTime', header: 'Departure Time' },
      { field: 'arrivalTime', header: 'Arrival Time' },
      { field: 'source', header: 'Source' },
      { field: 'destination', header: 'Destination' },
      { field: 'details', header: 'Details' },
    ];
  }

  showDialogToAdd() {
    this.newFlight = true;
    this.flight = {};
    this.displayDialog = true;
  }

  save() {
    const flights = [...this.flights];
    if (this.newFlight) {
      if (this.newFlight) {
        this.flightService.saveFlight(this.flight).subscribe((flight) => {
          flights.push(flight);
        });
      }
    } else {
      this.flightService.editFlight(this.flight).subscribe((flight) => {
        flights[this.flights.indexOf(this.selectedFlight)] = flight;
      });
    }


    this.flights = flights;
    this.flight = null;
    this.displayDialog = false;
  }

  delete() {
    const index = this.flights.indexOf(this.selectedFlight);
    this.flights = this.flights.filter((val, i) => i !== index);
    this.flightService.deleteFlight(this.flight).subscribe();

    this.flight = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newFlight = false;
    this.flight = this.cloneCar(event.data);
    this.displayDialog = true;
  }

  cloneCar(c: Flight): Flight {
    const flight = {};
    // tslint:disable-next-line: forin
    for (const prop in c) {
      flight[prop] = c[prop];
    }
    return flight;
  }
}
