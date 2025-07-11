import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import Account from "@/pages/Account";
import Inventory from "@/pages/Inventory";
import NewEvent from "@/pages/NewEvent";
import EventPanel from "@/pages/EventPanel";
import EventListPanel from "@/pages/EventListPanel";
import EventHistory from "@/pages/EventHistory";
import EventHistoryDetails from "@/pages/EventHistoryDetails";
import DonorsRanking from "@/pages/DonorsRanking";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        }
      />
      <Route
        path="/events/new"
        element={
          <PrivateRoute>
            <NewEvent />
          </PrivateRoute>
        }
      />
      <Route
          path="/events/:id"
        element={
          <PrivateRoute>
            <EventPanel />
          </PrivateRoute>
        }
      />
      <Route
          path="/events/panel"
        element={
          <PrivateRoute>
            <EventListPanel />
          </PrivateRoute>
        }
      />
      <Route
          path="/events/history"
        element={
          <PrivateRoute>
            <EventHistory />
          </PrivateRoute>
        }
      />
       <Route
          path="/events/history/:id"
        element={
          <PrivateRoute>
            <EventHistoryDetails />
          </PrivateRoute>
        }
      />
      <Route
          path="/donors-ranking/range"
        element={
          <PrivateRoute>
            <DonorsRanking />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
