class MongoDB {
	constructor() {
		this.table;
		this.database;
		this.collection;
	}

	setTable(table) {
		this.table = table;
	}

	setConnection(connection) {
		this.database = connection;
		this.collection = connection.collection(this.table);
	}

	getDatabase() {
		return this.database;
	}

	getCollection() {
		return this.collection;
	}

	insert(document, writeConcern) {
		if (document.length == undefined) {
			return this.collection.insertOne(document, writeConcern);
		} else {
			return this.collection.insertMany(document, writeConcern);
		}
	}

	update(filter, document, options) {
		if (document.length === undefined) {
			return this.collection.updateOne(filter, document, options);
		} else {
			return this.collection.updateMany(filter, document, options);
		}
	}

	delete(filter, writeConcern, collation) {
		if (document.length === undefined) {
			return this.collection.delete(filter, writeConcern, collation);
		} else {
			return this.collection.delete(filter, writeConcern, collation);
		}
	}
}

module.exports = MongoDB;