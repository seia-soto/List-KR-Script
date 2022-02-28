// ==UserScript==
// @name         List-KR Script Dev
// @encoding     utf-8
// @namespace    https://github.com/List-KR/List-KR-Script
// @homepageURL  https://github.com/List-KR/List-KR-Script
// @supportURL   https://github.com/List-KR/List-KR-Script/issues/4
// @updateURL    https://github.com/List-KR/List-KR-Script/raw/master/List-KR-ScriptDev.user.js
// @downloadURL  https://github.com/List-KR/List-KR-Script/raw/master/List-KR-ScriptDev.user.js
// @license      MPL-2.0
//
// @version      1.0d69
// @author       PiQuark6046 and contributors
//
// @match        *://namu.wiki/w/*
// @match        *://*.inven.co.kr/*
// @match        *://ygosu.com/*
// @match        *://ppss.kr/*
// @match        *://ad-shield.io/*
// @match        *://sports.donga.com/*
// @match        *://mlbpark.donga.com/*
// @exclude      *://secure.donga.com/*
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
// @require      https://github.com/List-KR/List-KR-Script/raw/master/JProtectionDev.user.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl
// ==/UserScript==
// Used Open Source Projects: TFjs (https://github.com/tensorflow/tfjs)

(function() {
'use strict';

const LKSConstant =
{
    StyleSplitKey: ": ",
    CreateInvisibleElement:
    {
        Styles: ["width", "height", "display", "visibility"],
        RandomElement: ["0px", "0px", "none", "collapse"],
        CoverElement: ["", "", "", ""]
    },
    CreateHoverElement:
    {
        Delay: 0
    },
    NamuWiki:
    {
        ArticleElementArray: ["div.wiki-paragraph", "div.wiki-heading-content", "div.namuwiki-toc-ad", ".wiki-heading"], 
        PowerLink:
        {
            HeaderAddressArray: ["//w.namu.la/s/05f69201b6b3e80dae3860e1d500f50da6b2a0aacad4f7b90f2ed7d68459e84c", "//w.namu.la/s/186360a9f9684aa6f9ddb4bd9df5e2362aa4bdf3dc944ea3088e6d9d17d1e854"]
        }
    },
    AdShield:
    {

    },
    Random:
    {
        String: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
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
var LKSLib = {};
LKSLib.window = typeof unsafeWindow == "undefined" ? window : unsafeWindow;
LKSLib.MutationObserver = LKSLib.window.MutationObserver;
LKSLib.MutationRecor = LKSLib.window.MutationRecord;
LKSLib.location = LKSLib.window.location;
LKSLib.GenerateRandom = function(BaseString, Length)
{
    if (typeof length == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.GenerateRandom", "Received Length, but not an number.");
    }
    var Returns;
    for (var i = 0; i < Length; i++)
    {
        Returns += BaseString.charAt(Math.floor(Math.random() * BaseString.length));
    }
    return Returns;
};
LKSLib.CheckElementHasStyle = function(Elementv, HasStyle)
{
    if (NodeList.prototype.isPrototypeOf(Elementv) || Array.isArray(Elementv) || typeof Elementv == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckElementHasStyle", "Received Elementv, but not an object.");
    }
    if (Elementv.style[HasStyle.split(LKSConstant.StyleSplitKey)[0]] == HasStyle.split(LKSConstant.StyleSplitKey[1]))
    {
        return true;
    }
    else
    {
        return false;
    }
};
LKSLib.CheckElementHasStyles = function(Elementv, HasStyleArray)
{
    if (NodeList.prototype.isPrototypeOf(Elementv) || Array.isArray(Elementv) || typeof Elementv == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckElementHasStyles", "Received Elementv, but not an object.");
    }
    for (var i in HasStyleArray)
    {
        if (LKSLib.CheckElementHasStyle(Elementv, HasStyleArray[i]) == false)
        {
            return false;
        }
    }
    return true;
};
LKSLib.SearchElementsHasStyle = function(ElementType, HasStyle)
{
    var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
    if (NodeList.prototype.isPrototypeOf(Elements))
    {
        Elements = Array.from(Elements);
    }
    for (var i in Elements)
    {
        if (LKSLib.CheckElementHasStyle(Elements[i], HasStyle))
        {
            ReturnArray.push(Elements[i]);
        }
    }
    if (ReturnArray.length > 0)
    {
        return ReturnArray;
    }
    else
    {
        return null;
    }
};
LKSLib.SearchElementsHasStyles = function(ElementType, HasStyleArray) // ElementType support string, NodeList, Array. Elments of returned array have all each HasStyleArray.
{
    var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
    if (NodeList.prototype.isPrototypeOf(Elements))
    {
        Elements = Array.from(Elements);
    }
    for (var i in Elements)
    {
        if (LKSLib.CheckElementHasStyles(Elements[i], HasStyleArray))
        {
            ReturnArray.push(Elements[i]);
        }
    }
    if (ReturnArray.length > 0)
    {
        return ReturnArray;
    }
    else
    {
        return null;
    }
};
LKSLib.CheckElementHasOnlyStyle = function(Elementv, HasStyle)
{
    if (NodeList.prototype.isPrototypeOf(Elementv) || Array.isArray(Elementv) || typeof Elementv == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckElementHasOnlyStyle", "Received Elementv, but not an object.");
    }
    if (Elementv.style[HasStyle.split(LKSConstant.StyleSplitKey)[0]] == HasStyle.split(LKSConstant.StyleSplitKey[1]))
    {
        return true;
    }
    else
    {
        return false;
    }
};
LKSLib.CheckElementHasOnlyStyles = function(Elementv, HasStyleArray)
{
    if (NodeList.prototype.isPrototypeOf(Elementv) || Array.isArray(Elementv) || typeof Elementv == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckElementHasOnlyStyles", "Received Elementv, but not an object.");
    }
    for (var i in HasStyleArray)
    {
        if (LKSLib.CheckElementHasOnlyStyle(Elementv, HasStyleArray[i]) == false)
        {
            return false;
        }
    }
    return true;
};
LKSLib.CheckHasElement = function(ParentElement, TargetElement, Depth) // null means that mentioned element does not exist. Returns bool type.
{
    if (NodeList.prototype.isPrototypeOf(ParentElement) || Array.isArray(ParentElement) || typeof ParentElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasElement", "Received ParentElement, but not an object.");
    }
    if (NodeList.prototype.isPrototypeOf(TargetElement) || Array.isArray(TargetElement) || typeof TargetElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasElement", "Received TargetElement, but not an object.");
    }
    if (Depth != null || typeof Depth != "number")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasElement", "Received Depth, but not a number or null.");
    }
    var ReturnArray = [ParentElement];
    Depth = Depth == null ? Number.MAX_SAFE_INTEGER : Depth;
    for (var i in ReturnArray)
    {
        if (ReturnArray[i] == TargetElement)
        {
            return true;
        }
        if (ReturnArray[i].childElementCount > 0)
        {
            for (var j in Array.from(ReturnArray[i].childNodes))
            {
                ReturnArray.push(Array.from(ReturnArray[i].childNodes)[j]);
            }
        }
    }
    return false;
};
LKSLib.CheckHasAncestorElement = function(TargetElement, ParentElement, Depth)
{
    if (NodeList.prototype.isPrototypeOf(ParentElement) || Array.isArray(ParentElement) || typeof ParentElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasAncestorElement", "Received ParentElement, but not an object.");
    }
    if (NodeList.prototype.isPrototypeOf(TargetElement) || Array.isArray(TargetElement) || typeof TargetElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasAncestorElement", "Received TargetElement, but not an object.");
    }
    if (Depth != null && typeof Depth != "number")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasAncestorElement", "Received Depth, but not a number or null.");
    }
    var ReturnArray = [ParentElement];
    Depth = Depth == null ? Number.MAX_SAFE_INTEGER : Depth;
    for (var i = 0; i < Depth; i++)
    {
        if (ReturnArray[i].parentNode.URL != undefined)
        {
            break;
        }
        ReturnArray.unshift(ReturnArray[i].parentNode);
    }
    if (ReturnArray.find(element => element == TargetElement) != undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
};
LKSLib.CheckHasGenerationElement = function(BaseElement, TargetElement)
{
    if (NodeList.prototype.isPrototypeOf(BaseElement) || Array.isArray(BaseElement) || typeof BaseElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasGenerationElement", "Received BaseElement, but not an object.");
    }
    if (NodeList.prototype.isPrototypeOf(TargetElement) || Array.isArray(TargetElement) || typeof TargetElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasGenerationElement", "Received TargetElement, but not an object.");
    }
    if (BaseElement.parentNode.URL != undefined)
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasGenerationElement", "Received BaseElement, but html.");
    }
    if (Array.from(BaseElement.parentNode.childNodes).find(element => element == TargetElement) != undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
};
LKSLib.HideElements = function(ElementArray)
{
    if (!Array.isArray(ElementArray))
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.HideElements", "Received ElementArray, but not an array.");
    }
    for (var i in ElementArray)
    {
        ElementArray[i].style.display = "none";
    }
};
LKSLib.CreateInvisibleElement = function(ParentElement, CoverElementsArray, IDLength)
{
    if (NodeList.prototype.isPrototypeOf(ParentElement) || Array.isArray(ParentElement) || typeof ParentElement == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CreateInvisibleElement", "Received ParentElement, but not an object.");
    }
    if (NodeList.prototype.isPrototypeOf(CoverElementsArray))
    {
        Elements = Array.from(Elements);
    }
    else if (typeof CoverElementsArray == "string")
    {
        LKSDebug.Error("LISTKRSCRIPT.LKSLib.CreateInvisibleElement", "Received ParentElement, but not an array or NodeList.");
    }
    var RandomElement = ParentElement.createElement("div#" + LKSLib.GenerateRandom(LKSConstant.Random, IDLength));
    for (var i in LKSConstant.CreateInvisibleElement.Styles)
    {
        RandomElement.style[LKSConstant.CreateInvisibleElement.Styles[i]] = LKSConstant.CreateInvisibleElement.RandomElement[i];
    }
    for (var j in CoverElementsArray)
    {
        for (var k in LKSConstant.CreateInvisibleElement.Styles)
        {
            if (LKSConstant.CreateInvisibleElement.CoverElement[j] != null)
            {
                CoverElementsArray[j].style[LKSConstant.CreateInvisibleElement.Styles[k]] = LKSConstant.CreateInvisibleElement.CoverElement[k];
            }
        }
        RandomElement.appendChild(CoverElementsArray[j]);
    }
};
LKSLib.CreateHoverElement = function(ParentElement, HoverElement, IDLength)
{

};
LKSLib.ConvertImageURLToBase64 = function(ImageURL)
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
};
LKSLib.ReleaseMemory = function(VariableArray) // To clear the variables, conver them with array.
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
};

