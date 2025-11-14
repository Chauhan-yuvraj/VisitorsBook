// visitors-book/app/_layout.tsx

import { Provider } from "react-redux";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";

import { store } from "@/store/store";
import "./global.css";
// Import the component containing Stack and ThemeProvider
import RootStack from "./RootStack";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    // Redux Provider MUST be the outermost wrapper
    <Provider store={store}>
      <PaperProvider>
        <RootStack />
      </PaperProvider>
    </Provider>
  );
}
