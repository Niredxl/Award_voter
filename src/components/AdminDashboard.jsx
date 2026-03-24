import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAdminLoggedIn, getAwards, addNominee, deleteNominee, getNominees,
  addAward, updateAward, deleteAward 
} from '../utils/storage';
import { 
  PlusCircle, Trash2, Edit2, Check, X, 
  Users, Award as AwardIcon, Image as ImageIcon
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('awards');
  
  const [awards, setAwards] = useState([]);
  const [allNominees, setAllNominees] = useState([]);
  
  // Award Form
  const [editingAwardId, setEditingAwardId] = useState(null);
  const [awardName, setAwardName] = useState('');
  const [awardDescription, setAwardDescription] = useState('');
  
  // Nominee Form
  const [selectedAward, setSelectedAward] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    const awardsList = getAwards();
    setAwards(awardsList);
    setAllNominees(getNominees());
    if (awardsList.length > 0 && !selectedAward) {
      setSelectedAward(awardsList[0].id);
    }
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // --- Award Actions ---
  const handleAwardSubmit = (e) => {
    e.preventDefault();
    if (!awardName.trim()) return;

    if (editingAwardId) {
      updateAward(editingAwardId, { name: awardName, description: awardDescription });
      showToast('Award updated.');
      setEditingAwardId(null);
    } else {
      addAward(awardName, awardDescription);
      showToast('Award created.');
    }
    
    setAwardName('');
    setAwardDescription('');
    refreshData();
  };

  const startEditAward = (award) => {
    setEditingAwardId(award.id);
    setAwardName(award.name);
    setAwardDescription(award.description);
  };

  const cancelEditAward = () => {
    setEditingAwardId(null);
    setAwardName('');
    setAwardDescription('');
  };

  const handleDeleteAward = (id) => {
    if (window.confirm('Delete this award and all its nominees?')) {
      deleteAward(id);
      showToast('Award deleted.');
      refreshData();
    }
  };

  // --- Nominee Actions ---
  const handleNomineeSubmit = (e) => {
    e.preventDefault();
    if (!selectedAward || !nomineeName.trim()) return;

    addNominee(selectedAward, nomineeName, imageUrl);
    showToast(`${nomineeName} added.`);
    setNomineeName('');
    setImageUrl('');
    refreshData();
  };

  const handleDeleteNominee = (id) => {
    if (window.confirm('Remove this nominee?')) {
      deleteNominee(id);
      showToast('Nominee removed.');
      refreshData();
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-white mb-6">
        Admin Dashboard
      </h1>

      {/* Segmented Control */}
      <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/10">
        <button 
          onClick={() => setActiveTab('awards')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'awards' 
              ? 'bg-white/15 text-white shadow-sm' 
              : 'text-white/40'
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>Awards</span>
        </button>
        <button 
          onClick={() => setActiveTab('nominees')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'nominees' 
              ? 'bg-white/15 text-white shadow-sm' 
              : 'text-white/40'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Nominees</span>
        </button>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-xl mb-5 flex items-center space-x-2 font-medium animate-slide-up">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">
              {editingAwardId ? 'Edit Award' : 'New Award'}
            </h2>
            <form onSubmit={handleAwardSubmit} className="space-y-3">
              <input 
                type="text" 
                className="input-field" 
                value={awardName} 
                onChange={e => setAwardName(e.target.value)} 
                placeholder="Award name" 
                required 
              />
              <textarea 
                className="input-field min-h-[80px] resize-none" 
                value={awardDescription} 
                onChange={e => setAwardDescription(e.target.value)} 
                placeholder="Description (optional)"
              />
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1 py-2.5">
                  {editingAwardId ? 'Save Changes' : 'Add Award'}
                </button>
                {editingAwardId && (
                  <button 
                    type="button" 
                    onClick={cancelEditAward}
                    className="btn-secondary px-4 py-2.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-2">
            {awards.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">
                No awards created yet.
              </div>
            ) : (
              awards.map(award => (
                <div key={award.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between group">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">{award.name}</h3>
                    <p className="text-xs text-white/30 truncate mt-0.5">{award.description}</p>
                  </div>
                  <div className="flex space-x-1 ml-3">
                    <button 
                      onClick={() => startEditAward(award)}
                      className="p-2 text-white/30 hover:text-apple-blue rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteAward(award.id)}
                      className="p-2 text-white/30 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Nominees Tab */}
      {activeTab === 'nominees' && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Add Nominee</h2>
            <form onSubmit={handleNomineeSubmit} className="space-y-3">
              <select 
                className="input-field appearance-none" 
                value={selectedAward} 
                onChange={e => setSelectedAward(e.target.value)} 
                required
              >
                {awards.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input 
                type="text" 
                className="input-field" 
                value={nomineeName} 
                onChange={e => setNomineeName(e.target.value)} 
                placeholder="Nominee name" 
                required 
              />
              <input 
                type="url" 
                className="input-field" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)} 
                placeholder="Image URL (optional)" 
              />
              <button type="submit" className="btn-primary w-full py-2.5">
                Add Nominee
              </button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-2">
            {allNominees.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">
                No nominees added yet.
              </div>
            ) : (
              allNominees.map(nominee => {
                const award = awards.find(a => a.id === nominee.awardId);
                return (
                  <div key={nominee.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {nominee.imageUrl ? (
                        <img src={nominee.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{nominee.name}</h3>
                      <p className="text-xs text-apple-blue truncate">
                        {award ? award.name : 'Unknown'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteNominee(nominee.id)}
                      className="p-2 text-white/20 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
