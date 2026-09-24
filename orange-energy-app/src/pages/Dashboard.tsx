import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FileText, Clock, RefreshCw, TrendingUp } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { getAllLocalDrafts } from '../db/indexedDB';
import { syncEngine } from '../services/syncEngine';
import type { EnergySubscription } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<EnergySubscription[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const loadLocalData = async () => {
    try {
      const list = await getAllLocalDrafts();
      setDrafts(list || []);
    } catch (err) {
      console.error("Error loading local drafts:", err);
    }
  };

  useEffect(() => {
    loadLocalData();
    const unsubscribe = syncEngine.subscribe((status: { syncing: boolean; pendingCount: number }) => {
      setSyncing(status.syncing);
      if (!status.syncing) loadLocalData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    setSyncResult(null);
    const result = await syncEngine.triggerSync();
    setSyncResult(`Synced ${result.successCount} record(s). ${result.failedCount ? `Failed: ${result.failedCount}` : ''}`);
    await loadLocalData();
  };

  const handleNewSubscription = (draftId?: string) => {
    console.log("Navigating to subscription form...", draftId);
    navigate('/new-subscription', { state: draftId ? { draftId } : undefined });
  };

  const pendingSyncCount = drafts.filter(
    d => d.syncStatus === 'READY_FOR_SYNC' || d.syncStatus === 'SYNC_FAILED'
  ).length;

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Orange Energy Field Terminal</span>
            <h1 className="text-2xl font-black tracking-tight mt-1">Agent Operations Dashboard</h1>
            <p className="text-xs text-slate-300 mt-1">V4 Customer Contract Lifecycle & Offline Synchronization Manager</p>
          </div>
          <button
            onClick={() => handleNewSubscription()}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-black rounded-xl shadow-md flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            <span>New Subscription Form</span>
          </button>
        </div>

        {/* Sync Status Banner */}
        {pendingSyncCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  {pendingSyncCount} Contract(s) Saved Locally Pending Server Upload
                </p>
                <p className="text-[11px] text-amber-700">Records will sync automatically when network connects.</p>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        )}

        {syncResult && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-xl">
            {syncResult}
          </div>
        )}

        {/* Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Submissions</span>
            <p className="text-2xl font-black text-slate-900 mt-1">12</p>
            <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-extrabold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+20% vs yesterday</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Total</span>
            <p className="text-2xl font-black text-slate-900 mt-1">148</p>
            <div className="flex items-center space-x-1 text-emerald-600 text-[11px] font-extrabold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+11.6% vs last month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Local Offline Drafts</span>
            <p className="text-2xl font-black text-orange-600 mt-1">{drafts.length}</p>
            <span className="text-[11px] font-medium text-slate-400 block mt-2">Saved on this device</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Approval Rate</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">98.4%</p>
            <span className="text-[11px] font-medium text-slate-400 block mt-2">Back-office verified</span>
          </div>
        </div>

        {/* Active Drafts Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Local Work in Progress</h2>
            <button 
              onClick={loadLocalData} 
              className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Table</span>
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No active offline drafts found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "New Subscription Form" to begin customer registration.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Customer Name</th>
                    <th className="pb-3">Selected Kit Offer</th>
                    <th className="pb-3">Sync Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drafts.map((draft) => (
                    <tr key={draft.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-bold text-slate-800">
                        {draft.customerInformation?.customerName || 'Unnamed Draft'}
                      </td>
                      <td className="py-3 text-slate-600">
                        {draft.selectedOfferSnapshot?.name || 'Offer Pending'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          draft.syncStatus === 'SYNCED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {draft.syncStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleNewSubscription(draft.id)}
                          className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Resume Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};