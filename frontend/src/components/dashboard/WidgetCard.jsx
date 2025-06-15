import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Copy,
  Trash2,
  Code,
  DollarSign,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useWidgets } from "../../hooks/useWidgets";

export default function WidgetCard({ widget }) {
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { deleteWidget, getEmbedCode } = useWidgets();

  const handleGetEmbedCode = async () => {
    setIsLoadingEmbed(true);
    const result = await getEmbedCode(widget.id);

    if (result.success) {
      setEmbedCode(result.embedCode);
    } else {
      alert("Failed to get embed code");
    }
    setIsLoadingEmbed(false);
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this widget?")) return;

    setIsDeleting(true);
    const result = await deleteWidget(widget.id);

    if (!result.success) {
      alert("Failed to delete widget");
    }
    setIsDeleting(false);
  };

  const getPaymentUrl = () => {
    const baseUrl = import.meta.env.PROD
      ? "https://paycoffee.vercel.app"
      : "http://localhost:5173";
    return `${baseUrl}/pay/${widget.id}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{widget.title}</span>
            </CardTitle>
            <CardDescription className="mt-1">
              {widget.description || "No description"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetEmbedCode}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Embed
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Embed Your Payment Widget</DialogTitle>
                  <DialogDescription>
                    Add this single line of code anywhere in your website to
                    show the payment widget
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {isLoadingEmbed ? (
                    <div className="text-center py-8">
                      Loading embed code...
                    </div>
                  ) : (
                    <>
                      {/* Instructions */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-sm">How to use:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                          <li>Copy the embed code below</li>
                          <li>
                            Paste it anywhere in your website's HTML (preferably
                            before the closing &lt;/body&gt; tag)
                          </li>
                          <li>
                            The widget will automatically appear in the
                            bottom-right corner
                          </li>
                        </ol>
                      </div>

                      {/* Embed Code */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Embed Code:
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border relative">
                          <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                            {embedCode}
                          </pre>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCopyEmbedCode}
                            className="absolute top-2 right-2"
                          >
                            {copySuccess ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Preview:</label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-600 mb-3">
                            The widget will appear as a floating button in the
                            bottom-right corner of your website.
                          </p>
                          <div className="relative h-40 bg-white rounded border">
                            <div
                              className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                              style={{ backgroundColor: widget.primary_color }}
                            >
                              ☕
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Test Link */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <a
                          href={getPaymentUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Test payment page
                        </a>
                        <Button
                          variant="outline"
                          onClick={() => setShowEmbedDialog(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {widget.default_amounts.map((amount) => (
              <Badge key={amount} variant="secondary">
                ${amount}
              </Badge>
            ))}
            {widget.allow_custom_amount && (
              <Badge variant="outline">Custom Amount</Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Button: "{widget.button_text}"</span>
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: widget.primary_color }}
            />
          </div>

          <div className="text-xs text-gray-500">
            Created {new Date(widget.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
