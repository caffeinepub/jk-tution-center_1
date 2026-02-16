import { useState } from 'react';
import { useGetAllStudentProfiles, useGetAllCourses, useGetResultsByStudent, useCreateTestResult, usePostDailyResult } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

export default function ResultsPanel() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  // Test Result Form
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [pass, setPass] = useState(true);
  const [feedback, setFeedback] = useState('');
  
  // Daily Result Form
  const [dailyResultType, setDailyResultType] = useState('');
  const [dailyScore, setDailyScore] = useState('');
  const [dailyRemarks, setDailyRemarks] = useState('');

  const { data: students = [] } = useGetAllStudentProfiles();
  const { data: courses = [] } = useGetAllCourses();
  const { data: results } = useGetResultsByStudent(
    selectedStudent ? Principal.fromText(selectedStudent) : null
  );

  const createTestResult = useCreateTestResult();
  const postDailyResult = usePostDailyResult();

  const handleCreateTestResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse || !score || !grade || !feedback) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTestResult.mutateAsync({
        student: Principal.fromText(selectedStudent),
        courseId: BigInt(selectedCourse),
        score: BigInt(score),
        grade,
        pass,
        feedback,
        date: BigInt(Date.now() * 1000000),
      });
      toast.success('Test result created successfully!');
      setScore('');
      setGrade('');
      setPass(true);
      setFeedback('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create test result');
    }
  };

  const handlePostDailyResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse || !dailyResultType || !dailyScore) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await postDailyResult.mutateAsync({
        student: Principal.fromText(selectedStudent),
        courseId: BigInt(selectedCourse),
        date: BigInt(Date.now() * 1000000),
        resultType: dailyResultType,
        score: BigInt(dailyScore),
        remarks: dailyRemarks,
      });
      toast.success('Daily result posted successfully!');
      setDailyResultType('');
      setDailyScore('');
      setDailyRemarks('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post daily result');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Results Management</h2>
      </div>

      <Card className="bg-card border-border rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Select Student & Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Student</Label>
            <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map(([principal, profile]) => (
                  <SelectItem key={principal.toString()} value={principal.toString()}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id.toString()} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && selectedCourse && (
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted p-1 rounded-lg">
            <TabsTrigger value="create" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Create Results
            </TabsTrigger>
            <TabsTrigger value="view" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              View Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card className="bg-card border-border rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Test Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTestResult} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        type="number"
                        min="0"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="e.g., 85"
                      />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="e.g., A, B+, etc."
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pass" checked={pass} onCheckedChange={setPass} />
                    <Label htmlFor="pass">Pass</Label>
                  </div>
                  <div>
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Enter detailed feedback..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={createTestResult.isPending} className="w-full">
                    {createTestResult.isPending ? 'Creating...' : 'Create Test Result'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-card border-border rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post Daily Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostDailyResult} className="space-y-4">
                  <div>
                    <Label htmlFor="resultType">Result Type</Label>
                    <Input
                      id="resultType"
                      value={dailyResultType}
                      onChange={(e) => setDailyResultType(e.target.value)}
                      placeholder="e.g., Quiz, Homework, Practice"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyScore">Score</Label>
                    <Input
                      id="dailyScore"
                      type="number"
                      min="0"
                      value={dailyScore}
                      onChange={(e) => setDailyScore(e.target.value)}
                      placeholder="e.g., 90"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyRemarks">Remarks (Optional)</Label>
                    <Textarea
                      id="dailyRemarks"
                      value={dailyRemarks}
                      onChange={(e) => setDailyRemarks(e.target.value)}
                      placeholder="Additional notes..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={postDailyResult.isPending} className="w-full">
                    {postDailyResult.isPending ? 'Posting...' : 'Post Daily Result'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            {results && (
              <>
                {results.testResults.length > 0 && (
                  <Card className="bg-card border-border rounded-lg shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Test Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.testResults.map((result) => (
                        <div key={result.id.toString()} className="border-b border-border pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Score: {result.score.toString()} | Grade: {result.grade}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(result.date)}</p>
                            </div>
                            <span className={`text-sm font-medium ${result.pass ? 'text-green-600' : 'text-red-600'}`}>
                              {result.pass ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                          <p className="text-sm">{result.feedback}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {results.dailyResults.length > 0 && (
                  <Card className="bg-card border-border rounded-lg shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Daily Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.dailyResults.map((result, idx) => (
                        <div key={idx} className="border-b border-border pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{result.resultType} - Score: {result.score.toString()}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(result.date)}</p>
                            </div>
                          </div>
                          {result.remarks && <p className="text-sm">{result.remarks}</p>}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {results.testResults.length === 0 && results.dailyResults.length === 0 && (
                  <Card className="bg-card border-border rounded-lg shadow-md">
                    <CardContent className="text-center py-12">
                      <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No results found for this student and course</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
