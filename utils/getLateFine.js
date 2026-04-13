function getLateFine(dueDate, finePerWeek) {
  if (!dueDate) return 0;

  const today = new Date();
  const deadline = new Date(dueDate);

  if (today <= deadline) return 0;

  const diffTime = Math.abs(today - deadline);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

  return diffWeeks * (finePerWeek || 0);
}

module.exports = getLateFine;