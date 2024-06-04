/*This file generates the ten csv tables which I used for the graphs in this project. For each event, there are two tables, one for each gender.*/
/**/
--Mens first
--60m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 60 %'AND event LIKE '% Mens %'ORDER BY result desc) TO '60Mens.csv' delimiter ',';
--200m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 200 %'AND event LIKE '% Mens %'ORDER BY result desc) TO '200Mens.csv' delimiter ',';
--400m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 400 %'AND event LIKE '% Mens %'ORDER BY result desc) TO '400Mens.csv' delimiter ',';
--800m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 800 %'AND event LIKE '% Mens %'ORDER BY result desc) TO '800Mens.csv' delimiter ',';
--3000m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 3000 %'AND event LIKE '% Mens %'ORDER BY result desc) TO '3000Mens.csv' delimiter ',';
--And now womens
--60m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 60 %'AND event LIKE '% Womens %'ORDER BY result desc) TO '60Womens.csv' delimiter ',';
--200m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 200 %'AND event LIKE '% Womens %'ORDER BY result desc) TO '200Womens.csv' delimiter ',';
--400m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 400 %'AND event LIKE '% Womens %'ORDER BY result desc) TO '400Womens.csv' delimiter ',';
--800m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 800 %'AND event LIKE '% Womens %'ORDER BY result desc) TO '800Womens.csv' delimiter ',';
--3000m
\copy (SELECT * from Race_record INNER JOIN teams on teams.team_id=Race_record.team_id WHERE event LIKE '% 3000 %'AND event LIKE '% Womens %'ORDER BY result desc) TO '3000Womens.csv' delimiter ',';
