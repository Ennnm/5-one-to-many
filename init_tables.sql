CREATE TABLE owners (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE cats (id SERIAL PRIMARY KEY, name TEXT, owner_id INTEGER);

INSERT INTO owners (name) VALUES ('Mr. Snuggles');
INSERT INTO owners (name) VALUES ('Jake AlPurrrrtsen');
INSERT INTO owners (name) VALUES ('Furry Mc Furmeister');
INSERT INTO owners (name) VALUES ('Kai');