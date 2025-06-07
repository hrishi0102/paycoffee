import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWidgets } from "../../hooks/useWidgets";
import Layout from "../shared/Layout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";

export default function CreateWidget() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    defaultAmounts: [5, 10, 25],
    allowCustomAmount: true,
    buttonText: "Buy me a coffee",
    primaryColor: "#4fd1c7",
  });
  const [newAmount, setNewAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { createWidget } = useWidgets();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addAmount = () => {
    const amount = parseFloat(newAmount);
    if (amount && amount > 0 && !formData.defaultAmounts.includes(amount)) {
      setFormData((prev) => ({
        ...prev,
        defaultAmounts: [...prev.defaultAmounts, amount].sort((a, b) => a - b),
      }));
      setNewAmount("");
    }
  };

  const removeAmount = (amount) => {
    setFormData((prev) => ({
      ...prev,
      defaultAmounts: prev.defaultAmounts.filter((a) => a !== amount),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.defaultAmounts.length === 0) {
      setError("Please add at least one default amount");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createWidget(formData);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to create widget");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Create Payment Widget</h1>
          <p className="text-gray-600 mt-1">
            Set up a new widget to accept payments on your website
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Widget Configuration</CardTitle>
            <CardDescription>
              Customize how your payment widget will appear and function
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Widget Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Support My Work"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Help me create awesome content"
                  />
                </div>
              </div>

              {/* Default Amounts */}
              <div className="space-y-4">
                <Label>Default Amounts *</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.defaultAmounts.map((amount) => (
                    <Badge
                      key={amount}
                      variant="secondary"
                      className="flex items-center space-x-2"
                    >
                      <span>${amount}</span>
                      <button
                        type="button"
                        onClick={() => removeAmount(amount)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Add amount (e.g., 15)"
                    className="flex-1"
                    min="0"
                    step="0.01"
                  />
                  <Button
                    type="button"
                    onClick={addAmount}
                    disabled={!newAmount || parseFloat(newAmount) <= 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Customization */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleChange}
                    placeholder="Buy me a coffee"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Button Color</Label>
                  <div className="flex space-x-3 items-center">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="w-20 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primaryColor: e.target.value,
                        }))
                      }
                      placeholder="#4fd1c7"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="allowCustomAmount"
                    name="allowCustomAmount"
                    type="checkbox"
                    checked={formData.allowCustomAmount}
                    onChange={handleChange}
                    className="rounded"
                  />
                  <Label htmlFor="allowCustomAmount">
                    Allow custom amounts
                  </Label>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Widget"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your widget will look on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-white">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">
                    {formData.title || "Widget Title"}
                  </h3>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.defaultAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      style={{ backgroundColor: formData.primaryColor }}
                      className="text-white px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      ☕ {formData.buttonText} (${amount})
                    </button>
                  ))}
                </div>

                {formData.allowCustomAmount && (
                  <div className="flex space-x-2 mt-3">
                    <input
                      type="number"
                      placeholder="Custom amount"
                      className="px-3 py-2 border rounded text-sm flex-1"
                      disabled
                    />
                    <button
                      type="button"
                      style={{ backgroundColor: formData.primaryColor }}
                      className="text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
