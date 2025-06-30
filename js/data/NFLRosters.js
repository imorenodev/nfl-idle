// NFLRosters.js - Complete rosters for all 32 NFL teams with top players at each position

export const NFL_TEAM_ROSTERS = {
    // AFC EAST
    BUF: {
        name: "Buffalo Bills",
        players: {
            QB: { name: "JOSH ALLEN", cost: 7, rarity: 6, rushOffense: 9, rushDefense: 1, passOffense: 9, passDefense: 1 },
            WR: { name: "STEFON DIGGS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "JAMES COOK", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "DAWSON KNOX", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "VON MILLER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "ED OLIVER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "MATT MILANO", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            S: { name: "MICAH HYDE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "TRE'DAVIOUS WHITE", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    MIA: {
        name: "Miami Dolphins",
        players: {
            QB: { name: "TUA TAGOVAILOA", cost: 5, rarity: 4, rushOffense: 4, rushDefense: 1, passOffense: 8, passDefense: 1 },
            WR: { name: "TYREEK HILL", cost: 7, rarity: 6, rushOffense: 3, rushDefense: 1, passOffense: 10, passDefense: 1 },
            RB: { name: "RAHEEM MOSTERT", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 4, passDefense: 1 },
            TE: { name: "MIKE GESICKI", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "BRADLEY CHUBB", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "CHRISTIAN WILKINS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "JEROME BAKER", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 7 },
            S: { name: "JEVON HOLLAND", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "XAVIEN HOWARD", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    NE: {
        name: "New England Patriots",
        players: {
            QB: { name: "MAC JONES", cost: 4, rarity: 3, rushOffense: 3, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "JAKOBI MEYERS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 1, passOffense: 6, passDefense: 1 },
            RB: { name: "RHAMONDRE STEVENSON", cost: 5, rarity: 4, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "HUNTER HENRY", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "MATTHEW JUDON", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "DAVON GODCHAUX", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "ANFERNEE JENNINGS", cost: 3, rarity: 2, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 6 },
            S: { name: "DEVIN MCCOURTY", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 4, passOffense: 1, passDefense: 7 },
            CB: { name: "JONATHAN JONES", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    NYJ: {
        name: "New York Jets",
        players: {
            QB: { name: "AARON RODGERS", cost: 7, rarity: 5, rushOffense: 40000, rushDefense: 1, passOffense: 90000, passDefense: 1 },
            WR: { name: "GARRETT WILSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "BREECE HALL", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "TYLER CONKLIN", cost: 3, rarity: 2, rushOffense: 1, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "CARL LAWSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "QUINNEN WILLIAMS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "C.J. MOSLEY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "JORDAN WHITEHEAD", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "SAUCE GARDNER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },

    // AFC NORTH
    BAL: {
        name: "Baltimore Ravens",
        players: {
            QB: { name: "LAMAR JACKSON", cost: 6, rarity: 5, rushOffense: 10, rushDefense: 1, passOffense: 8, passDefense: 1 },
            WR: { name: "ODELL BECKHAM JR", cost: 5, rarity: 4, rushOffense: 2, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "J.K. DOBBINS", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "MARK ANDREWS", cost: 6, rarity: 5, rushOffense: 3, rushDefense: 1, passOffense: 8, passDefense: 1 },
            DE: { name: "ODAFE OWEH", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "JUSTIN MADUBUIKE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 5 },
            LB: { name: "ROQUAN SMITH", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 8 },
            S: { name: "KYLE HAMILTON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            CB: { name: "MARLON HUMPHREY", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    CIN: {
        name: "Cincinnati Bengals",
        players: {
            QB: { name: "JOE BURROW", cost: 6, rarity: 5, rushOffense: 3, rushDefense: 1, passOffense: 9, passDefense: 1 },
            WR: { name: "JA'MARR CHASE", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 1, passOffense: 9, passDefense: 1 },
            RB: { name: "JOE MIXON", cost: 5, rarity: 4, rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "TYLER BOYD", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "TREY HENDRICKSON", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "D.J. READER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "LOGAN WILSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 7 },
            S: { name: "JESSIE BATES III", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "CHIDOBE AWUZIE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    CLE: {
        name: "Cleveland Browns",
        players: {
            QB: { name: "DESHAUN WATSON", cost: 6, rarity: 5, rushOffense: 7, rushDefense: 1, passOffense: 8, passDefense: 1 },
            WR: { name: "AMARI COOPER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "NICK CHUBB", cost: 5, rarity: 4, rushOffense: 9, rushDefense: 1, passOffense: 3, passDefense: 1 },
            TE: { name: "DAVID NJOKU", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "MYLES GARRETT", cost: 7, rarity: 5, rushOffense: 1, rushDefense: 9, passOffense: 1, passDefense: 7 },
            DT: { name: "JORDAN ELLIOTT", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "JEREMIAH OWUSU-KORAMOAH", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "GRANT DELPIT", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "DENZEL WARD", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    PIT: {
        name: "Pittsburgh Steelers",
        players: {
            QB: { name: "KENNY PICKETT", cost: 4, rarity: 3, rushOffense: 5, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "DIONTAE JOHNSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "NAJEE HARRIS", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 3, passDefense: 1 },
            TE: { name: "PAT FREIERMUTH", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "T.J. WATT", cost: 8, rarity: 6, rushOffense: 1, rushDefense: 10, passOffense: 1, passDefense: 5 },
            DT: { name: "CAM HEYWARD", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "ALEX HIGHSMITH", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            S: { name: "MINKAH FITZPATRICK", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            CB: { name: "JOEY PORTER JR", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },

    // AFC SOUTH  
    HOU: {
        name: "Houston Texans",
        players: {
            QB: { name: "C.J. STROUD", cost: 5, rarity: 4, rushOffense: 4, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "NICO COLLINS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 1, passOffense: 6, passDefense: 1 },
            RB: { name: "DAMEON PIERCE", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 4, passDefense: 1 },
            TE: { name: "DALTON SCHULTZ", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "DANIELLE HUNTER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "DENICO AUTRY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "AZEEZ AL-SHAAIR", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "JALEN PITRE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "DEREK STINGLEY JR", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    IND: {
        name: "Indianapolis Colts", 
        players: {
            QB: { name: "ANTHONY RICHARDSON", cost: 4, rarity: 3, rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "MICHAEL PITTMAN JR", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "JONATHAN TAYLOR", cost: 6, rarity: 5, rushOffense: 9, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "KYLEN GRANSON", cost: 3, rarity: 2, rushOffense: 1, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "KWITY PAYE", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "DEFOREST BUCKNER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "DARIUS LEONARD", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 9 },
            S: { name: "JULIAN BLACKMON", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "KENNY MOORE II", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 8 }
        }
    },
    JAX: {
        name: "Jacksonville Jaguars",
        players: {
            QB: { name: "TREVOR LAWRENCE", cost: 5, rarity: 4, rushOffense: 6, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "CALVIN RIDLEY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "TRAVIS ETIENNE", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "EVAN ENGRAM", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "JOSH ALLEN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "ROY ROBERTSON-HARRIS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 5 },
            LB: { name: "FOYESADE OLUOKUN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "ANDRE CISCO", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "TYSON CAMPBELL", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 8 }
        }
    },
    TEN: {
        name: "Tennessee Titans",
        players: {
            QB: { name: "WILL LEVIS", cost: 3, rarity: 2, rushOffense: 5, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "DEANDRE HOPKINS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "DERRICK HENRY", cost: 7, rarity: 5, rushOffense: 10, rushDefense: 1, passOffense: 2, passDefense: 1 },
            TE: { name: "CHIGOZIEM OKONKWO", cost: 3, rarity: 2, rushOffense: 1, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "HAROLD LANDRY III", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "JEFFERY SIMMONS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "AZEEZ AL-SHAAIR", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "KEVIN BYARD", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "L'JARIUS SNEED", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },

    // AFC WEST
    DEN: {
        name: "Denver Broncos",
        players: {
            QB: { name: "BO NIX", cost: 4, rarity: 3, rushOffense: 6, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "COURTLAND SUTTON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "JAVONTE WILLIAMS", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "GREG DULCICH", cost: 3, rarity: 2, rushOffense: 1, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "BRADLEY CHUBB", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "D.J. JONES", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "ALEX SINGLETON", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "JUSTIN SIMMONS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "PAT SURTAIN II", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    KC: {
        name: "Kansas City Chiefs",
        players: {
            QB: { name: "PATRICK MAHOMES", cost: 8, rarity: 6, rushOffense: 8, rushDefense: 1, passOffense: 10, passDefense: 1 },
            WR: { name: "HOLLYWOOD BROWN", cost: 5, rarity: 4, rushOffense: 2, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "ISIAH PACHECO", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 4, passDefense: 1 },
            TE: { name: "TRAVIS KELCE", cost: 7, rarity: 6, rushOffense: 3, rushDefense: 1, passOffense: 9, passDefense: 1 },
            DE: { name: "CHRIS JONES", cost: 7, rarity: 6, rushOffense: 1, rushDefense: 9, passOffense: 1, passDefense: 6 },
            DT: { name: "DERRICK NNADI", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "NICK BOLTON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "JUSTIN REID", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 7 },
            CB: { name: "TRENT MCDUFFIE", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 8 }
        }
    },
    LV: {
        name: "Las Vegas Raiders",
        players: {
            QB: { name: "GARDNER MINSHEW", cost: 4, rarity: 3, rushOffense: 4, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "DAVANTE ADAMS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 1, passOffense: 9, passDefense: 1 },
            RB: { name: "JOSH JACOBS", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "BROCK BOWERS", cost: 5, rarity: 4, rushOffense: 2, rushDefense: 1, passOffense: 7, passDefense: 1 },
            DE: { name: "MAXX CROSBY", cost: 7, rarity: 6, rushOffense: 1, rushDefense: 9, passOffense: 1, passDefense: 8 },
            DT: { name: "CHRISTIAN WILKINS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "ROBERT SPILLANE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "MARCUS EPPS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "NATE HOBBS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    LAC: {
        name: "Los Angeles Chargers",
        players: {
            QB: { name: "JUSTIN HERBERT", cost: 6, rarity: 5, rushOffense: 5, rushDefense: 1, passOffense: 8, passDefense: 1 },
            WR: { name: "KEENAN ALLEN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "J.K. DOBBINS", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "WILL DISSLY", cost: 3, rarity: 2, rushOffense: 2, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "KHALIL MACK", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "POONA FORD", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "DRUE TRANQUILL", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "DERWIN JAMES", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            CB: { name: "ASANTE SAMUEL JR", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },

    // NFC EAST
    DAL: {
        name: "Dallas Cowboys",
        players: {
            QB: { name: "DAK PRESCOTT", cost: 5, rarity: 4, rushOffense: 6, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "CEEDEE LAMB", cost: 6, rarity: 5, rushOffense: 2, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "EZEKIEL ELLIOTT", cost: 5, rarity: 4, rushOffense: 7, rushDefense: 1, passOffense: 4, passDefense: 1 },
            TE: { name: "JAKE FERGUSON", cost: 3, rarity: 2, rushOffense: 2, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "MICAH PARSONS", cost: 7, rarity: 6, rushOffense: 1, rushDefense: 9, passOffense: 1, passDefense: 8 },
            DT: { name: "MAZI SMITH", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "DEMARVION OVERSHOWN", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "TREVON DIGGS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 4, passOffense: 1, passDefense: 9 },
            CB: { name: "DARON BLAND", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    NYG: {
        name: "New York Giants",
        players: {
            QB: { name: "DANIEL JONES", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "MALIK NABERS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "SAQUON BARKLEY", cost: 7, rarity: 5, rushOffense: 9, rushDefense: 1, passOffense: 8, passDefense: 1 },
            TE: { name: "DANIEL BELLINGER", cost: 3, rarity: 2, rushOffense: 2, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "BRIAN BURNS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "DEXTER LAWRENCE", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "BOBBY OKEREKE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "XAVIER MCKINNEY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "DEONTE BANKS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    PHI: {
        name: "Philadelphia Eagles",
        players: {
            QB: { name: "JALEN HURTS", cost: 5, rarity: 4, rushOffense: 10, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "A.J. BROWN", cost: 6, rarity: 5, rushOffense: 2, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "SAQUON BARKLEY", cost: 7, rarity: 5, rushOffense: 9, rushDefense: 1, passOffense: 8, passDefense: 1 },
            TE: { name: "DALLAS GOEDERT", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            DE: { name: "JOSH SWEAT", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "JALEN CARTER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "NAKOBE DEAN", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "C.J. GARDNER-JOHNSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "DARIUS SLAY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    WAS: {
        name: "Washington Commanders",
        players: {
            QB: { name: "JAYDEN DANIELS", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "TERRY MCLAURIN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "BRIAN ROBINSON JR", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 4, passDefense: 1 },
            TE: { name: "ZACH ERTZ", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "MONTEZ SWEAT", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "JONATHAN ALLEN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "BOBBY WAGNER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            S: { name: "JEREMY CHINN", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "MARSHON LATTIMORE", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },

    // NFC NORTH
    CHI: {
        name: "Chicago Bears",
        players: {
            QB: { name: "CALEB WILLIAMS", cost: 5, rarity: 4, rushOffense: 6, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "DJ MOORE", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "D'ANDRE SWIFT", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "COLE KMET", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "MONTEZ SWEAT", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "GERVON DEXTER", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "T.J. EDWARDS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "KEVIN BYARD", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "JAYLON JOHNSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    DET: {
        name: "Detroit Lions",
        players: {
            QB: { name: "JARED GOFF", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "AMON-RA ST. BROWN", cost: 5, rarity: 4, rushOffense: 2, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "JAHMYR GIBBS", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 7, passDefense: 1 },
            TE: { name: "SAM LAPORTA", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            DE: { name: "AIDAN HUTCHINSON", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "ALIM MCNEILL", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "ALEX ANZALONE", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "KERBY JOSEPH", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "CARLTON DAVIS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    GB: {
        name: "Green Bay Packers",
        players: {
            QB: { name: "JORDAN LOVE", cost: 5, rarity: 4, rushOffense: 5, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "JAYLEN WADDLE", cost: 5, rarity: 4, rushOffense: 2, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "JOSH JACOBS", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "TUCKER KRAFT", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "RASHAN GARY", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "KENNY CLARK", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "QUAY WALKER", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "XAVIER MCKINNEY", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "JAIRE ALEXANDER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    MIN: {
        name: "Minnesota Vikings",
        players: {
            QB: { name: "SAM DARNOLD", cost: 4, rarity: 3, rushOffense: 4, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "JUSTIN JEFFERSON", cost: 7, rarity: 6, rushOffense: 2, rushDefense: 1, passOffense: 10, passDefense: 1 },
            RB: { name: "AARON JONES", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "T.J. HOCKENSON", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            DE: { name: "DANIELLE HUNTER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "HARRISON PHILLIPS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "BLAKE CASHMAN", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "HARRISON SMITH", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "BYRON MURPHY JR", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },

    // NFC SOUTH
    ATL: {
        name: "Atlanta Falcons",
        players: {
            QB: { name: "KIRK COUSINS", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "DRAKE LONDON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "BIJAN ROBINSON", cost: 6, rarity: 5, rushOffense: 8, rushDefense: 1, passOffense: 7, passDefense: 1 },
            TE: { name: "KYLE PITTS", cost: 6, rarity: 5, rushOffense: 3, rushDefense: 1, passOffense: 8, passDefense: 1 },
            DE: { name: "MATTHEW JUDON", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "GRADY JARRETT", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "KADEN ELLISS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "JESSIE BATES III", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "A.J. TERRELL", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    CAR: {
        name: "Carolina Panthers",
        players: {
            QB: { name: "BRYCE YOUNG", cost: 4, rarity: 3, rushOffense: 5, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "DIONTAE JOHNSON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "CHUBA HUBBARD", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "TOMMY TREMBLE", cost: 3, rarity: 2, rushOffense: 2, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "BRIAN BURNS", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "DERRICK BROWN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "SHAQ THOMPSON", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "XAVIER WOODS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "JAYCEE HORN", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    NO: {
        name: "New Orleans Saints",
        players: {
            QB: { name: "DEREK CARR", cost: 5, rarity: 4, rushOffense: 4, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "CHRIS OLAVE", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 7, passDefense: 1 },
            RB: { name: "ALVIN KAMARA", cost: 6, rarity: 5, rushOffense: 8, rushDefense: 1, passOffense: 8, passDefense: 1 },
            TE: { name: "JUWAN JOHNSON", cost: 3, rarity: 2, rushOffense: 2, rushDefense: 1, passOffense: 5, passDefense: 1 },
            DE: { name: "CAM JORDAN", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "KHALEN SAUNDERS", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "DEMARIO DAVIS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "TYRANN MATHIEU", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "MARSHON LATTIMORE", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 9 }
        }
    },
    TB: {
        name: "Tampa Bay Buccaneers",
        players: {
            QB: { name: "BAKER MAYFIELD", cost: 5, rarity: 4, rushOffense: 5, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "MIKE EVANS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "RACHAAD WHITE", cost: 4, rarity: 3, rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "CADE OTTON", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "SHAQUIL BARRETT", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            DT: { name: "VITA VEA", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "LAVONTE DAVID", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 7 },
            S: { name: "ANTOINE WINFIELD JR", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            CB: { name: "JAMEL DEAN", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },

    // NFC WEST
    ARI: {
        name: "Arizona Cardinals",
        players: {
            QB: { name: "KYLER MURRAY", cost: 6, rarity: 5, rushOffense: 9, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "MARVIN HARRISON JR", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "JAMES CONNER", cost: 5, rarity: 4, rushOffense: 7, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "TREY MCBRIDE", cost: 5, rarity: 4, rushOffense: 3, rushDefense: 1, passOffense: 7, passDefense: 1 },
            DE: { name: "J.J. WATT", cost: 7, rarity: 6, rushOffense: 1, rushDefense: 9, passOffense: 1, passDefense: 7 },
            DT: { name: "ROY LOPEZ", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 4 },
            LB: { name: "BUDDA BAKER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            S: { name: "JALEN THOMPSON", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "SEAN MURPHY-BUNTING", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    LAR: {
        name: "Los Angeles Rams",
        players: {
            QB: { name: "MATTHEW STAFFORD", cost: 5, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 8, passDefense: 1 },
            WR: { name: "COOPER KUPP", cost: 6, rarity: 5, rushOffense: 2, rushDefense: 1, passOffense: 9, passDefense: 1 },
            RB: { name: "KYREN WILLIAMS", cost: 5, rarity: 4, rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
            TE: { name: "TYLER HIGBEE", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "KOBIE TURNER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "AARON DONALD", cost: 8, rarity: 6, rushOffense: 1, rushDefense: 10, passOffense: 1, passDefense: 5 },
            LB: { name: "ERNEST JONES", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 6 },
            S: { name: "KAMREN CURL", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 7 },
            CB: { name: "COBIE DURANT", cost: 4, rarity: 3, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 7 }
        }
    },
    SF: {
        name: "San Francisco 49ers",
        players: {
            QB: { name: "BROCK PURDY", cost: 5, rarity: 4, rushOffense: 4, rushDefense: 1, passOffense: 7, passDefense: 1 },
            WR: { name: "DEEBO SAMUEL", cost: 6, rarity: 5, rushOffense: 5, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "CHRISTIAN MCCAFFREY", cost: 8, rarity: 6, rushOffense: 9, rushDefense: 1, passOffense: 9, passDefense: 1 },
            TE: { name: "GEORGE KITTLE", cost: 6, rarity: 5, rushOffense: 4, rushDefense: 1, passOffense: 8, passDefense: 1 },
            DE: { name: "NICK BOSA", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 8 },
            DT: { name: "JAVON HARGRAVE", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 6 },
            LB: { name: "FRED WARNER", cost: 6, rarity: 5, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 8 },
            S: { name: "TALANOA HUFANGA", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 6, passOffense: 1, passDefense: 8 },
            CB: { name: "CHARVARIUS WARD", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 2, passOffense: 1, passDefense: 8 }
        }
    },
    SEA: {
        name: "Seattle Seahawks",
        players: {
            QB: { name: "GENO SMITH", cost: 4, rarity: 3, rushOffense: 4, rushDefense: 1, passOffense: 6, passDefense: 1 },
            WR: { name: "DK METCALF", cost: 6, rarity: 5, rushOffense: 2, rushDefense: 1, passOffense: 8, passDefense: 1 },
            RB: { name: "KENNETH WALKER III", cost: 5, rarity: 4, rushOffense: 8, rushDefense: 1, passOffense: 5, passDefense: 1 },
            TE: { name: "NOAH FANT", cost: 4, rarity: 3, rushOffense: 2, rushDefense: 1, passOffense: 6, passDefense: 1 },
            DE: { name: "UCHENNA NWOSU", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 6 },
            DT: { name: "LEONARD WILLIAMS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 7, passOffense: 1, passDefense: 5 },
            LB: { name: "BOBBY WAGNER", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 8, passOffense: 1, passDefense: 7 },
            S: { name: "QUANDRE DIGGS", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 5, passOffense: 1, passDefense: 8 },
            CB: { name: "DEVON WITHERSPOON", cost: 5, rarity: 4, rushOffense: 1, rushDefense: 3, passOffense: 1, passDefense: 8 }
        }
    }
};

// Helper function to get all players from all teams for general draft
export function getAllPlayersPool() {
    const allPlayers = [];
    
    Object.entries(NFL_TEAM_ROSTERS).forEach(([teamAbbr, teamData]) => {
        Object.entries(teamData.players).forEach(([position, player]) => {
            allPlayers.push({
                ...player,
                position: position,
                team: teamAbbr,
                teamName: teamData.name,
                id: `${teamAbbr}-${position}-${player.name.replace(/\s+/g, '-')}`
            });
        });
    });
    
    return allPlayers;
}

// Helper function to get players for a specific team
export function getTeamPlayers(teamAbbr) {
    const teamData = NFL_TEAM_ROSTERS[teamAbbr];
    if (!teamData) return [];
    
    return Object.entries(teamData.players).map(([position, player]) => ({
        ...player,
        position: position,
        team: teamAbbr,
        teamName: teamData.name,
        id: `${teamAbbr}-${position}-${player.name.replace(/\s+/g, '-')}`
    }));
}

// Helper function to get 3 random players for draft choices
export function getRandomDraftChoices(excludeIds = []) {
    const allPlayers = getAllPlayersPool();
    const availablePlayers = allPlayers.filter(player => !excludeIds.includes(player.id));
    
    // Shuffle and take 3
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
}