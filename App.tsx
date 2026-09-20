import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ParkSelector from "./src/ParkSelector";
import { Park } from "./src/data/parks";
import AsyncStorage from "@react-native-async-storage/async-storage";

import FavouriteButton from "./src/FavouriteButton";
const API = "https://api.themeparks.wiki/v1";

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
  const [selectedPark, setSelectedPark] =
    useState<Park | null>(null);
    const [favourites, setFavourites] =
  useState<string[]>([]);

useEffect(() => {
  loadFavourites();
}, []);

async function loadFavourites() {
  try {
    const saved =
      await AsyncStorage.getItem(
        "ride-radar-favourites"
      );

    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  } catch (error) {
    console.error(
      "Couldn't load favourites:",
      error
    );
  }
}

async function toggleFavourite(
  attractionId: string
) {
  const updated = favourites.includes(
    attractionId
  )
    ? favourites.filter(
        (id) => id !== attractionId
      )
    : [...favourites, attractionId];

  setFavourites(updated);

  await AsyncStorage.setItem(
    "ride-radar-favourites",
    JSON.stringify(updated)
  );
}
  if (!selectedPark) {
    return (
      <ParkSelector
        onSelectPark={setSelectedPark}
      />
    );
  }

  return (
    <WaitTimes
  park={selectedPark}
  onBack={() => setSelectedPark(null)}
  favourites={favourites}
  onToggleFavourite={toggleFavourite}
/>
  );
}

function WaitTimes({
  park,
  onBack,
  favourites,
  onToggleFavourite,
}: {
  park: Park;
  onBack: () => void;
  favourites: string[];
  onToggleFavourite: (
    attractionId: string
  ) => void;
}) {
  const [rides, setRides] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);

  async function loadWaitTimes() {
    try {
      setError(null);

      const response = await fetch(
        `${API}/entity/${park.id}/live`
      );

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}`
        );
      }

      const json = await response.json();

      const attractions: Attraction[] =
        json.liveData
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
  }, [park.id]);

  function refresh() {
    setRefreshing(true);
    loadWaitTimes();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.logo}>
          RIDE RADAR
        </Text>

        <ActivityIndicator
          size="large"
          style={{ marginTop: 30 }}
        />

        <Text style={styles.loadingText}>
          Scanning {park.name}...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.back}>
            ‹ Parks
          </Text>
        </Pressable>

        <Text style={styles.logo}>
          RIDE RADAR
        </Text>

        <Text style={styles.park}>
          {park.emoji} {park.name}
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
                 <FavouriteButton
  favourite={favourites.includes(item.id)}
  onPress={() =>
    onToggleFavourite(item.id)
  }
/>
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
    paddingTop: 12,
    paddingBottom: 15,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },

  back: {
    color: "#57D7FF",
    fontSize: 17,
    fontWeight: "700",
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

  footer: {
    alignItems: "center",
    paddingVertical: 10,
  },

  footerText: {
    color: "#536A83",
    fontSize: 11,
  },
});