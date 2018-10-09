'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
    function ($, config, utils, messageTpl, cards, uuidv1) {
        var fallbackCount = 0;
        var oFallbackCount = 0;
         console.log('==== ');
        class ApiHandler {

            constructor() {
                let uuid = !localStorage.getItem('uuid') ? localStorage.setItem('uuid', uuidv1()) : localStorage.getItem('uuid');

                this.options = {
                    sessionId: uuid,
                    lang: "en"
                };

            }

            userSays(userInput, callback) {
                console.log('userInput == ',userInput.replace(/ /g,''));
                var str = userInput.replace(/\r?\n|\r/g,'')
                str = str.replace(/ /g,'')
                if(str == 'Auto'){
                    // callback(null, messageTpl.quickrepliesimg({
                    //     "payload": userInput,
                    //     "senderName": config.userTitle,
                    //     "senderAvatar": config.userAvatar,
                    //     "time": utils.currentTime(),
                    //     "className": 'pull-right'
                    // }));
                    let cardHTML = cards({
                        "payload": [
                          {
                            "type":4,
                            "platform":"facebook",
                            "payload":{
                              "facebook":{
                                "text":"",
                                "quick_replies_img":[{
                                  "content_type":"text",
                                  "title":"Auto",
                                  "payload":"Auto",
                                  "disabled":true
                                }]
                              }
                            }
                          }
                        ],
                        "senderName": config.userTitle,
                        "senderAvatar": config.userAvatar,
                        "time": utils.currentTime(),
                        "className": 'pull-right'
                    }, "quickrepliesimg");
                    callback(null, cardHTML);
                } else if(str == 'Home'){
                    // callback(null, messageTpl.quickrepliesimg({
                    //     "payload": userInput,
                    //     "senderName": config.userTitle,
                    //     "senderAvatar": config.userAvatar,
                    //     "time": utils.currentTime(),
                    //     "className": 'pull-right'
                    // }));
                    let cardHTML = cards({
                        "payload": [
                          {
                            "type":4,
                            "platform":"facebook",
                            "payload":{
                              "facebook":{
                                "text":"",
                                "quick_replies_img":[{
                                  "content_type":"text",
                                  "title":"Home",
                                  "payload":"Home",
                                  "disabled":true
                                }]
                              }
                            }
                          }
                        ],
                        "senderName": config.userTitle,
                        "senderAvatar": config.userAvatar,
                        "time": utils.currentTime(),
                        "className": 'pull-right'
                    }, "quickrepliesimg");
                    callback(null, cardHTML);
                } else if(str == 'Business'){
                    // callback(null, messageTpl.quickrepliesimg({
                    //     "payload": userInput,
                    //     "senderName": config.userTitle,
                    //     "senderAvatar": config.userAvatar,
                    //     "time": utils.currentTime(),
                    //     "className": 'pull-right'
                    // }));
                    let cardHTML = cards({
                        "payload": [
                          {
                            "type":4,
                            "platform":"facebook",
                            "payload":{
                              "facebook":{
                                "text":"",
                                "quick_replies_img":[{
                                  "content_type":"text",
                                  "title":"Business",
                                  "payload":"BusinessOwners",
                                  "disabled":true
                                }]
                              }
                            }
                          }
                        ],
                        "senderName": config.userTitle,
                        "senderAvatar": config.userAvatar,
                        "time": utils.currentTime(),
                        "className": 'pull-right'
                    }, "quickrepliesimg");
                    callback(null, cardHTML);
                } else {
                    callback(null, messageTpl.userplaintext({
                        "payload": userInput,
                        "senderName": config.userTitle,
                        "senderAvatar": config.userAvatar,
                        "time": utils.currentTime(),
                        "className": 'pull-right'
                    }));
                }
            }
            askBot(userInput, userText, callback) {
                this.userSays(userText, callback);
                var msg_container = $("ul#msg_container");
                this.options.query = userInput;

                $.ajax({
                    type: "POST",
                    url: "/webhook",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: function () {
                        msg_container.parent().append(`<img class="loading-gif-typing"src="/images/ellipsis.gif"  style="text-align:left; width: 69px;"  />`)
                    },
                    data: JSON.stringify(this.options),
                    success: function (response) {
                        if (msg_container && msg_container.parent() && msg_container.parent().find("img.loading-gif-typing").html()) {
                            msg_container.parent().find("img.loading-gif-typing").remove();
                        }
                        msg_container.parent().find("img.loading-gif-typing").remove();
                        let isCardorCarousel = false;
                        let isImage = false;
                        let isQuickReply = false;
                        let isQuickReplyImg = false;
                        let isQuickReplyFromApiai = false;
                        let quickreplies = false;
                        let multiplequickreplyfromapiai = false;
                        //Media attachment
                        let isVideo = false;
                        let videoUrl = null;
                        let isAudio = false;
                        let audioUrl = null;
                        let isFile = false;
                        let fileUrl = null;
                        let isReceipt = false;
                        let receiptData = null;
                        let isList = false;
                        let imageUrl;
                        // airline onboarding
                        let isAirlineBoardingPass = false;
                        let isViewBoardingPassBarCode = false;
                        let isAirlineCheckin = false;
                        let isAirlingFlightUpdate = false;
                        //Generic Template
                        let genericTemplate = false;
                        let genericElement = null;
                        let genericBuy = false;
                        let genericCheckout = null;
                        //To find Card || Carousel
                        let count = 0;
                        let hasbutton;
                        console.log('result *** ', JSON.stringify(response.result));
                        var dataList = document.getElementById('msg_container').getElementsByTagName("li");
                        // if (config.incompleteTran.includes(response.result.action)) {
                        //     console.log('Inside incomplete');
                        //     return utils.writeIncompleteTran(response.result, "PostLogin", "BroadBand", function (err, res) {
                        //         console.log(res);
                        //     });
                        // }
                        if (response.result.action == "input.unknown") {
                            fallbackCount++;
                            oFallbackCount++;
                            //console.log('==== ',oFallbackCount);
                        } else {
                            fallbackCount = 0;
                        }
                        // if(response.result.action == "input.GlassSize"){
                        //     $.ajax({
                        //         type: "POST",
                        //         url: "/claimCreate",
                        //         contentType: "application/json;",
                        //         dataType: "json",
                        //         success: function (response) {
                        //                     console.log("Rakesh Jha"+response);
                        //                     }})

                        // }
                        if (response.result.action == "Optus") {
                            utils.captureTranscript(dataList);
                            fallbackCount, oFallbackCount = 0;
                            callback(null, "Liveengage");
                        } else if (fallbackCount > 2 || oFallbackCount > 10) {
                            utils.captureTranscript(dataList);
                            fallbackCount, oFallbackCount = 0;
                            var html_div = `<li class="animated fadeInLeft list-group-item background-color-custom"><table border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;"><img width="35" height="35" src="avatar/logo-large.png"/></td><td><div class="media-body bot-txt-space"><p class="list-group-item-text-bot">I can't understand your queries, so am transferring you to a human agent. Please wait...</p><p class="bot-res-timestamp"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src="./avatar/bot-logo-image.png"/>` + utils.currentTime() + `</small></p></div></td></tr></table></li>`;
                            if (msg_container.hasClass('hidden')) { // cans be optimimzed and removed from here
                                msg_container.siblings("h1").addClass('hidden');
                                msg_container.siblings("div.chat-text-para").addClass('hidden');
                                msg_container.siblings(".header-text-logo").removeClass('hidden');
                                msg_container.removeClass('hidden');
                            }
                            msg_container.append(html_div);
                            utils.scrollSmoothToBottom($('div.chat-body'));
                            callback(null, "Liveengage");
                        } else if (response.result.fulfillment.messages) {
                            console.log(response.result.fulfillment.messages);
                            for (let i in response.result.fulfillment.messages) {
                                if (response.result.fulfillment.messages[i] && response.result.fulfillment.messages[i].hasOwnProperty('type')) {
                                    if (response.result.fulfillment.messages[i].type == 0 && response.result.fulfillment.messages[i].speech != "") {
                                        if (response.result.action == 'input.date') {
                                            let cardHTML = cards({
                                                "payload": response.result.fulfillment.messages[i].speech,
                                                "senderName": config.botTitle,
                                                "senderAvatar": config.botAvatar,
                                                "time": utils.currentTime(),
                                                "className": ''
                                            }, "fileUpload");
                                            callback(null, cardHTML);
                                        } else {
                                            let cardHTML = cards({
                                                "payload": response.result.fulfillment.messages[i].speech,
                                                "senderName": config.botTitle,
                                                "senderAvatar": config.botAvatar,
                                                "time": utils.currentTime(),
                                                "className": ''
                                            }, "plaintext");
                                            callback(null, cardHTML);
                                        }
                                    }
                                    if (response.result.fulfillment.messages[i].type == 1) {
                                        count = count + 1;
                                        hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                        isCardorCarousel = true;
                                    }
                                    if (response.result.fulfillment.messages[i].type == 3) {
                                        isImage = true;
                                    }
                                    let msgfulfill = response.result.fulfillment.messages[i];

                                    if (msgfulfill && msgfulfill.type == 4 && msgfulfill.hasOwnProperty("payload") && msgfulfill.payload.hasOwnProperty("facebook")) {
                                        //Quick Replies
                                        if (msgfulfill.payload.facebook.hasOwnProperty("quick_replies")) {
                                            isQuickReply = (msgfulfill.payload.facebook.quick_replies.length > 0) ? true : false;

                                        }
                                        if (msgfulfill.payload.facebook.hasOwnProperty("quick_replies_img")) {
                                            isQuickReplyImg = (msgfulfill.payload.facebook.quick_replies_img.length > 0) ? true : false;

                                        }

                                        if (msgfulfill.payload.facebook.hasOwnProperty("attachment")) {
                                            count = count + 1;
                                            response.result.fulfillment.messages = response.result.fulfillment.messages[i]["payload"]["facebook"]["attachment"]["payload"]["elements"]

                                            for (let j in response.result.fulfillment.messages) {
                                                response.result.fulfillment.messages[j]["type"] = 1
                                                response.result.fulfillment.messages[j]["imageUrl"] = response.result.fulfillment.messages[j]["image_url"]
                                            }

                                            hasbutton = (response.result.fulfillment.messages[i] && response.result.fulfillment.messages[i].hasOwnProperty("buttons") && response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                            isCardorCarousel = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            let cardHTML = cards({
                                "action": response.result.action,
                                "payload": response.result.fulfillment.speech,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "plaintext");
                            callback(null, cardHTML);
                        }


                        if (isCardorCarousel) {
                            if (count == 1) {
                                let cardHTML = cards({
                                    "action": response.result.action,
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''
                                }, "card");
                                callback(null, cardHTML);
                            } else {
                                let carouselHTML = cards({
                                    "action": response.result.action,
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''

                                }, "carousel");
                                callback(null, carouselHTML);
                            }
                        }
                        //Image Response
                        if (isImage) {
                            let cardHTML = cards(response.result.fulfillment.messages, "image");
                            callback(null, cardHTML);
                        }
                        //CustomPayload Quickreplies
                        if (isQuickReply) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "quickreplies");
                            callback(null, cardHTML);
                        }
                        if (isQuickReplyImg) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "quickrepliesimg");
                            callback(null, cardHTML);
                        }
                        if (multiplequickreplyfromapiai) {
                            let cardHTML = cards(response.result.fulfillment.messages, "multiplequickreplyfromapiai");
                            callback(null, cardHTML);
                        }
                        //Apiai Quickreply
                        if (isQuickReplyFromApiai) {
                            let cardHTML = cards(response.result.fulfillment.messages, "quickrepliesfromapiai");
                            callback(null, cardHTML);
                        }
                        //Video Attachment Payload callback
                        if (isVideo) {
                            let cardHTML = cards({
                                "payload": videoUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "video");
                            callback(null, cardHTML);
                        }
                        //Audio Attachment Payload callback
                        if (isAudio) {
                            let cardHTML = cards({
                                "payload": audioUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "audio");
                            callback(null, cardHTML);;
                        }
                        //File Attachment Payload callback
                        if (isFile) {
                            let cardHTML = cards({
                                "payload": fileUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "file");
                            callback(null, cardHTML);
                        }
                        // Receipt Attachment Payload callback
                        if (isReceipt) {
                            let cardHTML = cards({
                                "payload": receiptData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "receipt");
                            callback(null, cardHTML);
                        }
                        // airline Boarding Pass
                        if (isAirlineBoardingPass) {
                            let boardingPassHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineBoarding");
                            callback(null, boardingPassHTML);
                        }
                        // -----------------------------------

                        // airline Boarding Pass View bar code
                        if (isViewBoardingPassBarCode) {
                            let ViewBoardingPassBarCodeHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "ViewBoardingPassBarCode");
                            callback(null, ViewBoardingPassBarCodeHTML);
                        }
                        // airline Checkin
                        if (isAirlineCheckin) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineCheckin");
                            callback(null, CheckinHTML);
                        }

                        // airline flight update
                        if (isAirlingFlightUpdate) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineFlightUpdate");
                            callback(null, CheckinHTML);
                        }

                        // generic template
                        if (genericTemplate) {
                            let cardHTML = cards({
                                "payload": genericElement,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "generic");
                            callback(null, cardHTML);
                        }
                        // List template
                        if (isList) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "list");
                            callback(null, cardHTML);
                        }
                        // Buy
                        if (genericBuy) {
                            let cardHTML = cards({
                                "payload": genericCheckout,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "buybutton");
                            callback(null, cardHTML);

                        }

                    },
                    error: function (err) {
                        alert(JSON.stringify(err));
                        callback("Internal Server Error", null);
                    }
                });
            }
        }

        return function (accessToken) {
            return new ApiHandler();
        }
    });
