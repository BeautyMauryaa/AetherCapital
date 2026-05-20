import { create } from 'zustand';
import API from "../services/api.js";
const BASE_URL = import.meta.env.VITE_API_URL || 'https://aethercapital.onrender.com/api';

export const useAdminStore = create((set, get) => ({
  submissions:  [],
  stats:        null,
  loading:      false,
  statsLoading: false,
  error:        null,
  searchQuery:  '',
  selectedSubmission: null,

  // ── Search ────────────────────────────────────────────────────────────────
  setSearch: (q) => {
    set({ searchQuery: q });
  },

  setSelected: (s) => set({ selectedSubmission: s }),

  // ── Fetch all submissions 
  fetchSubmissions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { status, search, page = 1, limit = 50 } = params;
      const qs = new URLSearchParams();
      if (status && status !== 'all') qs.set('status', status);
      if (search) qs.set('search', search);
      qs.set('page',  String(page));
      qs.set('limit', String(limit));

      const res  = await fetch(`${BASE_URL}/admin/submissions?${qs}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch');

      set({
        submissions: data.data?.submissions || [],
        loading:     false,
      });
    } catch (err) {
      console.error('fetchSubmissions error:', err.message);
      set({ loading: false, error: err.message });
    }
  },

  // ── Fetch stats ────────────────────────────────────────────────────────────
  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const res  = await fetch(`${BASE_URL}/admin/stats`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
      set({ stats: data.data, statsLoading: false });
    } catch (err) {
      console.error('fetchStats error:', err.message);
      set({ statsLoading: false });
    }
  },

  // ── Fetch single submission ────────────────────────────────────────────────
  fetchSubmission: async (id) => {
    set({ loading: true });
    try {
      const res  = await fetch(`${BASE_URL}/admin/submissions/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Not found');
      set({ selectedSubmission: data.data?.submission, loading: false });
      return data.data?.submission;
    } catch (err) {
      console.error('fetchSubmission error:', err.message);
      set({ loading: false });
      return null;
    }
  },

  // ── Update status (approve / reject / under_review) ───────────────────────
 updateStatus: async (id, status, note = "") => {

  try {

    const response = await API.patch(
      `/admin/submissions/${id}/status`,
      {
        status,
        reviewNote: note,
      }
    );

    const updatedSubmission = response.data.data?.submission;

    set((state) => ({
      submissions: state.submissions.map((item) =>
        item._id === id
          ? updatedSubmission
          : item
      ),
    }));

    return {
      success: true,
      submission: updatedSubmission,
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: error.response?.data?.message || "Failed",
    };

  }

},

  // ── Derived getters (for backward-compat with existing UI) ────────────────
  getStats: () => {
    const subs = get().submissions;
    // Use real stats if available, else derive from loaded submissions
    const realStats = get().stats;
    if (realStats) return {
      total:    realStats.total,
      pending:  realStats.pending + (realStats.underReview || 0),
      approved: realStats.approved,
      rejected: realStats.rejected,
      highRisk: realStats.highRisk,
    };
    return {
      total:    subs.length,
      pending:  subs.filter(s => s.status === 'submitted' || s.status === 'under_review').length,
      approved: subs.filter(s => s.status === 'approved').length,
      rejected: subs.filter(s => s.status === 'rejected').length,
      highRisk: subs.filter(s => s.riskScore >= 60).length,
    };
  },

  getFiltered: (status, query) => {
    const subs = get().submissions;
    return subs.filter((s) => {
      const matchStatus = !status || s.status === status;
      const name = `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase();
      const matchQuery = !query || name.includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  },
}));
