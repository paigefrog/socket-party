import {
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
  lazy,
} from "preact-iso";

const Home = lazy(() => import("./routes/home"));
const _404 = lazy(() => import("./routes/_404"));

const routes = [
  <Route path="/" component={Home} />,
  <Route default component={_404} />,
];

export const TheRouter = () => {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Router>{routes}</Router>
      </ErrorBoundary>
    </LocationProvider>
  );
};
