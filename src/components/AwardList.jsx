import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAwards } from '../utils/storage';
import { ChevronRight, Award } from 'lucide-react';

const AwardList = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    setAwards(getAwards());
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Vote for Excellence
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Select an award category below to view the nominees and cast your vote. Make your voice count in the Golden Gala Awards!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map((award, index) => (
          <Link 
            to={`/award/${award.id}`} 
            key={award.id}
            className="group block"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card h-full flex flex-col justify-between group-hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-dark-700/50 rounded-lg text-primary-400 group-hover:text-primary-300 transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">
                  {award.name}
                </h2>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  {award.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-dark-700/50 flex justify-end">
                <span className="text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors">
                  View Nominees →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AwardList;
