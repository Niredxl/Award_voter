import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAwards } from '../utils/storage';
import { ChevronRight } from 'lucide-react';

const AwardList = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    setAwards(getAwards());
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      

      {/* Award Cards */}
      <div className="space-y-3">
        {awards.map((award, index) => (
          <Link 
            to={`/award/${award.id}`} 
            key={award.id}
            className="block group"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between transition-all duration-200 active:scale-[0.98]">
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  {award.name}
                </h2>
                <p className="text-sm text-white/40 mt-0.5 truncate">
                  {award.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 ml-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AwardList;
