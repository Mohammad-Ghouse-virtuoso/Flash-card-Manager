import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Clock, FileText, Plus, CheckCircle, Trophy } from "lucide-react";

export default function ProgressPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  }) as { data: { streak: number; cardsStudiedToday: number; accuracy: number; timeSpent: number; totalCards: number } | undefined; isLoading: boolean };

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/study-sessions"],
  }) as { data: any[] };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    // Show actual minutes studied, minimum 1 minute for any activity
    return `${Math.max(1, minutes)}m`;
  };

  // Get recent activities (last 10 sessions)
  const recentSessions = sessions
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Progress</h2>
        <p className="text-slate-600">Track your learning journey and achievements</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalCards || 0}</p>
                <p className="text-sm text-slate-600">Total Cards</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" fill="currentColor" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats?.streak || 0}</p>
                <p className="text-sm text-slate-600">Day Streak</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" fill="currentColor" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats?.accuracy || 0}%</p>
                <p className="text-sm text-slate-600">Mastery Rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" fill="currentColor" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {formatTime(stats?.timeSpent || 0)}
                </p>
                <p className="text-sm text-slate-600">Study Time</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" fill="currentColor" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Study Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-500">
                <div className="text-3xl mb-2">📊</div>
                <p>7-day study activity chart</p>
                <p className="text-sm">(Chart implementation coming soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accuracy Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-500">
                <div className="text-3xl mb-2">📈</div>
                <p>Accuracy over time chart</p>
                <p className="text-sm">(Chart implementation coming soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-400 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No activity yet</h3>
              <p className="text-slate-600">Start studying to see your progress here!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentSessions.map((session: any) => {
                const accuracy = session.cardsStudied > 0 
                  ? Math.round((session.correctAnswers / session.cardsStudied) * 100) 
                  : 0;
                
                const timeAgo = new Date(session.createdAt).toLocaleDateString();
                
                return (
                  <div key={session.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Completed study session
                        </p>
                        <p className="text-sm text-slate-600">
                          {session.cardsStudied} cards studied • {accuracy}% accuracy • {formatTime(session.timeSpent || 60)} spent
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">{timeAgo}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
