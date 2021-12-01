const data = require('./stats.json');

console.log(data.event)

//completion_day_level":{"12":{"2":{"get_star_ts":"1576137665"},"1":{"get_star_ts":"1576133769"}},
const getDayStat = (member, day, index) => (
  member.completion_day_level
  && member.completion_day_level[day]
  && member.completion_day_level[day][index]
  && member.completion_day_level[day][index]['get_star_ts']
  || 1640995200000
);
const getDailyRanking = (day, limit) => {
  const members = data.members;
  const dailyStats = Object.values(data.members).map(member => ({
    name: member.name,
    silverStar: getDayStat(member, day, '1'),
    goldStar: getDayStat(member, day, '2'),
  }));
  const sortBy = (attr) => (a,b) => (a[attr] - b[attr]);
  
  console.log(`Stats day ${day}`)
  console.log('Silver star')
  display('silverStar')(dailyStats.sort(sortBy('silverStar')).slice(0,limit));

  console.log('\nGold star')
  display('goldStar')(dailyStats.sort(sortBy('goldStar')).slice(0,limit));
}
const display = attr => input => input.map((score, i) => console.log(
  `${pad(i+1, ' ')})`,
  formatDate(new Date(1000 * score[attr])),
  score.name,
));
const pad = (i, paddar=0) => `${paddar}${i}`.slice(-2);
const formatDate = (date) => 
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
getDailyRanking(20, 10)