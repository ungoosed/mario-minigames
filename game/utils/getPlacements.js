export default function getPlacements(users) {
  //REWORK TO USE WITH NEW POINTS FORMAT
  // Sort users by points in descending order
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  let placements = [];
  for (let i = 0; i < sortedUsers.length; i++) {
    // Determine placement (accounting for ties)
    let placement = i + 1;
    if (i > 0 && sortedUsers[i].points === sortedUsers[i - 1].points) {
      placement = placements[i - 1].placement;
    }

    placements.push({ placement, id: sortedUsers[i].id });
  }

  return placements;
}
