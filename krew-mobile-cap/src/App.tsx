import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api"

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
import RequestSong from "./pages/RequestSong"
import NotFound from "./pages/NotFound"
import OfflineLibrary from "./pages/OfflineLibrary"

// Components
import AppLayout from "./components/AppLayout"
import { JamManager } from "./components/JamManager"
import BackButtonHandler from "./components/BackButtonHandler"
import NotificationPermissionHandler from "./components/NotificationPermissionHandler"
import DeepLinkHandler from "./components/DeepLinkHandler"
import ThemeController from "./components/ThemeController"

const queryClient = new QueryClient()

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

// Redirects authenticated users away from the login page
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" richColors />
        <JamManager />
        <BrowserRouter>
          <ThemeController />
          <BackButtonHandler />
          <NotificationPermissionHandler />
          <DeepLinkHandler />
          <Routes>
            {/* Public Auth Route */}
            <Route
              path="/auth"
              element={
                <PublicOnlyRoute>
                  <Auth />
                </PublicOnlyRoute>
              }
            />

            {/* Protected Main Layout Wrapper */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/request" element={<RequestSong />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />

              <Route path="/library" element={<Library />}>
                <Route path="liked" element={<LikedSongs />} />
                <Route path="playlists" element={<Playlists />} />
                <Route path="recent" element={<RecentSongs />} />
                <Route path="offline" element={<OfflineLibrary />} />
              </Route>

              <Route path="/genre/:genre" element={<GenrePage />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/album/:name" element={<AlbumPage />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artist/:name" element={<ArtistPage />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/jam" element={<Jam />} />
              <Route path="/capsule" element={<CapsulePage />} />
            </Route>

            {/* Public 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
