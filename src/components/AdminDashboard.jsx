import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, getAwards, addNominee } from '../utils/storage';
import { PlusCircle, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState([]);
  
  // Form State
  const [selectedAward, setSelectedAward] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
      return;
    }
    const awardsList = getAwards();
    setAwards(awardsList);
    if (awardsList.length > 0) {
      setSelectedAward(awardsList[0].id);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAward || !nomineeName.trim()) return;

    try {
      addNominee(selectedAward, nomineeName, imageUrl);
      setSuccessMsg(`Successfully added ${nomineeName} to the award category!`);
      setNomineeName('');
      setImageUrl('');
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert("Error adding nominee");
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in relative">
      <div className="flex items-center space-x-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="card">
        <div className="mb-6 border-b border-dark-700/50 pb-4">
          <h2 className="text-xl font-semibold text-slate-200">Add New Nominee</h2>
          <p className="text-sm text-slate-400 mt-1">
            Create a new nominee profile. The changes will instantly clear through to the user-facing pages.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg mb-6 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Award Category <span className="text-red-500">*</span>
            </label>
            <select
              className="input-field appearance-none"
              value={selectedAward}
              onChange={(e) => setSelectedAward(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {awards.map((award) => (
                <option key={award.id} value={award.id}>
                  {award.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nominee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              placeholder="e.g. Leonardo DiCaprio"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              className="input-field"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>Add Nominee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
