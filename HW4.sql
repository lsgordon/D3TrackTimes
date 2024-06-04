/* HW4.sql. Run with:
psql -U lsgordon -d lsgordon -f HW4.sql
*/
/*
Creating tables
CREATE TABLE Teams (
    team_name varchar(48),
    city varchar(24),
    state varchar(2),
    roster_size int,
    team_id int,
    PRIMARY KEY(team_id)
);
CREATE TABLE Athletes (
    year varchar(12), /* Some cases where the name is 'Senior' not just SR, IDK how to deal with because there are only a few cases really*/
    name varchar(36), /**/
    team_id int NOT NULL,
    ath_id bigint NOT NULL,
    /*FOREIGN KEY (team_id) REFERENCES Teams(team_id), This does not work, since I collected athletes outside of D3, but only D3 teams. Thus there are some athletes who
    's IDs are outside team(team_id) */
    PRIMARY KEY(ath_id)
);
CREATE TABLE Meets (
    meet_id int,
    meet_name varchar(200),
    date_range varchar(60),
    PRIMARY KEY(meet_id)
);
CREATE TABLE Race_record (
    position varchar(6),
    result varchar(60),
    event varchar(72),
    meet_id int NOT NULL,
    team_id int NOT NULL,
    ath_id int NOT NULL
);
*/
/*Loading data in -- RACE RECORD,MEETS DONE*/
/*\copy race_record FROM 'Race_record_fixed.csv' WITH DELIMITER ',' CSV;*/
/*\copy meets FROM 'Meets_fixed.csv' WITH DELIMITER ',' CSV;*/
/*\copy teams FROM 'Teams_fixed.csv' WITH DELIMITER ',' CSV;*/
/*\copy athletes FROM 'Athletes_fixed.csv' WITH DELIMITER ',' CSV;*/