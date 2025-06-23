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
  comments: { text: string; createdAt: string }[];  
  newComment?: string; 
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

  searchTerm = '';

  get filteredPosts(): ForumPost[] {
  if (!this.searchTerm.trim()) return this.posts;
  const lower = this.searchTerm.toLowerCase();

  return this.posts.filter(post =>
    post.title.toLowerCase().includes(lower) ||
    post.tags.some(tag => tag.toLowerCase().includes(lower))
  );
}

  getFullImageUrl(path: string): string {
    return `http://localhost:3000${path}`;
  }

  ngOnInit() {
  fetch('http://localhost:3000/api/posts')
    .then(res => res.json())
    .then(data => {
      this.posts = data.reverse().map((p: ForumPost) => ({
        ...p,
        newComment: ''  // für das Input-Feld im Template
      }));
    })
    .catch(err => {
      console.error('Fehler beim Laden:', err);
      this.error = true;
    });
}

    async likePost(postId: number) {
      const res = await fetch(`http://localhost:3000/api/posts/like/${postId}`, {
        method: 'POST'
      });
      if (res.ok) this.ngOnInit();
    }

    submitComment(postId: number, commentText: string) {
  const newComment = {
    text: commentText,
    createdAt: new Date().toISOString()
  };

  fetch(`http://localhost:3000/api/posts/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment)
  })
    .then(res => res.json())
    .then(updatedPost => {
      // Kommentarliste aktualisieren (lokal)
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.comments.push(newComment);
        post.newComment = '';
      }
    })
    .catch(err => console.error('❌ Kommentarfehler:', err));
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