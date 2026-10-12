import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DocumentViewerModal from './components/DocumentViewerModal';

import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import SearchPage from './pages/SearchPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AlgorithmPage from './pages/AlgorithmPage';
import ComparisonPage from './pages/ComparisonPage';
import AboutPage from './pages/AboutPage';

import { fetchStatistics, fetchDocuments, buildIndex } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [modalState, setModalState] = useState({ open: false, docName: '', query: '', resultData: null });

  const refreshData = async () => {
    try {
      const [s, docs] = await Promise.all([
        fetchStatistics(),
        fetchDocuments()
      ]);
      setStats(s);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to fetch stats/docs:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleBuildIndex = async () => {
    try {
      await buildIndex();
      await refreshData();
    } catch (err) {
      console.error('Failed to build index:', err);
    }
  };

  const handleOpenDocumentModal = (docName, query = '', resultData = null) => {
    setModalState({ open: true, docName, query, resultData });
  };

  const handleCloseDocumentModal = () => {
    setModalState({ open: false, docName: '', query: '', resultData: null });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage stats={stats} setActiveTab={setActiveTab} onBuildIndex={handleBuildIndex} />;
      case 'documents':
        return (
          <DocumentsPage 
            documents={documents} 
            stats={stats} 
            onRefresh={refreshData} 
            onBuildIndex={handleBuildIndex}
            onOpenDocument={(docName) => handleOpenDocumentModal(docName)} 
          />
        );
      case 'build':
        return (
          <DocumentsPage 
            documents={documents} 
            stats={stats} 
            onRefresh={refreshData} 
            onBuildIndex={handleBuildIndex}
            onOpenDocument={(docName) => handleOpenDocumentModal(docName)} 
          />
        );
      case 'search':
        return (
          <SearchPage 
            onOpenDocumentModal={handleOpenDocumentModal} 
            isIndexBuilt={stats?.is_built} 
          />
        );
      case 'analytics':
        return <AnalyticsPage />;
      case 'algorithm':
        return <AlgorithmPage />;
      case 'comparison':
        return <ComparisonPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage stats={stats} setActiveTab={setActiveTab} onBuildIndex={handleBuildIndex} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-wrapper">
        <Navbar activeTab={activeTab} stats={stats} onRebuild={handleBuildIndex} />
        <main className="page-content">
          {renderActivePage()}
        </main>
      </div>

      {modalState.open && (
        <DocumentViewerModal 
          docName={modalState.docName}
          query={modalState.query}
          resultData={modalState.resultData}
          onClose={handleCloseDocumentModal}
        />
      )}
    </div>
  );
}
