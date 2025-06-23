import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getBadges, Badge } from './badges.module';
import { HttpClient, HttpClientModule  } from '@angular/common/http';

interface UserStats {
  name: string;
  points: number;
}

@Component({
  standalone: true, 
  selector: 'app-gamification',
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './gamification.html',
  styleUrls: ['./gamification.css']
})
export class GamificationComponent implements OnInit {
  // Beispielwerte – kannst du später dynamisch laden
  totalPoints = 30;
  currentLevel!: number;
  nextLevel!: number;
  progressPercent!: number;
  pointsToNextLevel!: number;

  badges: Badge[] = [];
  leaderboard: UserStats[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.calculateLevelData();
    this.badges = getBadges(this.currentLevel);
    this.loadLeaderboard();
  }

  private calculateLevelData(): void {
    // einfache Level-Logik: z.B. pro 50 XP ein Level
    this.currentLevel = Math.floor(this.totalPoints / 50) + 1;
    this.nextLevel = this.currentLevel + 1;
    const ptsForCurrentLevel = (this.currentLevel - 1) * 50;
    const ptsForNextLevel = this.currentLevel * 50;
    this.pointsToNextLevel = ptsForNextLevel - this.totalPoints;
    this.progressPercent = Math.round(
      ((this.totalPoints - ptsForCurrentLevel) / (ptsForNextLevel - ptsForCurrentLevel)) * 100
    );
  }

  private loadLeaderboard(): void {
    this.http
      .get<UserStats[]>('/api/gamification/leaderboard')
      .subscribe({
        next: (users) => (this.leaderboard = users.sort((a, b) => b.points - a.points)),
        error: (err) => console.error('🔴 Fehler beim Laden der Rangliste:', err),
      });
  }
}
