// visitors-book/app/_layout.tsx

import { Provider } from "react-redux";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";

import { store } from "@/store/store";
import { injectStore, injectActions } from "@/services/api";
import { logout, setNewAccessToken } from "@/store/slices/auth.slice";
import "./global.css";
import RootStack from "./RootStack";

// Inject store and actions into API service for interceptors
injectStore(store);
injectActions(logout, setNewAccessToken);

export const unstable_settings = {
  // anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    // Redux Provider MUST be the outermost wrapper
    <Provider store={store}>
      <PaperProvider>
        {/* RootStack handles session restoration and navigation */}
        <RootStack />
      </PaperProvider>
    </Provider>
  );
}