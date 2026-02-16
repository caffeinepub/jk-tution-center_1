import { useGetResultsByStudent } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Award, Calendar } from 'lucide-react';
import { useGetAllCourses } from '../../hooks/useQueries';

export default function ResultsPanel() {
  const { identity } = useInternetIdentity();
  const { data: results, isLoading } = useGetResultsByStudent(identity?.getPrincipal() || null);
  const { data: courses = [] } = useGetAllCourses();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getCourseName = (courseId: bigint) => {
    const course = courses.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </CardContent>
      </Card>
    );
  }

  const hasResults = results && (results.testResults.length > 0 || results.dailyResults.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Your Results</h2>
      </div>

      {!hasResults ? (
        <Card className="bg-card border-border rounded-lg shadow-md">
          <CardContent className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
            <p className="text-muted-foreground">Your test and daily results will appear here once posted by your instructor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {results.testResults.length > 0 && (
            <Card className="bg-card border-border rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.testResults.map((result) => (
                  <div key={result.id.toString()} className="border-b border-border pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-lg">{getCourseName(result.courseId)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{formatDate(result.date)}</p>
                        </div>
                      </div>
                      <Badge variant={result.pass ? 'default' : 'destructive'}>
                        {result.pass ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 my-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold">{result.score.toString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="text-2xl font-bold">{result.grade}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Feedback</p>
                      <p className="text-sm">{result.feedback}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {results.dailyResults.length > 0 && (
            <Card className="bg-card border-border rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Daily Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.dailyResults.map((result, idx) => (
                  <div key={idx} className="border-b border-border pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{getCourseName(result.courseId)}</p>
                        <p className="text-sm text-muted-foreground">{result.resultType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{result.score.toString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(result.date)}</span>
                    </div>
                    {result.remarks && (
                      <p className="text-sm mt-2 bg-muted p-2 rounded">{result.remarks}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
