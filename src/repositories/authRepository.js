import connection from "../databases/postgres.js";

async function SignMiddleware(email) {
	return connection.query('SELECT * FROM users WHERE email = $1',[email]);
}

async function SignUp(email, passwordHash, username, pictureUrl) {
	return connection.query('INSERT INTO users (email, password, username, "pictureUrl") VALUES ($1, $2, $3, $4)',[email, passwordHash, username, pictureUrl]);
}

export const authRepository = {
    SignMiddleware,
    SignUp
}