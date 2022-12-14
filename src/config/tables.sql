CREATE TABLE "users" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"username" TEXT UNIQUE NOT NULL,
	"email" VARCHAR(50) UNIQUE NOT NULL,
	"password" VARCHAR(50) NOT NULL,
	"pictureUrl" TEXT NOT NULL,
	"createdAt" DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE "metadatas" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"url" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT NOT NULL
);

CREATE TABLE "posts" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"creatorId" INTEGER NOT NULL REFERENCES users(id),
	"post" TEXT,
	"metaId" INTEGER NOT NULL REFERENCES metadatas(id),
	"postTime" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "reactions" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"userId" INTEGER NOT NULL REFERENCES users(id)
);

CREATE TABLE "relations" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"followed" INTEGER NOT NULL REFERENCES users(id),
	"follower" INTEGER NOT NULL REFERENCES users(id)
)

CREATE TABLE "shares" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"userId" INTEGER NOT NULL REFERENCES users(id),
	"shareTime" TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE "trendings" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"name" TEXT NOT NULL
)

CREATE TABLE "trends" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"trendId" INTEGER NOT NULL REFERENCES trendings(id)
)

CREATE TABLE "comments" (
	"id" SERIAL NOT NULL PRIMARY KEY,
	"text" TEXT NOT NULL,
	"creatorId" INTEGER NOT NULL REFERENCES users(id),
	"postId" INTEGER NOT NULL REFERENCES posts(id),
	"commentTime" TIMESTAMP NOT NULL DEFAULT NOW()
);