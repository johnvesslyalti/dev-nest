import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { CreatePost } from './pages/CreatePost';
import { useAuth } from './context/AuthContext';

import { LoadingSpinner } from './components/RightSidebar';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return (
      <div className="flex h-[50vh] items-center justify-center">
          <LoadingSpinner />
      </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

function App() {
  return (
    <>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'bg-primary text-white',
          style: {
            background: '#1d9bf0',
            color: '#fff',
            borderRadius: '9999px',
          },
        }}
      />
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } /> 
          <Route path="profile/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
