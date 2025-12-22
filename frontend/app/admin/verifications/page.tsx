'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { CheckCircle, XCircle, Clock, Eye, FileText, User, Calendar, GraduationCap, Shield } from 'lucide-react';

interface UserWithVerification {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  student_verification_status?: 'pending' | 'verified' | 'rejected' | 'none';
  university_name?: string;
  student_id_number?: string;
  graduation_year?: string;
  major?: string;
  student_id_document?: string;
  enrollment_letter?: string;
  sheerid_verified?: boolean;
  verification_submitted_at?: string;
  verification_reviewed_at?: string;
  manual_review_notes?: string;
}

export default function AdminVerificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [allUsers, setAllUsers] = useState<UserWithVerification[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithVerification[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithVerification | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; url: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if user is admin
    if (!user?.is_admin) {
      alert('⛔ Access Denied: Admin privileges required');
      router.push('/');
      return;
    }

    // Load all users from localStorage
    loadUsers();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Filter users based on selected status
    if (filterStatus === 'all') {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(
        allUsers.filter(u => u.student_verification_status === filterStatus)
      );
    }
  }, [filterStatus, allUsers]);

  const loadUsers = () => {
    try {
      const usersJson = localStorage.getItem('nestquarter_users');
      if (usersJson) {
        const users: UserWithVerification[] = JSON.parse(usersJson);
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleApprove = (userId: number) => {
    try {
      const usersJson = localStorage.getItem('nestquarter_users');
      if (!usersJson) return;

      const users: UserWithVerification[] = JSON.parse(usersJson);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) return;

      // Update user verification status
      users[userIndex] = {
        ...users[userIndex],
        student_verification_status: 'verified',
        verification_reviewed_at: new Date().toISOString(),
        manual_review_notes: reviewNotes || 'Approved by admin',
      };

      localStorage.setItem('nestquarter_users', JSON.stringify(users));

      // Reload users
      loadUsers();
      setSelectedUser(null);
      setReviewNotes('');

      alert(`✅ Verified ${users[userIndex].first_name} ${users[userIndex].last_name} as a student`);
    } catch (error) {
      console.error('Failed to approve verification:', error);
      alert('Failed to approve verification');
    }
  };

  const handleReject = (userId: number) => {
    if (!reviewNotes) {
      alert('⚠️ Please provide a reason for rejection in the review notes');
      return;
    }

    try {
      const usersJson = localStorage.getItem('nestquarter_users');
      if (!usersJson) return;

      const users: UserWithVerification[] = JSON.parse(usersJson);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) return;

      // Update user verification status
      users[userIndex] = {
        ...users[userIndex],
        student_verification_status: 'rejected',
        verification_reviewed_at: new Date().toISOString(),
        manual_review_notes: reviewNotes,
      };

      localStorage.setItem('nestquarter_users', JSON.stringify(users));

      // Reload users
      loadUsers();
      setSelectedUser(null);
      setReviewNotes('');

      alert(`❌ Rejected ${users[userIndex].first_name} ${users[userIndex].last_name}'s verification`);
    } catch (error) {
      console.error('Failed to reject verification:', error);
      alert('Failed to reject verification');
    }
  };

  const viewDocument = (type: string, url: string) => {
    setSelectedDocument({ type, url });
    setShowDocumentModal(true);
  };

  const pendingCount = allUsers.filter(u => u.student_verification_status === 'pending').length;
  const verifiedCount = allUsers.filter(u => u.student_verification_status === 'verified').length;
  const rejectedCount = allUsers.filter(u => u.student_verification_status === 'rejected').length;

  if (!user?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-rose-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Student Verifications
              </h1>
              <p className="text-gray-600 mt-1">Admin Dashboard - Review and approve student verifications</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{allUsers.length}</p>
              </div>
              <User className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-700 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-emerald-600">{verifiedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-700 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              filterStatus === 'all'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({allUsers.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              filterStatus === 'pending'
                ? 'bg-amber-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              filterStatus === 'verified'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              filterStatus === 'rejected'
                ? 'bg-red-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Verifications List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow-md p-12 text-center">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No verifications found for this filter</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`bg-white rounded-xl shadow-md p-6 border-2 ${
                  user.student_verification_status === 'pending'
                    ? 'border-amber-200'
                    : user.student_verification_status === 'verified'
                    ? 'border-emerald-200'
                    : user.student_verification_status === 'rejected'
                    ? 'border-red-200'
                    : 'border-gray-200'
                }`}
              >
                {/* User Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    {user.student_verification_status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                    {user.student_verification_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                    {user.student_verification_status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* University Info */}
                {user.university_name && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-700">University:</span>
                      <span className="text-gray-900">{user.university_name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">ID: </span>
                        <span className="text-gray-900 font-medium">{user.student_id_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grad: </span>
                        <span className="text-gray-900 font-medium">{user.graduation_year}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Major: </span>
                      <span className="text-gray-900 font-medium">{user.major}</span>
                    </div>
                    {user.sheerid_verified && (
                      <div className="pt-2 border-t border-gray-200">
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          SheerID Verified
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Documents */}
                {(user.student_id_document || user.enrollment_letter) && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                    <div className="flex gap-2">
                      {user.student_id_document && (
                        <button
                          onClick={() => viewDocument('Student ID', user.student_id_document!)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                          Student ID
                        </button>
                      )}
                      {user.enrollment_letter && (
                        <button
                          onClick={() => viewDocument('Enrollment Letter', user.enrollment_letter!)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                          Enrollment Letter
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                {user.verification_submitted_at && (
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Submitted: {new Date(user.verification_submitted_at).toLocaleString()}
                    </div>
                    {user.verification_reviewed_at && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Reviewed: {new Date(user.verification_reviewed_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Review Notes */}
                {user.manual_review_notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-gray-900">{user.manual_review_notes}</p>
                  </div>
                )}

                {/* Actions - Only for pending verifications */}
                {user.student_verification_status === 'pending' && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-medium transition"
                    >
                      Review Verification
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Review Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review Verification - {selectedUser.first_name} {selectedUser.last_name}
                </h2>

                {/* User Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="text-gray-900 font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Student ID</p>
                      <p className="text-gray-900 font-medium">{selectedUser.student_id_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">University</p>
                      <p className="text-gray-900 font-medium">{selectedUser.university_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Major</p>
                      <p className="text-gray-900 font-medium">{selectedUser.major}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Graduation Year</p>
                      <p className="text-gray-900 font-medium">{selectedUser.graduation_year}</p>
                    </div>
                    {selectedUser.sheerid_verified && (
                      <div>
                        <p className="text-gray-600">SheerID Status</p>
                        <p className="text-emerald-600 font-semibold">✓ Verified</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-gray-900"
                    placeholder="Add notes about this verification (required for rejection)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedUser.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setReviewNotes('');
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Modal */}
        {showDocumentModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedDocument.type}</h3>
                  <button
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedDocument(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={selectedDocument.url}
                  alt={selectedDocument.type}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
