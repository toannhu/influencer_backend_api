var express = require("express");
var control = express.Router();
var database = require("../database/database");
var cors = require("cors");
control.use(cors());

control.get("/users", function(req, res) {
	var appData = {};
	var page = req.query.page;
	var size = req.query.size;
	var name = req.query.name;
	var fromAge = req.query.fromAge;
	var toAge = req.query.toAge;
	var address = req.query.address;
	var idcard = req.query.idcard;
	var bankCard = req.query.bankCard;
	var phone = req.query.phone;
	var job = req.query.job;
	var socialType = req.query.socialType;

	var paramsInsert = [];
	var queryString = "SELECT u.*, p.method, p.card_id, p.bank FROM `user` as u LEFT JOIN `payment` as p ON u.id = p.uid WHERE 1";

	if (isNaN(page) || page.length == 0 || page == null) {
		page = 1;
	} else {
		page = parseInt(page)
	}
	if (isNaN(size) || size.length == 0 || size == null) {
		size = 20;
	} else {
		size = parseInt(size)
	}
	var from = page * size - size;
    if (from < 0) {
        from = 0;
	}

	if (name != null && name.length > 0) {
		queryString += " AND name = ?";
		paramsInsert.push(name);
	}
	if (fromAge != null && !isNaN(fromAge)) {
		var startDate = new Date();
		startDate.setFullYear(startDate.getFullYear() - parseInt(fromAge));
		queryString += " AND birthday <= ?";
		paramsInsert.push(startDate);
	}
	if (toAge != null && !isNaN(toAge)) {
		var toDate = new Date();
		toDate.setFullYear(toDate.getFullYear() - parseInt(toAge));
		queryString += " AND birthday >= ?";
		paramsInsert.push(toDate);
	}
	if (address != null && address.length > 0) {
		queryString += " AND address = ?";
		paramsInsert.push("%" + address + "%");
	}
	if (idcard != null && idcard.length > 0) {
		queryString += " AND idcard = ?";
		paramsInsert.push(idcard);
	}
	if (phone != null && phone.length > 0) {
		queryString += " AND phone = ?";
		paramsInsert.push(phone);
	}
	if (job != null && !isNaN(job)) {
		queryString += " AND job = ?";
		paramsInsert.push(parseInt(job));
	}
	if (socialType != null && !isNaN(socialType)) {
		queryString += " AND social_type = ?";
		paramsInsert.push(parseInt(socialType));
	}
	if (bankCard != null && bankCard.length > 0) {
		queryString += " AND card_id = ?";
		paramsInsert.push(bankCard);
	}

	queryString += " LIMIT ?,?";
	paramsInsert.push(from);
	paramsInsert.push(size);

	database.connection.getConnection(function(err, connection) {
		if (err) {
			appData["error"] = 1;
			appData["data"] = "Internal Server Error";
			res.status(500).json(appData);
		} else {
			var query = connection.query(queryString, paramsInsert, function(err, rows, fields) {
				if (!err) {
					appData["error"] = 0;
					appData["data"] = rows;
					res.status(200).json(appData);
				} else {
					appData["error"] = 1;
					appData["data"] = "No data found";
					res.status(200).json(appData);
				}
			});
			console.log(query.sql);
			connection.release();
		}
	});
});

module.exports = control;
