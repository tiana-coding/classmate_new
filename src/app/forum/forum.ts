import { Component } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ForumPost {
  id?: number;
  title: string;
  details: string;
  tags: string[];
  imageUrl: string | null;
  createdAt: string;
  likes: number;
  comments: any[];
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './forum.html',
  styleUrls: ['./forum.css']
})
export class ForumComponent {
  posts: ForumPost[] = [];
  title = '';
  details = '';
  tags = '';
  imageFile: File | null = null;
  submitted = false;
  error = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  getFullImageUrl(path: string): string {
    return `http://localhost:3000${path}`;
  }

  ngOnInit() {
  fetch('http://localhost:3000/api/posts') 
    .then(res => res.json())
    .then(data => this.posts = data.reverse())
    .catch(err => {
      console.error('Fehler beim Laden:', err);
      this.error = true;
    });
}

  async submitPost() {
    let imageUrl = null;
    if (this.imageFile) {
      imageUrl = await this.uploadImage(this.imageFile);
    }


    const payload = {
      title: this.title,
      details: this.details,
      tags: this.tags ? this.tags.split(',').map(tag => tag.trim()) : [],
      imageUrl,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    const res = await fetch('http://localhost:3000/api/posts', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      this.submitted = true;
      this.error = false;
      this.title = '';
      this.details = '';
      this.tags = '';
      this.imageFile = null;
      this.ngOnInit();
    } else {
      this.error = true;
      this.submitted = false;
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

async uploadImage(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    const data = await res.json();
    return data.imageUrl;
  } else {
    console.error('Bild-Upload fehlgeschlagen');
    return null;
  }
}
}