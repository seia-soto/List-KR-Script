// ==UserScript==
// @name         List-KR Script Dev
// @encoding     utf-8
// @namespace    https://github.com/List-KR/List-KR-Script
// @homepageURL  https://github.com/List-KR/List-KR-Script
// @supportURL   https://github.com/List-KR/List-KR-Script/issues
// @updateURL    https://github.com/List-KR/List-KR-Script/raw/master/List-KR-ScriptDev.user.js
// @downloadURL  https://github.com/List-KR/List-KR-Script/raw/master/List-KR-ScriptDev.user.js
// @license      MPL-2.0
//
// @version      1.0d4
// @author       PiQuark6046 ( piquark6046@protonmail.com ) and contributors
//
// @match        *://namu.wiki/w/*
// @match        *://*.inven.co.kr/*
// @match        *://ygosu.com/*
// @match        *://ppss.kr/*
// @match        *://ad-shield.io/*
// @exclude      *://member.inven.co.kr/*
// @exclude      *://namu.wiki/member/login?*
// @exclude      *://namu.wiki/w/사용자:*
//
// @description        List-KR Script allows you to block complicated advertisement to block on NamuWiki, website protected by ad-shield, etc.
//
// @grant        unsafeWindow
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

'use strict';
const LKSConstant =
{
    StyleSplitKey: ": ",
    NamuWiki:
    {
        ArticleElement: "div.namuwiki-toc-ad", PowerLinkHeaderArray: []
    }
};
const LKSDebug =
{
    Error: function(Name, Context)
    {
        var e = new Error(Context);
        e.name = Name;
        throw e;
    }
}
const LKSLib =
{
    window: typeof unsafeWindow == "undefined" ? window : unsafeWindow,
    MutationObserver: LKSLib.window.MutationObserver,
    MutationRecord: LKSLib.window.MutationRecord,
    location: LKSLib.window.location,
    SearchElementHasStyles: function(ElementType, HasStyleArray) // ElementType support string, NodeList, Array. Elments of returned array have all each HasStyleArray.
    {
        var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
        if (NodeList.prototype.isPrototypeOf(Elements))
        {
            return LKSLib.SearchElementHasStyles(Array.from(Elements), HasStyleArray);
        }
        
        return ReturnArray;
    },
    SearchElementHasStyle: function(ElementType, HasStyle)
    {
        var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
        if (NodeList.prototype.isPrototypeOf(Elements))
        {
            return LKSLib.SearchElementHasStyle(Array.from(Elements), HasStyle);
        }
        for (var i in Elements)
        {
            if (Elements[i].style[HasStyle.split(LKSConstant.StyleSplitKey)[0]] == HasStyle.split(LKSConstant.StyleSplitKey[1]))
            {
                ReturnArray.push(Elements[i]);
            }
        }
        return ReturnArray;
    },
    CheckElementHasStyles: function(ElementType, HasStyleArray)
    {

    },
    CheckElementHasStyle: function(Elements, HasStyle)
    {
        var ReturnArray = [];
        if (NodeList.prototype.isPrototypeOf(Elements))
        {
            return LKSLib.CheckElementHasStyle(Array.from(Elements), HasStyle);
        }
        for (var i in Elements)
        {
            if (Elements[i].style[HasStyle.split(LKSConstant.StyleSplitKey)[0]] == "")
            {
                continue;
            }
            if (Elements[i].style[HasStyle.split(LKSConstant.StyleSplitKey)[0]] == HasStyle.split(LKSConstant.StyleSplitKey[1]))
            {
                ReturnArray.push(Elements[i]);
            }
        }
        return ReturnArray;
    },
    CheckHasElement: function(ParentElement, TargetElement) // null means that mentioned element does not exist.
    {

    },
    CheckHasAncestorElement: function(ParentElement, TargetElement)
    {

    },
    HideElements: function(ElementArray)
    {
        if (!Array.isArray(ElementArray))
        {
            LKSDebug.Error("LISTKRSCRIPT.LKSLib.HideElements", "Received ElementArray, but not an array.");
        }
        for (var i in ElementArray)
        {
            ElementArray[i].style.display = "none";
        }
    },
    ConvertImageURLToBase64: function(ImageURL)
    {
        // If the request is falied, the function will return null.
        const ImageResponse = fetch(new Request(ImageURL));
        ImageResponse.then((res) => {if (!res.ok) { return null; }});
        ImageResponse.then(res => res.blob()).then(blob => {
            var ImageB = new Image();
            ImageB.src = URL.createObjectURL(blob);
            const Reader = new FileReader();
            Reader.addEventListener("load", () => {
                return Reader.result.replace("data:", "").replace(/^.+,/, "");
            });
            Reader.readAsDataURL(ImageB);
        });
    },
    ReleaseMemory: function(VariableArray) // To clear the variables, conver them with array.
    {
        if (VariableArray == undefined || VariableArray == null)
        {
            LKSDebug.Error("LISTKRSCRIPT.LKSLib.ReleaseMemory", "Received variableArray, but undefined or null.");
        }
        if (Array.isArray(VariableArray))
        {
            for (var i in VariableArray)
            {
                VariableArray[i] = null;
            }
        }
        else
        {
            VariableArray = null;
        }
    }
};

switch (LKSLib.location)
{
    // namu.wiki
    case new RegExp("\/\/namu\.wiki\/"):

    break;

    // inven.co.kr
    case new RegExp("\/\/.{1,}\.inven\.co\.kr\/"):

    break;
    
    // ygosu.com
    case new RegExp("\/\/ygosu\.com\/"):

    break;

    // ppss.kr
    case new RegExp("\/\/ppss\.kr\/"):

    break;
};


// window.addEventListener("load", Blocker);
// window.addEventListener("pushState", Blocker);