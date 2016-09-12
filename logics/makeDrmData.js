(function() {
    "use strict";

    //let uuid = require("node-uuid");
    var crypto = require("crypto");
    var jsonfile = require("jsonfile");

    var CONFIG_FILE = "../data/config.json";

    //const CONTENT_KEY_LENGTH_IN_BYTES = 16;
    //const COMMUNICATION_KEY_LENGTH_IN_BYTES = 32;
    //const SECRETS_FILE_NAME = "Secrets.json";

    // default config json data
    var config = {
        SITE_ID: "8KAJ",
        TEST_USERID: "valid-user",
        AES256_IV: "0123456789abcdef",
        AUTH_KEY: "yZfN3CNi4t2rnvrqfLEGRGHhNI3oBeQK",
        PACK_KEY: "JKXBwTFJisxDHkbp5wWY6vOrQaZkqhl7"
    };

    jsonfile.readFile(CONFIG_FILE, function(err, data) {
        if (err) {
            console.log('Creating default config file at ' + CONFIG_FILE);
            jsonfile.writeFile(CONFIG_FILE, config, function(err) {
                if (err)
                    console.error(err);
                else
                    console.log(config);
            });
        } else {
            console.log(data);
            config = data;
        }
    });


    module.exports = {
        "encrypt": function encrypt(data) {
            console.log('encrypt data: ' + data);
            if (!data)
                return 'fail';

            var cipher = crypto.createCipheriv('aes-256-cbc', config.AUTH_KEY, config.AES256_IV);
            //cipher.setAutoPadding(false);
            var result = cipher.update(data, "utf8", "base64");
            result += cipher.final("base64");

            return result;
        },
        "decrypt": function decrypt(data) {
            console.log('decrypt data: ' + data);
            if (!data)
                return 'fail';

            var decipher = crypto.createDecipheriv('aes-256-cbc', config.AUTH_KEY, config.AES256_IV);
            //cipher.setAutoPadding(false);
            var result = decipher.update(data, "base64", "utf8");
            result += decipher.final("utf8");

            return result;
        },
        "getConfig": function getConfig() {
            console.log('[getConfig] ' + JSON.stringify(config));
            return config;
        },
        "writeConfig": function writeConfig(configData) {
            config = configData;
            jsonfile.writeFile(CONFIG_FILE, config, function(err) {
                if (err)
                    console.error(err);
                else
                    console.log('[writeConfig] ' + JSON.stringify(config));
            });
        }
    };
})();
