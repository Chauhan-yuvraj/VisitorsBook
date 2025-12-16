import { View, Dimensions, Text } from "react-native";
import React from "react";

const NUM_COLUMNS = 24;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// size of each square cell
const boxWidth = screenWidth / NUM_COLUMNS;

// number of rows needed to perfectly fill screen height
const numRows = Math.ceil(screenHeight / boxWidth);

// total boxes needed
const GRID_LENGTH = NUM_COLUMNS * numRows;

export default function Whitebg() {
  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "white",
      }}
    >
      <Grid />
    </View>
  );
}

function Grid() {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {Array.from({ length: GRID_LENGTH }).map((_, i) => {
        const row = Math.floor(i / NUM_COLUMNS);
        const col = i % NUM_COLUMNS;

        const isSecondRow = row % 2 === 1;
        const isSecondCol = col % 2 === 1;

        return isSecondRow && isSecondCol ? (
          <PlusAtVertex key={i} />
        ) : (
          <GridBox key={i} />
        );
      })}
    </View>
  );
}

function GridBox() {
  return (
    <View
      style={{
        width: boxWidth,
        height: boxWidth,
        borderWidth: 0.5,
        borderColor: "#E2E2E2",
      }}
    />
  );
}

function PlusAtVertex() {
  return (
    <View
      style={{
        width: boxWidth,
        height: boxWidth,
        borderWidth: 0.5,
        borderColor: "#E2E2E2",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          zIndex: 1,
          transform: [
            { translateX: boxWidth / 2 },
            { translateY: -boxWidth / 2 },
          ],
          color: "#3F3F3F",
        }}
      >
        +
      </Text>
    </View>
  );
}
