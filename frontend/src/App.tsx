import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { CreatePost } from './pages/CreatePost';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { Projects } from './pages/Projects';
import { Notifications } from './pages/Notifications';
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

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    if (isLoading) return <LoadingSpinner />;
    if (user) return <Navigate to="/feed" replace />;
    return children;
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'bg-charcoal text-white',
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/" element={
           user ? <Navigate to="/feed" replace /> : <Landing />
        } />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        
        {/* Main App Routes - Wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/feed" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } /> 
          <Route path="/explore" element={<Explore />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/community" element={<Navigate to="/explore" replace />} /> {/* Placeholder */}
          <Route path="/learn" element={<Navigate to="/explore" replace />} /> {/* Placeholder */}
          
          <Route path="/profile/:username" element={<Profile />} />
          
          <Route path="/create-post" element={
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
