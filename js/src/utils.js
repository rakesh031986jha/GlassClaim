'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */
function showmesgtext(msg) {
    document.getElementById("btn-input").focus();
    document.getElementById("btn-input").value += msg.childNodes[0].data;
}

define(['navigation', 'jquery', 'moment', 'momenttimzone','momentdata'], function (navigation, $, moment, moments,momentd) {

    var methods = {};
    var chatTranscript = [];
    methods.currentTime = () => {

        var currentDate = new Date();
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
        var hours = (currentDate.getHours() < 10) ? '0' + currentDate.getHours() : currentDate.getHours();
        var minutes = (currentDate.getMinutes() < 10) ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        return `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${hours}:${minutes} ${ampm}`;
    };

   
    methods.scrollSmoothToBottom = (element) => {
        setTimeout(() => {
            var height = element[0].scrollHeight;
            element.scrollTop(height);
        }, 500);
    };
    methods.searchPage = (element) => {

        return navigation.data[element];
    };
    methods.getDateFormat = (zone,date) => {
        let curHr = momentd(date).tz("Asia/Kolkata").add(5, 'hours').add(30, 'minutes').format('MMMM Do YYYY, h:mm a');
        return curHr;
    };
    methods.getWelcomeMessage = () => {
        let curHr = momentd().tz("Australia/Sydney").format("HH");

        if (curHr < 12) {
            return 'Good Morning';
        } else if (curHr < 18) {
            return 'Good Afternoon'
        } else {
            return 'Good Evening'
        }
    };
    methods.initiateAjax = (url, type, data, callback) => {

        $.ajax({
            url: url,
            type: type,
            dataType: "json",
            data: data,
            success: function (result) {
                return callback(result, null);
            }, error: function (err) {
                return callback(null, err);
            }
        });
    }
    methods.getURLParameter = (name) => {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    methods.captureTranscript = (dataList) => {
        
        var botObj = [];
        var userObj = [];
        var cardMsg = 'Card';
        var objArr = { "Bot": "", "User": "" };
        for (var index = 0; index < dataList.length; index++) {
            if (dataList[index].getElementsByClassName("list-group-item-text-user")[0] == undefined) {
                if (dataList[index].getElementsByClassName("list-group-item-text-bot")[0] != undefined) {
                    botObj = dataList[index].getElementsByClassName("list-group-item-text-bot");
                } else if (dataList[index].getElementsByClassName("card-body")[0] != undefined) {
                    botObj = cardMsg;
                } else if (dataList[index].getElementsByClassName("list-group-item-quick-reply-space")[0] != undefined) {
                    botObj = dataList[index].getElementsByClassName("list-group-item-quick-reply-space");
                } else {
                    botObj[0] = undefined;
                }
            }
            userObj = dataList[index].getElementsByClassName("list-group-item-text-user");

            if (dataList[index].getElementsByClassName("list-group-item-text-bot")[0] != undefined || dataList[index].getElementsByClassName("list-group-item-quick-reply-space")[0] != undefined || typeof botObj === 'string') {
                objArr = { "Bot": "", "User": "" };
                if (typeof botObj === 'string') {
                    console.log("----Bot", index);
                    objArr.Bot = $.trim(botObj);
                    botObj = [];
                } else {
                    console.log(botObj[0].innerHTML);
                    console.log("----Bot", index);
                    objArr.Bot = $.trim(botObj[0].innerHTML);
                }
                chatTranscript.push(objArr);

            } else {
                console.log(userObj[0].innerHTML);
                console.log("-----User", index);
                objArr.User = $.trim(userObj[0].innerHTML);
                if (chatTranscript.length == 0) {
                    chatTranscript.push(objArr);
                }
            }
        }

        console.log(chatTranscript);
        let jsonData = {
            "ChatSession": localStorage.getItem("hashUser"),
            "ChatLESession":localStorage.getItem("chatLESession"),
            "UserName": "Charlotte",
            "ChatPage": "PostLogin",
            "Conversation": chatTranscript
        };

        console.log(jsonData);
        $.ajax({
            url: "/writeFile",
            type: "POST",
            dataType: "json",
            data: jsonData,
            success: function (result) {
                chatTranscript = [];
                console.log('Writing files...');
            }, error: function (err) {
                console.log(err);
            }
        });
    }

    methods.incompleteTransaction = (response, pageFrom, transactionType, callback) => {
        debugger;
        console.log(response);
        let jsonData = {
            "ChatSession": localStorage.getItem("uuid"),
            "UserName": "Charlotte",
            "ChatPage": pageFrom,
            "IsTransactionComplete": false,
            "TransactionType": transactionType
        };

        $.ajax({
            url: "/writeIncompleteTran",
            type: "POST",
            dataType: "json",
            data: jsonData,
            success: function (result) {
                console.log('Writing incomplete transacrion files...');
                return callback(null, result);
            }, error: function (err) {
                console.log(err);
                return callback(err, null);
            }
        });
    };


    return methods;
});
