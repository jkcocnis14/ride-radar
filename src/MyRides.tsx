import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

import { parks } from "./data/parks";
import { Attraction } from "./types";

type Props = {
  onBack: () => void;
  favourites: string[];
};
type FavouriteRide = Attraction & {
  parkName: string;
};
export default function MyRides({
  onBack,
  favourites,
}: Props) {
    const [rides, setRides] =
  useState<FavouriteRide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const loadFavouriteRides = async () => {
    try {
      setLoading(true);

      const responses = await Promise.all(
        parks.map((park) =>
          fetch(`https://api.themeparks.wiki/v1/entity/${park.id}/live`)
        )
      );

      const data = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }

          return response.json();
        })
      );

      const allRides = data.flatMap(
  (parkData, index) =>
    (parkData.liveData ?? []).map(
      (ride: Attraction) => ({
        ...ride,
        parkName: parks[index].name,
      })
    )
);

      const favouriteRides = allRides.filter((ride) =>
        favourites.includes(ride.id)
      );

      setRides(favouriteRides);
    } catch (error) {
      console.error("Failed to load favourite rides:", error);
    } finally {
      setLoading(false);
    }
  };

  loadFavouriteRides();
}, [favourites]);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>
            ‹ Parks
          </Text>
        </Pressable>

        <Text style={styles.brand}>
          RIDE RADAR
        </Text>

        <Text style={styles.title}>
          ★ My Rides
        </Text>

        <Text style={styles.subtitle}>
          {favourites.length === 1
  ? "1 favourite ride"
  : `${favourites.length} favourite rides`}
        </Text>

 <View style={styles.rideList}>
  {rides.map((ride) => {
    const wait =
      ride.queue?.STANDBY?.waitTime;

    return (
      <View
        key={ride.id}
        style={styles.ride}
      >
        <View style={styles.rideInfo}>
          <Text style={styles.rideName}>
            {ride.name}
          </Text>
         <Text style={styles.parkName}>
  {ride.parkName}
</Text>
          <Text
            style={
              ride.status === "OPERATING"
                ? styles.open
                : styles.closed
            }
          >
            {ride.status === "OPERATING"
              ? "● Open"
              : `● ${ride.status ?? "Unknown"}`}
          </Text>
        </View>

        <Text style={styles.star}>
          ★
        </Text>

        <View style={styles.wait}>
          <Text style={styles.waitNumber}>
            {wait ?? "—"}
          </Text>

          <Text style={styles.minutes}>
            MIN
          </Text>
        </View>
      </View>
    );
  })}
</View>

        <Text style={styles.footer}>
          Powered by ThemeParks.wiki
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08111F",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  back: {
    color: "#57D7FF",
    fontSize: 17,
    marginBottom: 22,
  },

  brand: {
    color: "#57D7FF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },

  subtitle: {
    color: "#8194AB",
    fontSize: 15,
    marginTop: 6,
  },

  placeholder: {
    backgroundColor: "#102238",
    borderColor: "#19344F",
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    padding: 30,
    marginTop: 28,
  },

  placeholderStar: {
    color: "#FFD65A",
    fontSize: 36,
  },

  placeholderTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },

  placeholderText: {
    color: "#8194AB",
    fontSize: 14,
    marginTop: 6,
  },

  footer: {
    color: "#60748B",
    fontSize: 12,
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: 16,
  },
rideList: {
  marginTop: 24,
},

ride: {
  flexDirection: "row",
  alignItems: "center",
  borderBottomWidth: 1,
  borderBottomColor: "#17263A",
  paddingVertical: 16,
},

rideInfo: {
  flex: 1,
  paddingRight: 10,
},

rideName: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "700",
},
parkName: {
  color: "#8194AB",
  fontSize: 12,
  marginTop: 4,
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

star: {
  color: "#FFD65A",
  fontSize: 24,
  marginHorizontal: 10,
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
});