import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import ReportCard from "@/components/ReportCard";
import { getToken } from "@/utils/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.2:5000";

type Report = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  createdBy: number;
  validatedBy: number | null;
  resolvedBy: number | null;
  category: string;
  location: string | null;
  image_url: string | null;
  rating: number | null;
};

type User = {
  id: number;
  email: string;
  admin: boolean;
};

export default function ExploreScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user info");
      return res.json();
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  const fetchReports = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data: Report[] = await response.json();
      setReports(data);

      // Unique categories
      const uniqueCategories = [...new Set(data.map((r) => r.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      const token = await getToken();
      if (!token) return setLoading(false);

      const currentUser = await fetchCurrentUser(token);
      setUser(currentUser);
      await fetchReports(token);
    };
    init();
  }, []);

  // Refresh reports when screen gains focus (after closing modal)
  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        const token = await getToken();
        if (!token) return;
        await fetchReports(token);
      };
      refresh();
    }, [])
  );

  const filteredReports = selectedCategory
    ? reports.filter((r) => r.category === selectedCategory)
    : reports;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <Text variant="headlineMedium" style={{ color: "#fff", textAlign: "center" }}>
          Explore
        </Text>
      </View>

      {/* Category Filter */}
      {!user?.admin && categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: selectedCategory == null ? "#fff" : "#1f1f1f",
              borderWidth: 1,
              borderColor: "#3a3a3a",
            }}
          >
            <Text style={{ color: selectedCategory == null ? "#000" : "#fff" }}>All</Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: selectedCategory === category ? "#fff" : "#1f1f1f",
                borderWidth: 1,
                borderColor: "#3a3a3a",
              }}
            >
              <Text style={{ color: selectedCategory === category ? "#000" : "#fff" }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Reports List */}
      {loading ? (
        <Text style={{ color: "#9aa0a6", textAlign: "center", marginTop: 24 }}>
          Loading reports...
        </Text>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16 }}>
              <ReportCard report={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <Text style={{ color: "#9aa0a6", textAlign: "center", marginTop: 24 }}>
              There are no reports to display.
            </Text>
          }
          style={{ flex: 1, width: "100%", alignSelf: "stretch" }}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 8 }}
          showsVerticalScrollIndicator
        />
      )}

      {/* Floating Add Button */}
      <FAB
        style={{ position: "absolute", bottom: 16, right: 16, backgroundColor: "#1976d2" }}
        icon="plus"
        label="Add"
        onPress={() => router.push("/(modals)/report-form")}
      />
    </SafeAreaView>
  );
}
