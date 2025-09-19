import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { supabase } from "@/utils/supabase";

interface HistoryItem {
  created_at: string;
  description: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("history_logs")
        .select("created_at, description")
        .order("created_at", { ascending: false });

      if (!error && data) setHistory(data);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.item}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>History</Text>
        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : history.length > 0 ? (
          <FlatList
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text style={styles.empty}>No history found.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: "#f3f3f3",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginTop: 6,
  },
  empty: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
