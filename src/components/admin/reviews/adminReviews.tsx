'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from '../deleteConfirmModal';
import useFetchReviews from '@/hooks/useFetchReviews';
import useApproveReview from '@/hooks/useApproveReview';
import useDeleteReview from '@/hooks/useDeleteReview';

export default function AdminReviews() {
  const { reviews, loading, refresh } = useFetchReviews();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  const handleApproveToggle = async (rev: any) => {
    const { error } = await approveReview(rev.id, !rev.approved);
    if (error) {
      toast.error('Failed to update');
      await refresh();
    } else {
      toast.success(!rev.approved ? 'Review approved' : 'Review unapproved');
      await refresh();
    }
  };

  const confirmDelete = (rev: any) => {
    setSelectedReview(rev);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    const { error } = await deleteReview(selectedReview.id);
    if (error) {
      toast.error('Failed to delete review');
      await refresh();
    } else {
      toast.success('Review deleted successfully');
      await refresh();
    }
    setShowDeleteModal(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Rating
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Review
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Sub Name
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Approved
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((rev) => (
                <tr
                  key={rev.id}
                  className={!rev.approved ? 'bg-yellow-50' : undefined}
                >
                  <td className="px-3 py-2 whitespace-nowrap">{rev.name}</td>
                  <td className="px-3 py-2">⭐ {rev.rating}</td>
                  <td className="px-3 py-2 max-w-sm break-words">{rev.review}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{rev.category}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{rev.item_id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {rev.approved ? 'Yes' : 'No'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleApproveToggle(rev)}
                      className="text-emerald-600 hover:underline"
                    >
                      {rev.approved ? 'Unapprove' : 'Approve'}
                    </button>
                    <button
                      onClick={() => confirmDelete(rev)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedReview?.name || 'this review'}
        />
      )}
    </div>
  );
}