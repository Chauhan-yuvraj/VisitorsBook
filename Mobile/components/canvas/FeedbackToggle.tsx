import React from 'react';
import { View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { Type, Mic } from 'lucide-react-native';

interface FeedbackToggleProps {
  mode: 'text' | 'audio';
  setMode: (mode: 'text' | 'audio') => void;
}

export function FeedbackToggle({ mode, setMode }: FeedbackToggleProps) {
  return (
    <View className="bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
      <SegmentedButtons
        value={mode}
        onValueChange={(val) => setMode(val as "text" | "audio")}
        buttons={[
          {
            value: "text",
            label: "Text",
            icon: ({ color }) => <Type size={20} color={color} />,
            style: { borderRadius: 12 },
          },
          {
            value: "audio",
            label: "Voice",
            icon: ({ color }) => <Mic size={20} color={color} />,
            style: { borderRadius: 12 },
          },
        ]}
        theme={{
          colors: {
            secondaryContainer: "#ffffff",
            onSecondaryContainer: "#10b981",
            outline: "transparent",
          },
        }}
        style={{ backgroundColor: "transparent" }}
      />
    </View>
  );
}
