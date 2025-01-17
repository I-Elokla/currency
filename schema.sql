CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    base_rate VARCHAR(10) NOT NULL,
    target_rate VARCHAR(10) NOT NULL,
    base_value DECIMAL(15, 4) NOT NULL,
    converted_value DECIMAL(15, 4) NOT NULL,
    conversion_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);