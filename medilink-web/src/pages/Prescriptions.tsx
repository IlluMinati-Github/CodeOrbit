import Sidebar from "@/components/Sidebar";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Prescriptions = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 md:ml-64 pt-16 md:pt-6">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Prescriptions</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">Upload and manage your medical prescriptions</p>
          </div>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Upload Prescription</CardTitle>
              <CardDescription>Upload an image of your prescription for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-[13px] p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your prescription or click to browse
                </p>
                <Button className="btn-primary">Choose File</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>View your uploaded prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-[13px] bg-muted/50">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">Dr. Smith - General Checkup</h3>
                    <p className="text-sm text-muted-foreground">Uploaded 2 days ago</p>
                  </div>
                  <Button variant="outline" className="rounded-[13px]">View</Button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-[13px] bg-muted/50">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium">Dr. Johnson - Cardiology</h3>
                    <p className="text-sm text-muted-foreground">Uploaded 1 week ago</p>
                  </div>
                  <Button variant="outline" className="rounded-[13px]">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Prescriptions;