// ######################################################################################
// ######################################################################################

switch (true)
{
    // namu.wiki
    case /:\/\/namu\.wiki\/w\//g.test(LKSLib.location):
        var ArticleTopElement;
        var Watch = function(MutationList, Observer)
        {
            for(var Mutation of MutationList)
            {
                for (var i in Array.from(Mutation.target.attributes))
                {
                    if (Array.from(Mutation.target.attributes)[i].name == "src" && LKSConstant.NamuWiki.PowerLink.HeaderAddressArray.find(element => element == Array.from(Mutation.target.attributes)[i].nodeValue) != undefined)
                    {
                        var DivElements = LKSLib.SearchElementsHasStyles("div", ["box-sizing: inherit", "word-break: break-all", "font-size: .9rem", "line-height: 1.5"]);
                        LKSLib.window.console.log(DivElements);
                    }
                }
            }
        };
        var func = function ()
        {
            for (var i in Array.from(LKSLib.window.document.querySelectorAll("img")))
            {
                new LKSLib.MutationObserver(Watch).observe(Array.from(document.querySelectorAll("img"))[i], {attributes: true});
            }
        };
        if (LKSLib.window.document.readyState == "complete" || LKSLib.window.document.readyState == "interactive")
        {
            func();
        }
        if (LKSLib.window.document.addEventListener)
        {
            LKSLib.window.document.addEventListener("DOMContentLoaded", func);
            LKSLib.window.document.addEventListener("hashchange", func);
        }
    break;

    // inven.co.kr
    case /:\/\/.{1,}\.inven\.co\.kr\//g.test(LKSLib.location):

    break;

    // ygosu.com
    case /:\/\/ygosu\.com\//g.test(LKSLib.location):

    break;

    // ppss.kr
    case /:\/\/ppss\.kr\/"/g.test(LKSLib.location):

    break;
};
})();