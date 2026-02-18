import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Project } from '../../types';
import { LanguageProvider } from '../../contexts/LanguageContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ProjectEditor from './ProjectEditor';
import { Loader2 } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEditProject = (project: Project | null) => {
    setEditingProject(project);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingProject(null);
  };

  const handleSaveProject = () => {
    setShowEditor(false);
    setEditingProject(null);
    // Dashboard will refresh automatically
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FACC15] animate-spin" />
      </div>
    );
  }

  return (
    <LanguageProvider>
      {!isAuthenticated ? (
        <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <AdminDashboard
            onLogout={handleLogout}
            onEditProject={handleEditProject}
          />

          {showEditor && (
            <ProjectEditor
              project={editingProject}
              onClose={handleCloseEditor}
              onSave={handleSaveProject}
            />
          )}
        </>
      )}
    </LanguageProvider>
  );
};

export default AdminPanel;
