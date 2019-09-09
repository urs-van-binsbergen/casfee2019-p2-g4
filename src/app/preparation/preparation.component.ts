import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {
  title = 'Preparation';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  onGoClicked() {
    this.router.navigateByUrl('/hall');
  }
}
