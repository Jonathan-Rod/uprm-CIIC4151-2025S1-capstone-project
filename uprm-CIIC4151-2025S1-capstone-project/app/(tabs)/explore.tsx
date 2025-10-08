import { mockReports } from '@/mocks/report';
import { getRole, getToken } from "@/utils/auth";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// Import ReportCard component (adjust the path as needed)
import ReportCard from "@/components/ReportCard";

// Dummy implementation for fetchReportsByDepartment
async function fetchReportsByDepartment(department: string) {
  // Replace with your actual API call
  return [];
}

// Dummy implementation for fetchReports
type Report = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  createdBy: number;
  validatedBy: null;
  resolvedBy: null;
  category: string;
  location: number;
  image_url: null;
  rating: null;
};

async function fetchReports(): Promise<Report[]> {
  // Replace with your actual API call
  // For now, return mockReports or fetch from API
  return mockReports;
}

export default function ExploreScreen() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState(mockReports);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndReports = async () => {
      const tokenResult = await getToken();
      const roleResult = await getRole();

      // You may need to parse tokenResult to get the user object, depending on your implementation
      // For example, if tokenResult is a JWT, decode it to get user info
      // Here, we assume tokenResult is a JSON string with a 'user' property
      let parsedUser = null;
      if (tokenResult && roleResult) {
        try {
          parsedUser = JSON.parse(tokenResult).user;
          parsedUser.role = roleResult;
        } catch (e) {
          parsedUser = null;
        }
      }
      setUser(parsedUser);

      if (parsedUser && parsedUser.role === "admin") {
        const departmentReports = await fetchReportsByDepartment(parsedUser.department);
        setReports(departmentReports);
      } else if (parsedUser && parsedUser.role === "civilian") {
        const allReports = await fetchReports();
        setReports(allReports);

        const uniqueCategories = [...new Set(allReports.map(report => report.category))];
        setCategories(uniqueCategories);
      }
    }
    fetchUserAndReports();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  const filteredReports = selectedCategory
    ? reports.filter((report: Report) => report.category === selectedCategory)
    : reports;

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
    {/* Header */}
    <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
      <Text variant="headlineMedium" style={{ color: "#fff", textAlign: "center" }}>
        Explore
      </Text>
    </View>

    {/* Category chips (civilian only) */}
    {user?.role === "civilian" && (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
      >
        {/* Optional: "All" chip */}
        <TouchableOpacity
          onPress={() => setSelectedCategory(null as any)}
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

        {categories.map((category: string) => (
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

    {/* List */}
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
      contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}           
      showsVerticalScrollIndicator
    />
  </SafeAreaView>
);

}
