import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  CheckCircle
} from 'lucide-react';

const SchedulerPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheduler</h1>
          <p className="text-muted-foreground">Automated task scheduling and job management</p>
        </div>
        
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Calendar className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Play className="w-4 h-4" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
            <div className="text-xs text-muted-foreground">Running</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduled Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">15</div>
            <div className="text-xs text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">42</div>
            <div className="text-xs text-muted-foreground">Successful</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Failed Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <div className="text-xs text-muted-foreground">Need review</div>
          </CardContent>
        </Card>
      </div>

      {/* Development Notice */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Advanced Scheduler</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            This advanced scheduling module is being developed to provide comprehensive task automation, 
            job management, and workflow orchestration for your banking security infrastructure.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="p-4 bg-muted/30 rounded-lg">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Cron Scheduling</h3>
              <p className="text-sm text-muted-foreground">Advanced cron-based scheduling with flexible timing options</p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <BarChart3 className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Job Monitoring</h3>
              <p className="text-sm text-muted-foreground">Real-time job status monitoring and performance analytics</p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <Settings className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Workflow Engine</h3>
              <p className="text-sm text-muted-foreground">Create complex workflows with conditional logic and dependencies</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg max-w-2xl mx-auto">
            <h4 className="font-semibold text-foreground mb-2">Planned Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Automated security scans and compliance checks</li>
              <li>• Device health monitoring and maintenance tasks</li>
              <li>• Report generation and distribution</li>
              <li>• Backup and data synchronization jobs</li>
              <li>• Alert escalation and notification workflows</li>
            </ul>
          </div>
          
          <Badge className="mt-8 bg-primary/10 text-primary border-primary/20">
            In Development - Expected Release: Q3 2024
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulerPage;