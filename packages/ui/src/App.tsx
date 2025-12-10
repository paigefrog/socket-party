import { Theme } from "@radix-ui/themes";

import { AppRouter } from "./router";
import "./App.css";

export const App = () => {
  return (
    <Theme appearance="dark">
      <AppRouter />
    </Theme>
  );
};
