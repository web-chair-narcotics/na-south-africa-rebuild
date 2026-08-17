import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminLanding from "./pages/AdminLanding";
import AdminPortal from "./pages/AdminPortal";
import Areas from "./pages/Areas";
import AreaPage from "./pages/AreaPage";
import ContentPage from "./pages/ContentPage";
import Home from "./pages/Home";
import Meetings from "./pages/Meetings";
import MeetingDetail from "./pages/MeetingDetail";
import LegacyRouteRedirect from "./pages/LegacyRouteRedirect";
import LiteraturePage from "./pages/LiteraturePage";
import LiteratureDetail from "./pages/LiteratureDetail";
import PrivacyPage from "./pages/PrivacyPage";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/meetings" component={Meetings} />
      <Route path="/meetings/:id">{params => <MeetingDetail id={params.id} />}</Route>
      <Route path="/areas" component={Areas} />
      <Route path="/areas/south-africa-region">{() => <AreaPage slug="south-africa-region" />}</Route>
      <Route path="/areas/johannesburg">{() => <AreaPage slug="johannesburg" />}</Route>
      <Route path="/areas/cape-town">{() => <AreaPage slug="cape-town" />}</Route>
      <Route path="/areas/pretoria">{() => <AreaPage slug="pretoria" />}</Route>
      <Route path="/areas/kwazulu-natal">{() => <AreaPage slug="kwazulu-natal" />}</Route>
      <Route path="/admin/login" component={AdminLanding} />
      <Route path="/admin/:rest*" component={AdminPortal} />
      <Route path="/admin" component={AdminPortal} />
      <Route path="/about">{() => <ContentPage page="about" />}</Route>
      <Route path="/about-na">{() => <ContentPage page="about" />}</Route>
      <Route path="/recovery">{() => <ContentPage page="recovery" />}</Route>
      <Route path="/what-happens-at-an-na-meeting">{() => <ContentPage page="recovery" />}</Route>
      <Route path="/information-about-na">{() => <ContentPage page="information" />}</Route>
      <Route path="/how-to-start-an-na-meeting">{() => <ContentPage page="start" />}</Route>
      <Route path="/literature" component={LiteraturePage} />
      <Route path="/literature/:slug">{params => <LiteratureDetail slug={params.slug} />}</Route>
      <Route path="/na-literature" component={LiteraturePage} />
      <Route path="/news">{() => <ContentPage page="news" />}</Route>
      <Route path="/contact">{() => <ContentPage page="contact" />}</Route>
      <Route path="/contact-us">{() => <ContentPage page="contact" />}</Route>
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/privacy-policy" component={PrivacyPage} />
      <Route path="/404" component={NotFound} />
      <Route component={LegacyRouteRedirect} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider><Toaster /><ScrollToTop /><Router /></TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
