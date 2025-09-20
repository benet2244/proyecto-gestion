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
import { Detection } from '@/lib/definitions';


async function getDetection(id: string): Promise<Detection | undefined> {
    const res = await fetch(`http://localhost:9002/api/detections/${id}`, { cache: 'no-store' });
    if (!res.ok) return undefined;
    return res.json();
}


export default async function EditDetectionPage({ params }: { params: { id: string } }) {
    const detection = await getDetection(params.id);

    if (!detection) {
        return <div>Detection not found</div>
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href={`/dashboard/detections`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Edit Detection: {detection.id}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Update Detection Details</CardTitle>
                    <CardDescription>
                        Modify the allowed fields for the detection below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DetectionForm detection={detection} isEditMode={true} />
                </CardContent>
            </Card>
        </div>
    )
}
