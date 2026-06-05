/**
 * Application router configuration.
 *
 * Defines all routes within the DashboardLayout:
 * - / → Incident List (Investigations)
 * - /dashboard → Mission Control
 * - /incidents/new → Create Investigation
 * - /incidents/:id → Investigation Detail
 * - /knowledge → Knowledge Base
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import IncidentListPage from '../pages/IncidentListPage';
import CreateIncidentPage from '../pages/CreateIncidentPage';
import IncidentDetailPage from '../pages/IncidentDetailPage';
import { DashboardPage } from '../pages/DashboardPage';
import KnowledgeBasePage from '../pages/KnowledgeBasePage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<IncidentListPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/incidents/new" element={<CreateIncidentPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
