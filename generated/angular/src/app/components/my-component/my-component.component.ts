// src/app/components/my-component/my-component.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DataItem } from '../../services/data.service'; // Import the interface

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponentComponent implements OnInit {

  data: DataItem[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData().subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}