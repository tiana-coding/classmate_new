import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, RouterModule], // ✅ RouterModule hier einfügen
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {}
