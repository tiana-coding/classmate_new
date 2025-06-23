import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent {
  rating = 0;
  feedbackText = '';
  submitted = false;
  error = false;

  async submitFeedback() {
    const payload = {
      rating: this.rating,
      feedbackText: this.feedbackText,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.submitted = true;
        this.rating = 0;
        this.feedbackText = '';
      } else {
        this.error = true;
      }
    } catch (err) {
      this.error = true;
    }
  }
}
