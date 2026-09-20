import React from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Park, parks } from "./data/parks";

type Props = {
  onSelectPark: (park: Park) => void;
};

export default function ParkSelector({
  onSelectPark,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>RIDE RADAR</Text>

        <Text style={styles.title}>
          Walt Disney World
        </Text>

        <Text style={styles.subtitle}>
          Choose a park to scan live wait times.
        </Text>
      </View>

      <View style={styles.parks}>
        {parks.map((park) => (
          <Pressable
            key={park.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => onSelectPark(park)}
          >
            <Text style={styles.emoji}>
              {park.emoji}
            </Text>

            <View style={styles.parkInfo}>
              <Text style={styles.parkName}>
                {park.name}
              </Text>

              <Text style={styles.description}>
                {park.description}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Live park data powered by ThemeParks.wiki
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

  header: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },

  logo: {
    color: "#57D7FF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 20,
  },

  subtitle: {
    color: "#8194AB",
    fontSize: 15,
    marginTop: 7,
  },

  parks: {
    paddingHorizontal: 20,
    gap: 14,
  },

  card: {
    minHeight: 100,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#102238",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#19344F",
  },

  cardPressed: {
    opacity: 0.7,
  },

  emoji: {
    fontSize: 34,
    marginRight: 16,
  },

  parkInfo: {
    flex: 1,
  },

  parkName: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  description: {
    color: "#8194AB",
    fontSize: 13,
    marginTop: 5,
  },

  arrow: {
    color: "#57D7FF",
    fontSize: 35,
    fontWeight: "300",
    marginLeft: 10,
  },

  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 18,
  },

  footerText: {
    color: "#536A83",
    fontSize: 11,
  },
});