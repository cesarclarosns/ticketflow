db.createUser({ user: "admin", pwd: "password", roles: ["dbOwner"] });
db.createCollection("users");

