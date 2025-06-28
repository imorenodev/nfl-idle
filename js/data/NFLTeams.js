// NFLTeams.js - NFL team data for team selection and battles

export const NFL_TEAMS_DATA = [
    // AFC East
    { id: 'bills', name: 'Buffalo Bills', abbreviation: 'BUF', primaryColor: '#00338D', secondaryColor: '#C60C30', conference: 'AFC', division: 'East' },
    { id: 'dolphins', name: 'Miami Dolphins', abbreviation: 'MIA', primaryColor: '#008E97', secondaryColor: '#FC4C02', conference: 'AFC', division: 'East' },
    { id: 'patriots', name: 'New England Patriots', abbreviation: 'NE', primaryColor: '#002244', secondaryColor: '#C60C30', conference: 'AFC', division: 'East' },
    { id: 'jets', name: 'New York Jets', abbreviation: 'NYJ', primaryColor: '#125740', secondaryColor: '#000000', conference: 'AFC', division: 'East' },

    // AFC North
    { id: 'ravens', name: 'Baltimore Ravens', abbreviation: 'BAL', primaryColor: '#241773', secondaryColor: '#000000', conference: 'AFC', division: 'North' },
    { id: 'bengals', name: 'Cincinnati Bengals', abbreviation: 'CIN', primaryColor: '#FB4F14', secondaryColor: '#000000', conference: 'AFC', division: 'North' },
    { id: 'browns', name: 'Cleveland Browns', abbreviation: 'CLE', primaryColor: '#311D00', secondaryColor: '#FF3C00', conference: 'AFC', division: 'North' },
    { id: 'steelers', name: 'Pittsburgh Steelers', abbreviation: 'PIT', primaryColor: '#FFB612', secondaryColor: '#000000', conference: 'AFC', division: 'North' },

    // AFC South
    { id: 'texans', name: 'Houston Texans', abbreviation: 'HOU', primaryColor: '#03202F', secondaryColor: '#A71930', conference: 'AFC', division: 'South' },
    { id: 'colts', name: 'Indianapolis Colts', abbreviation: 'IND', primaryColor: '#002C5F', secondaryColor: '#A2AAAD', conference: 'AFC', division: 'South' },
    { id: 'jaguars', name: 'Jacksonville Jaguars', abbreviation: 'JAX', primaryColor: '#006778', secondaryColor: '#9F792C', conference: 'AFC', division: 'South' },
    { id: 'titans', name: 'Tennessee Titans', abbreviation: 'TEN', primaryColor: '#0C2340', secondaryColor: '#4B92DB', conference: 'AFC', division: 'South' },

    // AFC West
    { id: 'broncos', name: 'Denver Broncos', abbreviation: 'DEN', primaryColor: '#FB4F14', secondaryColor: '#002244', conference: 'AFC', division: 'West' },
    { id: 'chiefs', name: 'Kansas City Chiefs', abbreviation: 'KC', primaryColor: '#E31837', secondaryColor: '#FFB81C', conference: 'AFC', division: 'West' },
    { id: 'raiders', name: 'Las Vegas Raiders', abbreviation: 'LV', primaryColor: '#000000', secondaryColor: '#A5ACAF', conference: 'AFC', division: 'West' },
    { id: 'chargers', name: 'Los Angeles Chargers', abbreviation: 'LAC', primaryColor: '#0080C6', secondaryColor: '#FFC20E', conference: 'AFC', division: 'West' },

    // NFC East
    { id: 'cowboys', name: 'Dallas Cowboys', abbreviation: 'DAL', primaryColor: '#003594', secondaryColor: '#041E42', conference: 'NFC', division: 'East' },
    { id: 'giants', name: 'New York Giants', abbreviation: 'NYG', primaryColor: '#0B2265', secondaryColor: '#A71930', conference: 'NFC', division: 'East' },
    { id: 'eagles', name: 'Philadelphia Eagles', abbreviation: 'PHI', primaryColor: '#004C54', secondaryColor: '#A5ACAF', conference: 'NFC', division: 'East' },
    { id: 'commanders', name: 'Washington Commanders', abbreviation: 'WAS', primaryColor: '#5A1414', secondaryColor: '#FFB612', conference: 'NFC', division: 'East' },

    // NFC North
    { id: 'bears', name: 'Chicago Bears', abbreviation: 'CHI', primaryColor: '#0B162A', secondaryColor: '#C83803', conference: 'NFC', division: 'North' },
    { id: 'lions', name: 'Detroit Lions', abbreviation: 'DET', primaryColor: '#0076B6', secondaryColor: '#B0B7BC', conference: 'NFC', division: 'North' },
    { id: 'packers', name: 'Green Bay Packers', abbreviation: 'GB', primaryColor: '#203731', secondaryColor: '#FFB612', conference: 'NFC', division: 'North' },
    { id: 'vikings', name: 'Minnesota Vikings', abbreviation: 'MIN', primaryColor: '#4F2683', secondaryColor: '#FFC62F', conference: 'NFC', division: 'North' },

    // NFC South
    { id: 'falcons', name: 'Atlanta Falcons', abbreviation: 'ATL', primaryColor: '#A71930', secondaryColor: '#000000', conference: 'NFC', division: 'South' },
    { id: 'panthers', name: 'Carolina Panthers', abbreviation: 'CAR', primaryColor: '#0085CA', secondaryColor: '#101820', conference: 'NFC', division: 'South' },
    { id: 'saints', name: 'New Orleans Saints', abbreviation: 'NO', primaryColor: '#D3BC8D', secondaryColor: '#101820', conference: 'NFC', division: 'South' },
    { id: 'buccaneers', name: 'Tampa Bay Buccaneers', abbreviation: 'TB', primaryColor: '#D50A0A', secondaryColor: '#FF7900', conference: 'NFC', division: 'South' },

    // NFC West
    { id: 'cardinals', name: 'Arizona Cardinals', abbreviation: 'ARI', primaryColor: '#97233F', secondaryColor: '#000000', conference: 'NFC', division: 'West' },
    { id: 'rams', name: 'Los Angeles Rams', abbreviation: 'LAR', primaryColor: '#003594', secondaryColor: '#FFA300', conference: 'NFC', division: 'West' },
    { id: '49ers', name: 'San Francisco 49ers', abbreviation: 'SF', primaryColor: '#AA0000', secondaryColor: '#B3995D', conference: 'NFC', division: 'West' },
    { id: 'seahawks', name: 'Seattle Seahawks', abbreviation: 'SEA', primaryColor: '#002244', secondaryColor: '#69BE28', conference: 'NFC', division: 'West' }
];

export class NFLTeams {
    static getAllTeams() {
        return [...NFL_TEAMS_DATA];
    }

    static getTeamById(id) {
        return NFL_TEAMS_DATA.find(team => team.id === id);
    }

    static getTeamsByConference(conference) {
        return NFL_TEAMS_DATA.filter(team => team.conference === conference);
    }

    static getTeamsByDivision(conference, division) {
        return NFL_TEAMS_DATA.filter(team => 
            team.conference === conference && team.division === division
        );
    }

    static getAFCTeams() {
        return this.getTeamsByConference('AFC');
    }

    static getNFCTeams() {
        return this.getTeamsByConference('NFC');
    }

    static getRandomTeam(excludeId = null) {
        const teams = excludeId ? 
            NFL_TEAMS_DATA.filter(team => team.id !== excludeId) : 
            NFL_TEAMS_DATA;
        return teams[Math.floor(Math.random() * teams.length)];
    }

    static searchTeams(query) {
        const lowerQuery = query.toLowerCase();
        return NFL_TEAMS_DATA.filter(team => 
            team.name.toLowerCase().includes(lowerQuery) ||
            team.abbreviation.toLowerCase().includes(lowerQuery)
        );
    }
}