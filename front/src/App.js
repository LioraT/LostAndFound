import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./api/ProtectedRoute";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./user_pages/Login";
import Register from "./user_pages/Register";
import ItemsList from './pages/Items/ItemsList';
import About from "./pages/About";
import Profile from "./user_pages/Profile";
import ChangePassword from "./user_pages/ChangePassword";
import EditUser from "./user_pages/EditUser";
import UserSearch from "./user_pages/UserSearch";
import NotFound from "./base_pages/NotFound";

import MapToolsPage from "./pages/MapToolsPage";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public inside layout */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected inside layout */}
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="change_password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />  

          <Route
            path="edit-user/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="search_users"
            element={
              <ProtectedRoute>
                <UserSearch />
              </ProtectedRoute>
            }
          />
           
          <Route 
            path="map-tools" 
            element= {
              <ProtectedRoute>
              <MapToolsPage />
              </ProtectedRoute>
            } 
          />

          <Route
            path="items"
            element={
              <ProtectedRoute>
                <ItemsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Catch-all inside layout */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
                                      
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
