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
import { Copy, Trash2, Code, DollarSign } from "lucide-react";
import { useWidgets } from "../../hooks/useWidgets";

export default function WidgetCard({ widget }) {
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    alert("Embed code copied to clipboard!");
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
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Embed Code</DialogTitle>
                  <DialogDescription>
                    Copy this code and paste it into your website where you want
                    the payment buttons to appear
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {isLoadingEmbed ? (
                    <div className="text-center py-8">
                      Loading embed code...
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                          {embedCode}
                        </pre>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleCopyEmbedCode}
                          className="flex-1"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Embed Code
                        </Button>
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
