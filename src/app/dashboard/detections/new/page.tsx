import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DetectionForm from '@/components/detections/detection-form';


export default function NewDetectionPage() {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/detections">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Log a New Detection
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Detection Details</CardTitle>
                    <CardDescription>
                        Fill out the form below to report a new detection.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DetectionForm />
                </CardContent>
            </Card>
        </div>
    )
}
