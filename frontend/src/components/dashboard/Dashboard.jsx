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
import { Plus, Coffee, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { widgets, isLoading, error } = useWidgets();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading your widgets...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your payment widgets and track donations
            </p>
          </div>
          <Link to="/create-widget">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Widget
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Widgets
              </CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widgets.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Payman Paytag
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono">{user?.payman_paytag}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{user?.display_name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </CardContent>
          </Card>
        </div>

        {/* Widgets */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Widgets</h2>

          {widgets.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <CardTitle className="mb-2">No widgets yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first payment widget to start accepting donations
                </CardDescription>
                <Link to="/create-widget">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Widget
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
