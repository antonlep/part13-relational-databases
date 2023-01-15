CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
INSERT INTO blogs (author, url, title) VALUES ('value1', 'value2','value3');
INSERT INTO blogs (author, url, title, likes) VALUES ('value1', 'value2','value3',10);