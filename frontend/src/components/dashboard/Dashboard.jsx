import { Link } from "react-router-dom";
import { useWidgets } from "../../hooks/useWidgets";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../shared/Layout";
import WidgetCard from "./WidgetCard";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Plus, Coffee, CreditCard, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
  const { widgets, isLoading, error } = useWidgets();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Coffee className="h-6 w-6 text-amber-600 animate-spin" />
            <div className="text-lg text-amber-800">
              Loading your widgets...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <div className="text-red-600 mb-4">{error}</div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header with Welcome Message */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
                Welcome back, {user?.display_name}! ☕
              </h1>
              <p className="text-amber-800/80 mt-2 text-lg">
                Manage your payment widgets and track your earnings
              </p>
            </div>
            <Link to="/create-widget">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Widget
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-white to-amber-50/50 border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-amber-800">
                Total Widgets
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Coffee className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                {widgets.length}
              </div>
              <p className="text-xs text-amber-700/70 mt-1">
                Active payment widgets
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-orange-800">
                Payman Account
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-orange-900 bg-orange-100 px-3 py-2 rounded-lg border border-orange-200 break-all overflow-hidden">
                {user?.payman_paytag}
              </div>
              <p className="text-xs text-orange-700/70 mt-2">
                Connected wallet
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-yellow-50/50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Total Earnings
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">$0.00</div>
              <p className="text-xs text-yellow-700/70 mt-1">Coming soon</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-emerald-50/50 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-emerald-800">
                Supporters
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">0</div>
              <p className="text-xs text-emerald-700/70 mt-1">
                Total supporters
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Widgets Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-900">
              Your Payment Widgets
            </h2>
            {widgets.length > 0 && (
              <Link to="/create-widget">
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-800 hover:bg-amber-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another
                </Button>
              </Link>
            )}
          </div>

          {widgets.length === 0 ? (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 border-2 border-dashed">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Coffee className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-amber-900 mb-3">
                  No widgets yet
                </CardTitle>
                <CardDescription className="text-lg text-amber-800/80 mb-6 max-w-md mx-auto">
                  Create your first payment widget to start accepting donations
                  and tips from your supporters
                </CardDescription>
                <Link to="/create-widget">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Widget
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        {widgets.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center">
                <Coffee className="h-5 w-5 mr-2" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">
                    Embed Your Widget
                  </h4>
                  <p className="text-sm text-blue-700/80">
                    Copy the embed code from any widget card and paste it into
                    your website to start accepting payments.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Test Payments</h4>
                  <p className="text-sm text-blue-700/80">
                    Click the test link in your widget cards to preview how
                    supporters will see your payment page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
