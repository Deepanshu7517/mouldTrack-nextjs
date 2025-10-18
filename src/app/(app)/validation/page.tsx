
'use client';

import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ValidationStatus = "success" | "fail" | "pending";

export default function ValidationPage() {
  const mouldQr = PlaceHolderImages.find(img => img.id === 'qr-code-1');
  const machineQr = PlaceHolderImages.find(img => img.id === 'qr-code-2');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("pending");

  const handleScan = () => {
    setValidationStatus(currentStatus => {
      if (currentStatus === 'pending') return 'success';
      if (currentStatus === 'success') return 'fail';
      return 'pending';
    });
  };

  const getStatusContent = () => {
    switch(validationStatus) {
      case 'success':
        return {
          icon: <ThumbsUp className="h-12 w-12 text-green-500" />,
          title: "OK",
          description: "Mould and machine mapping is correct.",
          badge: <Badge variant="default" className="bg-green-500 hover:bg-green-600">Matched</Badge>,
          cardClass: "bg-green-500/10 border-green-500/50"
        };
      case 'fail':
        return {
          icon: <ThumbsDown className="h-12 w-12 text-destructive" />,
          title: "NG (No Go)",
          description: "Incorrect mould-machine pairing.",
          badge: <Badge variant="destructive">Mismatch</Badge>,
          cardClass: "bg-red-500/10 border-destructive/50"
        };
      default: // 'pending'
        return {
          icon: <QrCode className="h-12 w-12 text-muted-foreground" />,
          title: "Pending",
          description: "Scan QR codes to verify.",
          badge: <Badge variant="secondary">Pending</Badge>,
          cardClass: ""
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader 
        title="Mould–Machine Validation" 
        description="Verify correct mould–machine mapping before production starts."
      />
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Scan Mould */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" /> 1. Scan Mould
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {mouldQr && (
              <Image 
                src={mouldQr.imageUrl} 
                alt="Mould QR Code" 
                width={200} 
                height={200}
                data-ai-hint={mouldQr.imageHint}
                className="rounded-lg"
              />
            )}
            <Button className="w-full" onClick={handleScan}>Scan Mould QR</Button>
            <CardDescription>Mould ID: MLD-45B-01</CardDescription>
          </CardContent>
        </Card>

        {/* Scan Machine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" /> 2. Scan Machine
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {machineQr && (
              <Image 
                src={machineQr.imageUrl} 
                alt="Machine QR Code" 
                width={200} 
                height={200}
                data-ai-hint={machineQr.imageHint}
                className="rounded-lg"
              />
            )}
            <Button className="w-full" onClick={handleScan}>Scan Machine QR</Button>
            <CardDescription>Machine ID: MC-002</CardDescription>
          </CardContent>
        </Card>

        {/* Validation Result */}
        <Card className={cn("flex flex-col text-center", statusContent.cardClass)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mx-auto">
              3. Result
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center flex-1 p-6">
              <div className="mb-4">
                  {statusContent.icon}
              </div>
              <h3 className="text-xl font-semibold font-headline mb-1">{statusContent.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{statusContent.description}</p>
              {statusContent.badge}
          </CardContent>
        </Card>

      </div>
      <div className="flex justify-center pt-4">
        <Button size="lg" disabled={validationStatus !== 'success'}>
          Start Production <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
