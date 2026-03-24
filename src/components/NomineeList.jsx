import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAwardById, getNominees, voteForNominee, hasVoted } from '../utils/storage';
import { ArrowLeft, CheckCircle2, User } from 'lucide-react';

const NomineeList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [award, setAward] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const currentAward = getAwardById(id);
    if (!currentAward) {
      navigate('/');
      return;
    }
    setAward(currentAward);
    setNominees(getNominees(id));
    setUserHasVoted(hasVoted(id));
  }, [id, navigate]);

  const handleVote = (nomineeId) => {
    if (userHasVoted) return;

    try {
      voteForNominee(nomineeId, id);
      setNominees(getNominees(id));
      setUserHasVoted(true);
      setToastMessage('Vote cast successfully!');
      
      // Clear toast after 3s
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setToastMessage(err.message || 'Error occurred');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  if (!award) return <div className="text-center p-12 text-slate-400">Loading...</div>;

  return (
    <div className="animate-fade-in relative pb-16">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Awards</span>
      </button>

      <div className="mb-10 block">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {award.name}
        </h1>
        <p className="text-slate-400">{award.description}</p>
        
        {userHasVoted && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>You have cast your vote for this category</span>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-2 z-50 animate-slide-up">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {nominees.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dark-700 border-dashed">
          <p className="text-xl text-slate-400">No nominees yet for this category.</p>
          <p className="text-sm text-dark-500 mt-2">Check back later when nominees are announced!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nominees.map((nominee, index) => (
            <div 
              key={nominee.id} 
              className="card flex flex-col justify-between"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <div className="aspect-square w-full rounded-xl bg-dark-900 overflow-hidden mb-4 relative ring-1 ring-dark-700/50 group flex items-center justify-center">
                  {nominee.imageUrl ? (
                    <img 
                      src={nominee.imageUrl} 
                      alt={nominee.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <User className="w-20 h-20 text-dark-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-1">{nominee.name}</h3>
                <p className="text-sm font-medium text-slate-400 mb-6 border-b border-dark-700/50 pb-4">
                  Votes: <span className="text-white bg-dark-700 px-2 py-0.5 rounded-md ml-1">{nominee.votes}</span>
                </p>
              </div>
              
              <button
                onClick={() => handleVote(nominee.id)}
                disabled={userHasVoted}
                className="btn-primary w-full flex items-center justify-center space-x-2 mt-auto"
              >
                {userHasVoted ? (
                  <span>Voted</span>
                ) : (
                  <span>Vote for {nominee.name}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NomineeList;
