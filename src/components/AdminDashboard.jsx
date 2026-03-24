import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  isAdminLoggedIn, getAwards, addNominee, deleteNominee, getNominees,
  addAward, updateAward, deleteAward 
} from '../utils/storage';
import { 
  PlusCircle, ShieldCheck, Trash2, Edit2, Check, X, 
  Settings, Users, Award as AwardIcon, Image as ImageIcon
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('awards'); // 'awards' or 'nominees'
  
  // Data State
  const [awards, setAwards] = useState([]);
  const [allNominees, setAllNominees] = useState([]);
  
  // Award Form State
  const [editingAwardId, setEditingAwardId] = useState(null);
  const [awardName, setAwardName] = useState('');
  const [awardDescription, setAwardDescription] = useState('');
  
  // Nominee Form State
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
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Award Actions ---
  const handleAwardSubmit = (e) => {
    e.preventDefault();
    if (!awardName.trim()) return;

    if (editingAwardId) {
      updateAward(editingAwardId, { name: awardName, description: awardDescription });
      showToast('Award updated successfully!');
      setEditingAwardId(null);
    } else {
      addAward(awardName, awardDescription);
      showToast('New award category added!');
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
    if (window.confirm('Are you sure? This will also delete all nominees and votes for this category.')) {
      deleteAward(id);
      showToast('Award category deleted.');
      refreshData();
    }
  };

  // --- Nominee Actions ---
  const handleNomineeSubmit = (e) => {
    e.preventDefault();
    if (!selectedAward || !nomineeName.trim()) return;

    addNominee(selectedAward, nomineeName, imageUrl);
    showToast(`Successfully added ${nomineeName}!`);
    setNomineeName('');
    setImageUrl('');
    refreshData();
  };

  const handleDeleteNominee = (id) => {
    if (window.confirm('Are you sure you want to delete this nominee?')) {
      deleteNominee(id);
      showToast('Nominee removed.');
      refreshData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-dark-800 rounded-xl border border-dark-700">
          <button 
            onClick={() => setActiveTab('awards')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'awards' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            <AwardIcon className="w-4 h-4" />
            <span>Manage Awards</span>
          </button>
          <button 
            onClick={() => setActiveTab('nominees')}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all ${activeTab === 'nominees' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Nominees</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-8 flex items-center space-x-2 animate-slide-up">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-1 space-y-8">
          {activeTab === 'awards' ? (
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-primary-500" />
                <span>{editingAwardId ? 'Edit Award' : 'Add New Award'}</span>
              </h2>
              <form onSubmit={handleAwardSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={awardName} 
                    onChange={e => setAwardName(e.target.value)} 
                    placeholder="e.g. Best Visual Effects" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                  <textarea 
                    className="input-field min-h-[100px] resize-none" 
                    value={awardDescription} 
                    onChange={e => setAwardDescription(e.target.value)} 
                    placeholder="Brief description..."
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button type="submit" className="btn-primary flex-1">
                    {editingAwardId ? 'Update' : 'Add Award'}
                  </button>
                  {editingAwardId && (
                    <button 
                      type="button" 
                      onClick={cancelEditAward}
                      className="p-2 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-primary-500" />
                <span>Add Nominee</span>
              </h2>
              <form onSubmit={handleNomineeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select 
                    className="input-field appearance-none" 
                    value={selectedAward} 
                    onChange={e => setSelectedAward(e.target.value)} 
                    required
                  >
                    {awards.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={nomineeName} 
                    onChange={e => setNomineeName(e.target.value)} 
                    placeholder="e.g. Inception" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)} 
                    placeholder="https://..." 
                  />
                </div>
                <button type="submit" className="btn-primary w-full mt-2">
                  Add Nominee
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: List & Management */}
        <div className="lg:col-span-2">
          {activeTab === 'awards' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Award Categories</h2>
              {awards.length === 0 ? (
                <div className="text-center py-20 card border-dashed border-dark-700">
                  <p className="text-slate-400">No awards created yet.</p>
                </div>
              ) : (
                awards.map(award => (
                  <div key={award.id} className="card group hover:border-primary-500/30 transition-all flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                        {award.name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-1">{award.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => startEditAward(award)}
                        className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAward(award.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Existing Nominees</h2>
              {allNominees.length === 0 ? (
                <div className="text-center py-20 card border-dashed border-dark-700">
                  <p className="text-slate-400">No nominees added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allNominees.map(nominee => {
                    const award = awards.find(a => a.id === nominee.awardId);
                    return (
                      <div key={nominee.id} className="card p-4 flex items-center space-x-4 group">
                        <div className="w-12 h-12 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {nominee.imageUrl ? (
                            <img src={nominee.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-dark-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-200 truncate">{nominee.name}</h3>
                          <p className="text-xs text-primary-500 font-medium truncate">
                            {award ? award.name : 'Unknown Category'}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteNominee(nominee.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
