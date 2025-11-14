import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRecords, deleteRecord } from "@/store/slices/records.slice";

import { SafeAreaView } from "react-native-safe-area-context";
import Background from "@/components/ui/background";
import { Trash2 } from "lucide-react-native";
import { FeedbackRecord } from "@/services/feedback.service";

// Helper component for displaying a single record
const RecordCard: React.FC<{ record: FeedbackRecord }> = ({ record }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    // Confirmation dialog is highly recommended here in a real app
    dispatch(deleteRecord(record.id));
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.guestName}>{record.guestName}</Text>
        <Text style={styles.guestPosition}>{record.guestPosition}</Text>
        <Text style={styles.metadata}>
          Saved: {formatDate(record.timestamp)}
        </Text>
        <Text style={styles.metadata}>
          Pages: {record.pages.length} | Signature:{" "}
          {record.signature.length > 0 ? "Yes" : "No"}
        </Text>
      </View>

      <Pressable onPress={handleDelete} style={styles.deleteButton}>
        <Trash2 size={20} color="#EF4444" />
      </Pressable>

      {/* TODO: Add a button here to view the actual drawing */}
    </View>
  );
};

export default function RecordsScreen() {
  const dispatch = useAppDispatch();
  const { records, status, error } = useAppSelector((state) => state.records);

  // Fetch records on initial load
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRecords());
    }
  }, [status, dispatch]);

  // --- Render Content based on Status ---

  let content;
  if (status === "loading") {
    content = <Text style={styles.statusText}>Loading records...</Text>;
  } else if (status === "failed") {
    content = (
      <Text style={[styles.statusText, { color: "#EF4444" }]}>
        Error: {error}
      </Text>
    );
  } else if (records.length === 0) {
    content = <Text style={styles.statusText}>No feedback records found.</Text>;
  } else {
    content = (
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecordCard record={item} />}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  return (
    <Background image={require("@/assets/images/background.jpg")}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Saved Visitor Feedback</Text>
        <View style={styles.contentWrapper}>{content}</View>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 10,
  },
  statusText: {
    color: "#D1D5DB",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  guestName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  guestPosition: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  metadata: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 4,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
});
