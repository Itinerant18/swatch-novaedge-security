import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Settings
} from 'lucide-react';

const OTAUpdatesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">OTA Updates</h1>
          <p className="text-muted-foreground">Over-the-air software updates management</p>
        </div>
        
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Upload className="w-4 h-4 mr-2" />
          Upload Update Package
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Successfully Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">24</div>
            <div className="text-xs text-muted-foreground">This week</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-xs text-muted-foreground">Scheduled</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Failed Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <div className="text-xs text-muted-foreground">Requires attention</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Download className="w-4 h-4" />
              Total Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Development Notice */}
      <Card className="shadow-card border-0 bg-gradient-card">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">OTA Updates Module</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            This module is currently under development. It will provide comprehensive over-the-air update 
            management for all connected devices including ATMs, POS terminals, and security systems.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="p-4 bg-muted/30 rounded-lg">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Automated Updates</h3>
              <p className="text-sm text-muted-foreground">Schedule and deploy updates automatically across all devices</p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <Download className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Package Management</h3>
              <p className="text-sm text-muted-foreground">Upload, version, and distribute update packages securely</p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <AlertCircle className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-2">Rollback Support</h3>
              <p className="text-sm text-muted-foreground">Automatic rollback in case of update failures</p>
            </div>
          </div>
          
          <Badge className="mt-8 bg-primary/10 text-primary border-primary/20">
            Coming Soon - Expected Release: Q2 2024
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTAUpdatesPage;