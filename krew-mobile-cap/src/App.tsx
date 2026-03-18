import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

// Pages
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import PlaylistPage from "./pages/PlaylistPage"
import Library from "./pages/Library"
import LikedSongs from "./pages/LikedSongs"
import RecentSongs from "./pages/RecentSongs"
import Playlists from "./pages/Playlists"
import GenrePage from "./pages/GenrePage"
import Albums from "./pages/Albums"
import Artists from "./pages/Artists"
import ArtistPage from "./pages/ArtistPage"
import AlbumPage from "./pages/AlbumPage"
import Queue from "./pages/Queue"
import Radio from "./pages/Radio"
import Upload from "./pages/Upload"
import Jam from "./pages/Jam"
import CapsulePage from "./pages/CapsulePage"
import TheLab from "./pages/TheLab"
import CrateDigger from "./pages/CrateDigger"
import SonicGalaxy from "./pages/SonicGalaxy"
import RequestSong from "./pages/RequestSong"
import NotFound from "./pages/NotFound"

// Components
import Sidebar from "./components/Sidebar"
import MobileNav from "./components/MobileNav"
import Player from "./components/Player"
import AppLayout from "./components/AppLayout"
import { JamManager } from "./components/JamManager"
import BackButtonHandler from "./components/BackButtonHandler"
import NotificationPermissionHandler from "./components/NotificationPermissionHandler"
import DeepLinkHandler from "./components/DeepLinkHandler"

const queryClient = new QueryClient()

import { authApi } from "@/lib/api"
import { useEffect } from "react"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setUser } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      authApi.me().then(res => {
        setUser(res.data)
      }).catch(console.error)
    }
  }, [isAuthenticated, setUser])

  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

/* 🔹 LAYOUT (NO PLAYER HERE) */
const AppLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-24">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}

import ThemeController from "./components/ThemeController"

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors />
      <JamManager />
      <BrowserRouter>
        <ThemeController />
        <ThemeController />
        <BackButtonHandler />
        <NotificationPermissionHandler />
        <DeepLinkHandler />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlaylistPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Search />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RequestSong />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Library />
                </AppLayout>
              </ProtectedRoute>
            }
          >
            <Route path="liked" element={<LikedSongs />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="recent" element={<RecentSongs />} />
          </Route>

          <Route
            path="/genre/:genre"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <GenrePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/albums"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Albums />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/album/:name"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AlbumPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/artists"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Artists />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/artist/:name"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ArtistPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Queue />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/radio"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Radio />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Upload />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jam"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Jam />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/capsule"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CapsulePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/the-lab"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TheLab />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dig"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CrateDigger />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/galaxy"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SonicGalaxy />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ProtectedRoute><AppLayout><NotFound /></AppLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
