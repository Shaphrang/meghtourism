'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BlogFormModal from './blogFormModal';
import DeleteConfirmModal from '../deleteConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    setBlogs(data || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const confirmDelete = (blog: any) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedBlog) {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', selectedBlog.id);
      if (!error) {
        toast.success('Blog deleted');
        fetchBlogs();
      } else {
        toast.error('Failed to delete');
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + Add Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-600">By {blog.author}</p>
              <p className="text-sm text-gray-500 italic">{blog.published_at}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEditModal(blog)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(blog)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <BlogFormModal
          initialData={editingBlog}
          onClose={() => setShowModal(false)}
          onSave={fetchBlogs}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          itemName={selectedBlog?.title || 'this blog'}
        />
      )}
    </div>
  );
}