import { COL_WIDTHS } from "@/constants/constant";
import { Text, View } from "react-native";

export // --- Table Header ---
const TableHeader = () => (
  <View className="flex-row bg-gray-200 py-2.5 px-1 border-b-2 border-gray-300 rounded-t-xl">
    <View style={{ width: COL_WIDTHS.IMAGE }}>
      <Text className="text-xs font-bold text-gray-700 text-center">Img</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Details (Name/Position)
      </Text>
    </View>
    <View style={{ width: COL_WIDTHS.PREVIEW }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Feedback
      </Text>
    </View>
    <View style={{ width: COL_WIDTHS.PREVIEW }}>
      <Text className="text-xs font-bold text-gray-700 text-center">Sig</Text>
    </View>
    <View style={{ width: COL_WIDTHS.DATETIME }} className="pl-2">
      <Text className="text-xs font-bold text-gray-700">Time</Text>
    </View>
    <View style={{ width: COL_WIDTHS.ACTIONS }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Display
      </Text>
    </View>
    <View style={{ width: COL_WIDTHS.ACTIONS }}>
      <Text className="text-xs font-bold text-gray-700 text-center">
        Actions
      </Text>
    </View>
  </View>
);
