import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { AppProvider } from "./Component/Data/Appcontext";
import HomePage from "./Component/HomePage";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppProvider>
          <HomePage />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


