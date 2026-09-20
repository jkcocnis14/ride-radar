import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  favourite: boolean;
  onPress: () => void;
};

export default function FavouriteButton({
  favourite,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={styles.button}
    >
      <Text
        style={[
          styles.star,
          favourite && styles.active,
        ]}
      >
        {favourite ? "★" : "☆"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  star: {
    color: "#60748B",
    fontSize: 30,
  },

  active: {
    color: "#FFD65A",
  },
});