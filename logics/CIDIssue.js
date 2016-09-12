(function() {
    "use strict";

    var makeDrm = require('./makeDrmData');
    var xml2js = require("xml2js");
    var xmlparser = new xml2js.Parser();

    module.exports = {
        "makeRes": function makeRes(data) {

            /* ============================================================================== */
            /* =   PAGE : Content ID 발급 page / Content ID issuance page                     = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Packager에서 Packaging을 진행할 때, 필요한 Content ID를 PallyCon Cloud 서      = */
            /* =   버를 통해 발급해주는 페이지 입니다.                                           = */
            /* =                                                                            = */
            /* =   ※ 중요                                                                   = */
            /* =   1. Content ID를 생성하는 부분에 업체 정책에 반영됩니다. 상용시에는 반드시            = */
            /* =      입력해 주셔야 합니다.                                                      = */
            /* =   2. BM 적용 전에는 CONFIG.php 값으로 설정되어 있습니다.                           = */
            /* = -------------------------------------------------------------------------- = */
            /* =   This page issues content ID used for content packaging via PallyCon    = */
            /* =   cloud server.                                                  = */
            /* =                                                                            = */
            /* =   ※ Notice                                                                 = */
            /* =   1. The Content ID should be generated by your own rule when this page    = */
            /* =      is used for production.                                               = */
            /* =   2. The default ID for test is set by CONFIG.php file.                    = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Copyright (c)  2015   INKA Entworks Inc.   All Rights Reserverd.         = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   01. 단일 테스트인지 결정 / Enable or disable single page test                   = */
            /* = -------------------------------------------------------------------------- = */
            /* =   [페이지 단일 테스트 방법]                            = */
            /* =   1. isTest의 값을 1로 설정합니다.                          = */
            /* =   2. 구글 크롬 브라우저의 웹 어플리케이션 중 'POSTMAN'을 실행합니다.              = */
            /* =   3. 페이지 주소를 입력하고, POST 방식으로 'data'의 parameter 값으로 가이드         = */
            /* =      에 나와 있는 규격을 암호화 없이 XML 형태로 입력합니다. (단일 테스트의            = */
            /* =      경우 페이지 내에서 자동으로 암호화하여 파싱하도록 되어 있습니다.)             = */
            /* =   4. Send하면 응답 데이터가 표시됩니다. 데이터 처리의 시퀀스가 표시됩니다.           = */
            /* =   ** 그외 별도로 웹 페이지를 만들어서 데이터를 리턴받는 형태로도 사용할 수             = */
            /* =      있습니다.                                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   [How to do single page test ]                                            = */
            /* =   1. Set isTest value to 1.                        = */
            /* =   2. Launch 'POSTMAN' web application from Chrome browser.         = */
            /* =   3. Input page URL and parameters for POST data as guided on PallyCon   = */
            /* =      Developer site. (In case of page test, the parameters are encrypted = */
            /* =      parsed by the page automatically.)                  = */
            /* =   4. Click 'Send' and check response. The data sequence will be shown.   = */
            /* =   ** It is also possible to test data response using separated web page. = */
            /* = -------------------------------------------------------------------------- = */

            var isTest = 0; // 0 : 상용 (production), 1:단일 테스트 (single page test)

            /* = -------------------------------------------------------------------------- = */
            /* =   01. 단일 테스트인지 결정 END / End of enalbe or disable page test       = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   02. 데이터 설정 / Data setting                                               = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   02-2. ERROR_CODE/MESSAGE 설정                        = */
            /* =   - ERROR_CODE: 4자리의 숫자로만 구성됩니다. INKA에서 이미 설정된 값을 사용         = */
            /* =                 합니다. 업체에서 사용되는 에러코드는 정책 반영하는 부분에           = */
            /* =                 설명되어 있으니 참고 부탁드립니다.                    = */
            /* =    ** 0000 은 성공입니다. 다른 값은 에러로 인식됩니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   02-2. ERROR_CODE/MESSAGE setting                                         = */
            /* =   - ERROR_CODE: 4 digit value. Pre-defined by INKA.            = */
            /* =                 The error codes for your service can be set when setting   = */
            /* =                 your business rules.                   = */
            /* =    ** 0000 means success. Other codes mean failure.            = */
            /* = -------------------------------------------------------------------------- = */
            var ERROR_CODE = "0000";
            var MESSAGE = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   02-3. CID, sNonce 설정                           = */
            /* =   - CID: Content ID입니다. 업체에서 생성해야 할 값입니다. BM 적용 전에는          = */
            /* =          CONFIG.php의 값을 사용합니다.                     = */
            /* =   - sNonce: PallyCon Cloud Server에서 요청할 때 전달하는 값으로 페이지에서       = */
            /* =             응답데이터를 PallyCon Cloud Server로 전달하면, 그 값이 유효한지        = */
            /* =             판단합니다.                           = */
            /* = -------------------------------------------------------------------------- = */
            /* =   02-3. CID, sNonce settings                                               = */
            /* =   - CID: Content ID generated by service provider. The default ID for test is  = */
            /* =          set by CONFIG.php file.                     = */
            /* =   - sNonce: A value which will be used for authentication of response.   = */
            /* =             It will be passed in a request from PallyCon Cloud server    = */
            /* =             and checked by PallyCon Cloud server in a response data.   = */
            /* = -------------------------------------------------------------------------- = */
            var CID = "";
            var sNonce = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   02-4. sResponse: PallyCon Cloud Server로 전달하는 응답값입니다.         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   02-4. sResponse: response data to PallyCon Cloud Server          = */
            /* = -------------------------------------------------------------------------- = */
            var sResponse = "";
            /* = -------------------------------------------------------------------------- = */
            /* =   02. 데이터 설정 END / End of data setting                                    = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   04. REQUEST DATA 파싱 / Parsing request data               = */
            /* = -------------------------------------------------------------------------- = */
            /* =   04-1. REQUEST DATA에서 data의 값을 추출합니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   04-1. Get data from REQUEST                        = */
            /* = -------------------------------------------------------------------------- = */
            var sData = "";
            if (data) {
                if (isTest == 1) {
                    console.log("[Original String]: " + data);
                    sData = makeDrm.encrypt(data);
                } else {
                    sData = data;
                }
                console.log('[Encrypted String]:' + sData);
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   04-2. 추출에 실패할 경우 에러코드와 메시지를 설정합니다.                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   04-2. Set error code and message if failed to parse data                 = */
            /* = -------------------------------------------------------------------------- = */
            else {
                ERROR_CODE = "1201";
                MESSAGE = "NO DATA";
                if (isTest == 1) console.log("[ERROR]: " + ERROR_CODE + "\n[MESSAGE]: " + MESSAGE);
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   04. REQUEST DATA 파싱 END / End of parsing request data          = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   05. REQUEST DATA 복호화 / Decrypt request data                = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   05-2. ERROR_CODE 값이 성공이면 복호화를 시작합니다.                 = */
            /* =   복호화에 실패할 경우 에러코드와 메시지를 설정합니다.                    = */
            /* = -------------------------------------------------------------------------- = */
            /* =   05-2. Starting decryption if ERROR_CODE is '0000'.           = */
            /* =   Set error code and message if failed to decrypt.                         = */
            /* = -------------------------------------------------------------------------- = */
            var sDecrypted = "";
            if (ERROR_CODE == "0000") {
                sDecrypted = makeDrm.decrypt(sData);
                if (sDecrypted) {
                    if (isTest == 1) console.log("[Decrypted String]: " + sDecrypted);
                } else {
                    ERROR_CODE = "1202";
                    MESSAGE = "Fail to Decrypt the data";
                    if (isTest == 1) console.log("[ERROR]: " + ERROR_CODE + "[MESSAGE]: " + MESSAGE);
                }
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   05. REQUEST DATA 복호화 END / End of decrypting request data        = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   06. XML 파싱 / XML Parsing                         = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   06-2. ERROR_CODE 값이 성공이면 XML을 파싱합니다.                 = */
            /* =   XML 파싱에 실패할 경우 에러코드와 메시지를 설정합니다.                   = */
            /* = -------------------------------------------------------------------------- = */
            /* =   06-2. Starts XML parsing if ERROR_CODE is '0000'.            = */
            /* =   Set error code and message if failed to parse XML.                       = */
            /* = -------------------------------------------------------------------------- = */
            var sJsonResult;
            if (ERROR_CODE == "0000") {
                xmlparser.parseString(sDecrypted, function(err, result) {
                    if (err) {
                        ERROR_CODE = "1203";
                        MESSAGE = "Fail to Parse XML";
                        if (isTest == 1) console.log("[ERROR]: " + ERROR_CODE + "[MESSAGE]: " + MESSAGE);
                    } else {
                        console.log('[XML-JSON Result] ' + JSON.stringify(result));
                        sJsonResult = result;
                        sNonce = sJsonResult.RES.NONCE;
                    }
                });
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   06. XML 파싱 END / End of XML parsing                    = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   07. Content ID 생성 / Content ID generation                              = */
            /* =                                                                            = */
            /* =   ※ 중요 :  업체의 정책을 반영하는 곳입니다.                                       = */
            /* =   ※ Note : Need to apply your CID generation rule here                     = */
            /* =                                                                            = */
            /* = -------------------------------------------------------------------------- = */
            /* = -------------------------------------------------------------------------- = */
            /* =   07-2. ERROR_CODE 값이 성공이면 Content ID 생성을 시작합니다.             = */
            /* = -------------------------------------------------------------------------- = */
            /* =   07-2. Starts generating Content ID if ERROR_CODE is '0000'.        = */
            /* = -------------------------------------------------------------------------- = */
            if (ERROR_CODE == "0000") {
                /*-
                 *
                 * [업체 청책 반영]
                 *
                 * 업체의 정책에 맞게 Content ID를 생성하는 로직을 이곳에 구현합니다.
                 * Content ID를 생성하는데 활용할 값은 다음과 같습니다.
                 *
                 * - $sFilePath
                 * - $sFileName
                 *
                 * ** BM 적용 전에는 CID를 CONFIG.php에서 정의된 $ContentID값으로 설정됩니다.
                 *
                 * ERROR_CODE는 성공일 경우 "0000"을 유지 시켜줍니다.
                 *
                 *
                 * [Applying CID rule]
                 *
                 * Your CID generation logic can be applied here.
                 * The below parameters can be used for the logic.
                 *
                 * - $sFilePath
                 * - $sFileName
                 *
                 * ** The default $ContentID value for test is defined in CONFIG.php.
                 *
                 * ERROR_CODE "0000" means success.
                 *
                 */
                ERROR_CODE = "0000";

                var sFilePath = sJsonResult.RES.FILEPATH.toString(); // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일 경로 입니다.
                var sFileName = sJsonResult.RES.FILENAME.toString(); // 업체에서 Content ID를 생성하는데 활용할 수 있는 원본파일명

                /*
                 * 퀵스타트 샘플은 파일명의 확장자를 제거한 파일명을 cid로 세팅하게 되어있습니다.
                 * 확장자를 제거한 파일명이 28자리를 넘어갈 경우 뒷부분을 잘라냅니다.
                 */
                var strName = sFileName.split('.')[0];
                if(strName.length > 28)
                  CID = strName.substring(0, 27);
                else
                  CID = strName;
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   07. Content ID 생성 END / End of Content ID generation                    = */
            /* ============================================================================== */


            /* ============================================================================== */
            /* =   08. 응답 데이타 생성 [XML] / Generating response data [XML]         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Content ID 생성 성공 여부에 따른 XML 값을 생성하여 전달합니다.             = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Creates and responds XML data with Content ID generation result          = */
            /* = -------------------------------------------------------------------------- = */
            sResponse = "<?xml version='1.0' encoding='utf-8'?><RES>";
            sResponse = sResponse + "<ERROR>" + ERROR_CODE + "</ERROR>";
            /* = -------------------------------------------------------------------------- = */
            /* =   08-1. ERROR_CODE 값이 성공이 아닐 경우 MESSAGE를 Contnet ID대신 추가         = */
            /* = -------------------------------------------------------------------------- = */
            /* =   08-1. Adds error message if ERROR_CODE is not '0000'           = */
            /* = -------------------------------------------------------------------------- = */
            if (ERROR_CODE != "0000") {
                sResponse = sResponse + "<ERRMSG>" + MESSAGE + "</ERRMSG>";
            }
            /* = -------------------------------------------------------------------------- = */
            /* =   08-2. ERROR_CODE 값이 성공일 경우 Contnet ID 값을 추가              = */
            /* = -------------------------------------------------------------------------- = */
            /* =   08-2. Adds Content ID value if ERROR_CODE is '0000'            = */
            /* = -------------------------------------------------------------------------- = */
            else {
                sResponse = sResponse + "<CID>" + CID + "</CID>";
            }
            sResponse = sResponse + "<NONCE>" + sNonce + "</NONCE></RES>";
            if (isTest == 1) console.log("[Result XML]: " + sResponse);
            /* = -------------------------------------------------------------------------- = */
            /* =   08. 응답 데이타 생성 [XML] END / End of response data generation [XML]        = */
            /* ============================================================================== */

            /* ============================================================================== */
            /* =   09. 응답 데이타 암호화 / Encryption of response data                           = */
            /* = -------------------------------------------------------------------------- = */
            /* =   XML 값을 생성하여 반환합니다.                                                 = */
            /* = -------------------------------------------------------------------------- = */
            /* =   Encrypts XML data to respond                                             = */
            /* = -------------------------------------------------------------------------- = */
            var sEncrypted = makeDrm.encrypt(sResponse);
            if (isTest == 1) console.log("[Encrypted XML]: " + sEncrypted);

            return sEncrypted;
            /* = -------------------------------------------------------------------------- = */
            /* =   09. 응답 데이타 암호화 END / End of response data encryption                   = */
            /* ============================================================================== */
        }
    };
})();