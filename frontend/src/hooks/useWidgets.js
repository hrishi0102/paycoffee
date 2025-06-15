import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
export const useWidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWidgets = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("paycoffee_token");

      const response = await fetch(`${API_BASE_URL}/api/widgets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWidgets(data.widgets);
      } else {
        setError("Failed to fetch widgets");
      }
    } catch (error) {
      setError("Failed to fetch widgets");
      console.error("Fetch widgets error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createWidget = async (widgetData) => {
    try {
      const token = localStorage.getItem("paycoffee_token");

      const response = await fetch(`${API_BASE_URL}/api/widgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(widgetData),
      });

      const data = await response.json();

      if (data.success) {
        setWidgets((prev) => [data.widget, ...prev]);
        return { success: true, widget: data.widget };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to create widget" };
    }
  };

  const deleteWidget = async (widgetId) => {
    try {
      const token = localStorage.getItem("paycoffee_token");

      const response = await fetch(`${API_BASE_URL}/api/widgets/${widgetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to delete widget" };
    }
  };

  const getEmbedCode = async (widgetId) => {
    try {
      const token = localStorage.getItem("paycoffee_token");

      const response = await fetch(
        `${API_BASE_URL}/api/widgets/${widgetId}/embed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        return { success: true, embedCode: data.embedCode };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Failed to get embed code" };
    }
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  return {
    widgets,
    isLoading,
    error,
    createWidget,
    deleteWidget,
    getEmbedCode,
    refetch: fetchWidgets,
  };
};
