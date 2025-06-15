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
import {
  ArrowLeft,
  Plus,
  X,
  Coffee,
  Palette,
  Settings,
  Eye,
} from "lucide-react";

export default function CreateWidget() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    defaultAmounts: [5, 10, 25],
    allowCustomAmount: true,
    buttonText: "Buy me a coffee",
    primaryColor: "#ea580c", // Orange-600
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-amber-800 hover:text-amber-900 hover:bg-amber-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
              Create Payment Widget ☕
            </h1>
            <p className="text-amber-800/80 mt-2 text-lg">
              Set up a new widget to accept payments on your website
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Form */}
          <div className="space-y-6">
            <Card className="bg-white border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <CardTitle className="text-amber-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Widget Configuration
                </CardTitle>
                <CardDescription className="text-amber-800/70">
                  Customize how your payment widget will appear and function
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-amber-900 font-medium"
                      >
                        Widget Title *
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Support My Work"
                        className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-amber-900 font-medium"
                      >
                        Description
                      </Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Help me create awesome content"
                        className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                      />
                    </div>
                  </div>

                  {/* Default Amounts */}
                  <div className="space-y-4">
                    <Label className="text-amber-900 font-medium">
                      Default Amounts *
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.defaultAmounts.map((amount) => (
                        <Badge
                          key={amount}
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 flex items-center space-x-2 px-3 py-1"
                        >
                          <span>${amount}</span>
                          <button
                            type="button"
                            onClick={() => removeAmount(amount)}
                            className="ml-2 hover:text-red-600 transition-colors"
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
                        className="flex-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                        min="0"
                        step="0.01"
                      />
                      <Button
                        type="button"
                        onClick={addAmount}
                        disabled={!newAmount || parseFloat(newAmount) <= 0}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Customization */}
                  <div className="space-y-4">
                    <Label className="text-amber-900 font-medium flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Customization
                    </Label>

                    <div className="space-y-2">
                      <Label htmlFor="buttonText" className="text-amber-800">
                        Button Text
                      </Label>
                      <Input
                        id="buttonText"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        placeholder="Buy me a coffee"
                        className="border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryColor" className="text-amber-800">
                        Button Color
                      </Label>
                      <div className="flex space-x-3 items-center">
                        <Input
                          id="primaryColor"
                          name="primaryColor"
                          type="color"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          className="w-16 h-10 border-amber-200 cursor-pointer"
                        />
                        <Input
                          value={formData.primaryColor}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              primaryColor: e.target.value,
                            }))
                          }
                          placeholder="#ea580c"
                          className="flex-1 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <input
                        id="allowCustomAmount"
                        name="allowCustomAmount"
                        type="checkbox"
                        checked={formData.allowCustomAmount}
                        onChange={handleChange}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      <Label
                        htmlFor="allowCustomAmount"
                        className="text-amber-900 font-medium cursor-pointer"
                      >
                        Allow supporters to enter custom amounts
                      </Label>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-600 text-sm">{error}</div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 border-amber-300 text-amber-800 hover:bg-amber-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Coffee className="h-4 w-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Widget
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="bg-white border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <CardTitle className="text-amber-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-amber-800/70">
                  This is how your widget will look to your supporters
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Coffee className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-900 mb-2">
                        {formData.title || "Widget Title"}
                      </h3>
                      {formData.description && (
                        <p className="text-amber-800/80 text-sm">
                          {formData.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {formData.defaultAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            style={{ backgroundColor: formData.primaryColor }}
                            className="text-white px-4 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>

                      {formData.allowCustomAmount && (
                        <div className="space-y-3">
                          <input
                            type="number"
                            placeholder="Custom amount"
                            className="w-full px-4 py-3 border border-amber-200 rounded-lg text-sm focus:border-amber-400 focus:outline-none"
                            disabled
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        style={{ backgroundColor: formData.primaryColor }}
                        className="w-full text-white px-6 py-4 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity shadow-md"
                      >
                        {formData.buttonText}
                      </button>
                    </div>

                    <div className="text-center pt-4 border-t border-amber-200">
                      <p className="text-xs text-amber-700/60">
                        Powered by PayCoffee • Secure payments via Payman
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 text-lg">
                  💡 Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-blue-800">
                  <p className="mb-2">
                    <strong>Clear Title:</strong> Use a descriptive title that
                    tells supporters what they're funding.
                  </p>
                  <p className="mb-2">
                    <strong>Good Amounts:</strong> Include a range of amounts
                    ($5, $10, $25) to give supporters options.
                  </p>
                  <p>
                    <strong>Custom Color:</strong> Match your brand colors to
                    create a cohesive experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
