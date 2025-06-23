import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './forum.html',
  styleUrls: ['./forum.css']
})
export class ForumComponent {
  posts: ForumPost[] = [];
  title = '';
  details = '';
  tags = '';
  submitted = false;
  error = false;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => this.posts = data.reverse())
      .catch(err => {
        console.error('Fehler beim Laden der Posts:', err);
        this.error = true;
      });
  }

  async submitPost() {
    const payload: ForumPost = {
      title: this.title,
      details: this.details,
      tags: this.tags.split(',').map(t => t.trim()).filter(t => t),
      imageUrl: null,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    const res = await fetch('/api/posts', {
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
      this.loadPosts();
      (document.getElementById('newQuestionModal') as any)?.classList.remove('show'); 
    } else {
      this.error = true;
    }
  }
}
