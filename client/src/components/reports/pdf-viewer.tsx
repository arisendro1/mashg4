import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, FileText, X } from "lucide-react";
import { Inspection } from "@shared/schema";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface PDFViewerProps {
  inspection: Inspection;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFViewer({ inspection, isOpen, onClose }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !pdfUrl) {
      generatePDFPreview();
    }
  }, [isOpen]);

  const generatePDFPreview = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generatePDF(inspection);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const pdfBlob = await generatePDF(inspection);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inspection-report-${inspection.factoryName}-${inspection.gregorianDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF report downloaded successfully",
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Inspection Report - {inspection.factoryName}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 mx-auto text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold mb-2">PDF Report Ready</h3>
                <p className="text-gray-600 mb-4">
                  Your inspection report for <strong>{inspection.factoryName}</strong> is ready for download.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Date: {inspection.gregorianDate} | Inspector: {inspection.inspector}
                </p>
                <Button 
                  onClick={handleDownload} 
                  className="w-full max-w-xs"
                  disabled={isGenerating}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Download Report"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}