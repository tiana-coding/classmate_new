import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfileComponent {
  onSubmit(): void {
    console.log('Formular wurde gesendet');
  }
}