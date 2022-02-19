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
// @version      1.0d40
// @author       PiQuark6046 and contributors
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
// Used Open Source Projects:

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
            HeaderAddressArray: []
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
const LKSLib =
{
    window: typeof unsafeWindow == "undefined" ? window : unsafeWindow,
    MutationObserver: LKSLib.window.MutationObserver,
    MutationRecord: LKSLib.window.MutationRecord,
    location: LKSLib.window.location,
    GenerateRandom: function(BaseString, Length)
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
    },
    CheckElementHasStyle: function(Elementv, HasStyle)
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
    },
    CheckElementHasStyles: function(Elementv, HasStyleArray)
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
    },
    SearchElementsHasStyle: function(ElementType, HasStyle)
    {
        var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
        if (NodeList.prototype.isPrototypeOf(Elements))
        {
            return LKSLib.SearchElementHasStyle(Array.from(Elements), HasStyle);
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
    },
    SearchElementsHasStyles: function(ElementType, HasStyleArray) // ElementType support string, NodeList, Array. Elments of returned array have all each HasStyleArray.
    {
        var Elements = typeof ElementType == "string" ? LKSLib.window.document.querySelectorAll(ElementType) : ElementType, ReturnArray = [];
        if (NodeList.prototype.isPrototypeOf(Elements))
        {
            return LKSLib.SearchElementHasStyles(Array.from(Elements), HasStyleArray);
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
    },
    CheckHasElement: function(ParentElement, TargetElement, Depth) // null means that mentioned element does not exist. Returns bool type.
    {

    },
    CheckHasAncestorElement: function(TargetElement, ParentElement, Depth)
    {
        if (NodeList.prototype.isPrototypeOf(ParentElement) || Array.isArray(ParentElement) || typeof ParentElement == "string")
        {
            LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasAncestorElement", "Received ParentElement, but not an object.");
        }
        if (NodeList.prototype.isPrototypeOf(TargetElement) || Array.isArray(TargetElement) || typeof TargetElement == "string")
        {
            LKSDebug.Error("LISTKRSCRIPT.LKSLib.CheckHasAncestorElement", "Received TargetElement, but not an object.");
        }
        if (Depth != null || typeof Depth != "number")
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
    },
    CheckHasGenerationElement: function(BaseElement, TargetElement)
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
        if (Array.from(BaseElement.parentNode.childNodes).find(element => element == TargetElement))
        {
            return true;
        }
        else
        {
            return false;
        }
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
    CreateInvisibleElement: function(ParentElement, CoverElementsArray, IDLength)
    {
        if (NodeList.prototype.isPrototypeOf(ParentElement) || Array.isArray(ParentElement) || typeof ParentElement == "string")
        {
            LKSDebug.Error("LISTKRSCRIPT.LKSLib.CreateInvisibleElement", "Received ParentElement, but not an object.");
        }
        if (NodeList.prototype.isPrototypeOf(CoverElementsArray))
        {
            return LKSLib.CreateInvisibleElement(ParentElement, Array.from(CoverElementsArray));
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
    },
    CreateHoverElement: function(ParentElement, HoverElement)
    {

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
    case new RegExp(":\/\/namu\.wiki\/"):

    break;

    // inven.co.kr
    case new RegExp(":\/\/.{1,}\.inven\.co\.kr\/"):

    break;
    
    // ygosu.com
    case new RegExp(":\/\/ygosu\.com\/"):

    break;

    // ppss.kr
    case new RegExp(":\/\/ppss\.kr\/"):

    break;
};


// window.addEventListener("load", Blocker);
// window.addEventListener("pushState", Blocker);

})();