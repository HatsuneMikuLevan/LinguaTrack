export const categoryColors = {
  Vocabulary: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-cyan-500' },
  Grammar: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-pink-500' },
  Listening: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500 to-orange-500' },
  Speaking: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-500' },
  Reading: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', gradient: 'from-rose-500 to-red-500' },
  Writing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', gradient: 'from-indigo-500 to-violet-500' },
};

export const getCategoryStyle = (category) => {
  return categoryColors[category] || categoryColors.Vocabulary;
};