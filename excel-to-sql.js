// Excel to SQL Converter
// This is a template - you'll need to install xlsx package: npm install xlsx

// Example of how to convert Excel data to SQL
// Replace this with your actual Excel file processing

const convertExcelToSQL = (excelData) => {
  // Example data structure from Excel
  const teams = [
    { name: 'JPIS', short_code: 'JPIS', group: 'A' },
    { name: 'Team B', short_code: 'TB', group: 'A' },
    // ... more teams
  ];

  const matches = [
    {
      home_team: 'JPIS',
      away_team: 'TB',
      date: '2025-09-19',
      time: '10:00',
      venue: 'Main Field',
      stage: 'Group'
    },
    // ... more matches
  ];

  // Generate SQL
  let sql = '-- Teams\n';
  teams.forEach(team => {
    sql += `INSERT INTO teams (sport_id, name, short_code, group_name) VALUES `;
    sql += `((SELECT id FROM sports WHERE slug = 'football-u19'), '${team.name}', '${team.short_code}', '${team.group}');\n`;
  });

  sql += '\n-- Matches\n';
  matches.forEach(match => {
    const startTime = `${match.date}T${match.time}:00Z`;
    sql += `INSERT INTO matches (sport_id, stage, starts_at, venue, home_team_id, away_team_id, home_score, away_score) VALUES `;
    sql += `((SELECT id FROM sports WHERE slug = 'football-u19'), '${match.stage}', '${startTime}', '${match.venue}', `;
    sql += `(SELECT id FROM teams WHERE short_code = '${match.home_team}' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), `;
    sql += `(SELECT id FROM teams WHERE short_code = '${match.away_team}' AND sport_id = (SELECT id FROM sports WHERE slug = 'football-u19')), 0, 0);\n`;
  });

  return sql;
};

console.log('Excel to SQL converter ready. Use convertExcelToSQL(yourData) to generate SQL.');
