import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API = "https://api.themeparks.wiki/v1";

// Magic Kingdom's ThemeParks.wiki entity ID
const MAGIC_KINGDOM_ID = "75ea578a-adc8-4116-a54d-dccb60765ef9";

type Attraction = {
  id: string;
  name: string;
  entityType: string;
  status?: string;
  queue?: {
    STANDBY?: {
      waitTime?: number | null;
    };
  };
};

export default function App() {
  const [rides, setRides] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);

  async function loadWaitTimes() {
    try {
      setError(null);

      const response = await fetch(
        `${API}/entity/${MAGIC_KINGDOM_ID}/live`
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const json = await response.json();

      const attractions: Attraction[] = json.liveData
        .filter(
          (item: Attraction) =>
            item.entityType === "ATTRACTION" &&
            item.queue?.STANDBY?.waitTime != null
        )
        .sort(
          (a: Attraction, b: Attraction) =>
            (a.queue?.STANDBY?.waitTime ?? 0) -
            (b.queue?.STANDBY?.waitTime ?? 0)
        );

      setRides(attractions);
      setUpdated(new Date());
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load wait times"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWaitTimes();
  }, []);

  function refresh() {
    setRefreshing(true);
    loadWaitTimes();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.logo}>RIDE RADAR</Text>

        <ActivityIndicator
          size="large"
          style={{ marginTop: 30 }}
        />

        <Text style={styles.loadingText}>
          Scanning Magic Kingdom...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>RIDE RADAR</Text>

        <Text style={styles.park}>
          🏰 Magic Kingdom
        </Text>

        {updated && (
          <Text style={styles.updated}>
            Updated{" "}
            {updated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.message}>
          <Text style={styles.errorTitle}>
            Radar offline
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Text style={styles.errorHint}>
            Pull down to try again.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#57D7FF"
            />
          }
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.listHeading}>
              <Text style={styles.heading}>
                LIVE WAIT TIMES
              </Text>

              <Text style={styles.count}>
                {rides.length} rides
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const wait =
              item.queue?.STANDBY?.waitTime ?? 0;

            return (
              <View style={styles.ride}>
                <View style={styles.rideDetails}>
                  <Text style={styles.rideName}>
                    {item.name}
                  </Text>

                  <Text
                    style={
                      item.status === "OPERATING"
                        ? styles.open
                        : styles.closed
                    }
                  >
                    {item.status === "OPERATING"
                      ? "● Open"
                      : `● ${item.status ?? "Unknown"}`}
                  </Text>
                </View>

                <View style={styles.wait}>
                  <Text style={styles.waitNumber}>
                    {wait}
                  </Text>

                  <Text style={styles.minutes}>
                    MIN
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by ThemeParks.wiki
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08111F",
  },

  loading: {
    flex: 1,
    backgroundColor: "#08111F",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#8EA1B8",
    marginTop: 16,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 15,
  },

  logo: {
    color: "#57D7FF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 2,
  },

  park: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  updated: {
    color: "#74879F",
    marginTop: 5,
    fontSize: 13,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  listHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  heading: {
    color: "#74879F",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  count: {
    color: "#74879F",
    fontSize: 12,
  },

  ride: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#17263A",
    paddingVertical: 16,
  },

  rideDetails: {
    flex: 1,
    paddingRight: 15,
  },

  rideName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  open: {
    color: "#6DD79D",
    fontSize: 12,
    marginTop: 6,
  },

  closed: {
    color: "#FF8B8B",
    fontSize: 12,
    marginTop: 6,
  },

  wait: {
    width: 65,
    backgroundColor: "#12253B",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 8,
  },

  waitNumber: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  minutes: {
    color: "#57D7FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  message: {
    margin: 20,
    backgroundColor: "#12253B",
    borderRadius: 16,
    padding: 20,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  errorText: {
    color: "#FF8B8B",
    marginTop: 8,
  },

  errorHint: {
    color: "#8EA1B8",
    marginTop: 8,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },

  footerText: {
    color: "#536A83",
    fontSize: 11,
  },
});