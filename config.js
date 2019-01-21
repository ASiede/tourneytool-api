"use strict";

exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://asiede:SashaB00ne@ds163044.mlab.com:63044/tourneytool";

exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://asiede:SashaB00ne@ds163044.mlab.com:63044/tourneytool-test";


exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';