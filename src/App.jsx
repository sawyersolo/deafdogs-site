import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from "./pages/Home";
import Music from "./pages/Music";
import Merch from "./pages/Merch";
import Photos from "./pages/Photos";
import Press from "./pages/Press";

function RouteShell({ children }) {
  const location = useLocation()
  return (
    <Layout>
      <PageTransition locationKey={location.pathname}>{children}</PageTransition>
    </Layout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteShell>
            <Home />
          </RouteShell>
        }
      />

      <Route
        path="/music"
        element={
          <RouteShell>
            <Music />
          </RouteShell>
        }

      />
      <Route
        path="/merch"
        element={
          <RouteShell>
            <Merch />
          </RouteShell>
        }
      />
      <Route
        path="/photos"
        element={
          <RouteShell>
            <Photos />
          </RouteShell>
        }
      />

      <Route
        path="/epk"
        element={
          <RouteShell>
            <Press />
          </RouteShell>
        }
      />

      {/* Soft fallback */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
