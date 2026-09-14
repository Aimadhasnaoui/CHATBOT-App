import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./Component/Data/Appcontext";
import HomePage from "./Component/HomePage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <HomePage />
          </AppProvider>
        </QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


