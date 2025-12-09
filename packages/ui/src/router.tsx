import { Routes, Route, BrowserRouter } from "react-router";

import * as Pages from "./pages";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Pages.Home />} />
        <Route path="*" element={<Pages.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
