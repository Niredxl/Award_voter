// Initial data seeding
const INITIAL_AWARDS = [
  { id: '1', name: 'Best Movie', description: 'The most outstanding film of the year.' },
  { id: '2', name: 'Best Actor', description: 'Outstanding performance by an actor in a leading role.' },
  { id: '3', name: 'Best Director', description: 'Outstanding achievement in directing a film.' },
  { id: '4', name: 'Best Original Score', description: 'The best musical composition written specifically for a film.' },
];

// Initialize storage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem('awards')) {
    localStorage.setItem('awards', JSON.stringify(INITIAL_AWARDS));
  }
  if (!localStorage.getItem('nominees')) {
    localStorage.setItem('nominees', JSON.stringify([]));
  }
  if (!localStorage.getItem('userVotes')) {
    localStorage.setItem('userVotes', JSON.stringify({}));
  }
};

export const getAwards = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('awards'));
};

export const getAwardById = (id) => {
  const awards = getAwards();
  return awards.find(a => a.id === id);
};

export const getNominees = (awardId) => {
  initializeStorage();
  const allNominees = JSON.parse(localStorage.getItem('nominees'));
  return allNominees.filter(n => n.awardId === awardId);
};

export const addNominee = (awardId, name, imageUrl) => {
  initializeStorage();
  const nominees = JSON.parse(localStorage.getItem('nominees'));
  const newNominee = {
    id: Date.now().toString(),
    awardId,
    name,
    imageUrl: imageUrl || '',
    votes: 0
  };
  nominees.push(newNominee);
  localStorage.setItem('nominees', JSON.stringify(nominees));
  return newNominee;
};

export const voteForNominee = (nomineeId, awardId) => {
  initializeStorage();
  
  // Check if voted
  const userVotes = JSON.parse(localStorage.getItem('userVotes'));
  if (userVotes[awardId]) {
    throw new Error('You have already voted for this award category.');
  }

  // Record vote
  const nominees = JSON.parse(localStorage.getItem('nominees'));
  const nomineeIndex = nominees.findIndex(n => n.id === nomineeId);
  
  if (nomineeIndex === -1) throw new Error('Nominee not found.');
  
  nominees[nomineeIndex].votes += 1;
  localStorage.setItem('nominees', JSON.stringify(nominees));
  
  // Save user vote status
  userVotes[awardId] = true;
  localStorage.setItem('userVotes', JSON.stringify(userVotes));
  
  return true;
};

export const hasVoted = (awardId) => {
  initializeStorage();
  const userVotes = JSON.parse(localStorage.getItem('userVotes'));
  return !!userVotes[awardId];
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem('adminAuth') === 'true';
};

export const adminLogin = (username, password) => {
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('adminAuth', 'true');
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem('adminAuth');
};
