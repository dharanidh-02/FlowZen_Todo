-- Run this file in your PostgreSQL database to set up the schema
-- psql -U postgres -d todolist -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  userid      SERIAL PRIMARY KEY,
  username    VARCHAR(100) NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  dept        VARCHAR(100),
  year        INT,
  email       VARCHAR(150) UNIQUE NOT NULL,
  age         INT,
  status      VARCHAR(20) DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
