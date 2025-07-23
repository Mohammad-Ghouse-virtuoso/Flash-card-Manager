export type Difficulty = 'Hard' | 'Medium' | 'Easy';

export function calculateNextReviewDate(difficulty: Difficulty, currentInterval: number = 1): Date {
  const now = new Date();
  let daysToAdd: number;

  switch (difficulty) {
    case 'Hard':
      daysToAdd = 1; // Review tomorrow
      break;
    case 'Medium':
      daysToAdd = 2; // Review in 2 days
      break;
    case 'Easy':
      daysToAdd = 4; // Review in 4 days
      break;
    default:
      daysToAdd = 1;
  }

  // For subsequent reviews, we can implement more sophisticated spacing
  // For now, we use the basic intervals as specified
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + daysToAdd);
  nextReview.setHours(9, 0, 0, 0); // Set to 9 AM for consistency
  
  return nextReview;
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'Hard':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'Easy':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'text-blue-600 bg-blue-50';
    case 'due':
      return 'text-secondary bg-secondary/10';
    case 'learning':
      return 'text-amber-600 bg-amber-50';
    case 'mastered':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds % 60}s`;
}
