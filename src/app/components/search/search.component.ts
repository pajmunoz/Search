import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

interface ParentItem {
  parent: string;
  items: { name: string; link: string }[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgFor,
    AsyncPipe,
  ],
})
export class SearchComponent {
  myControl = new FormControl();
  options: ParentItem[] = [];
  filteredOptions: Observable<ParentItem[]>;

  constructor(private http: HttpClient) {
    this.fetchData();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): ParentItem[] {
    const filterValue = value.toLowerCase();
    return this.options.map(option => ({
      parent: option.parent,
      items: option.items.filter(item => item.name.toLowerCase().includes(filterValue))
    })).filter(option => option.items.length > 0);
  }

  fetchData() {
    this.http.get<ParentItem[]>('assets/data.json').subscribe(data => {
      this.options = data;
    });
  }
}
