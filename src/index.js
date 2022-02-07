import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { store } from "./store/store";
import { Provider } from "react-redux";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false, // mount
      refetchInterval: false, // ms
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false, // background ms refetch
      //,retry: 1, retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 4000)
    },
  },
});
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
