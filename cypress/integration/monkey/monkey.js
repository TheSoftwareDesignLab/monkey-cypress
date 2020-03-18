//Import
require('cypress-plugin-tab');

const url = Cypress.config('baseUrl') || "https://uniandes.edu.co/";
const appName = Cypress.env('appName')|| "your app";
const events = Cypress.env('events')|| 100;
const delay = Cypress.env('delay') || 100;
const seed = Cypress.env('seed') || 12; 

const pct_clicks = Cypress.env('pctClicks') || 19;
const pct_scrolls = Cypress.env('pctScroll') || 17;
const pct_selectors = Cypress.env('pctSelectors') || 16;
const pct_keys = Cypress.env('pctKeys') || 16;
const pct_spkeys = Cypress.env('pctSpKeys') || 16;
const pct_pgnav = Cypress.env('pctPgNav') || 16; 

/*
 Bob Jenkins Small Fast, aka smallprng pseudo random number generator is the chosen selection for introducing seeding in the tester
 Credits of the implementation to bryc's answer in this stackoverflow post: https://stackoverflow.com/a/47593316 
*/
function jsf32(a, b, c, d) {
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = a - (b << 27 | b >>> 5) | 0;
        a = b ^ (c << 17 | c >>> 15);
        b = c + d | 0;
        c = d + t | 0;
        d = a + t | 0;
        return (d >>> 0) / 4294967296;
    }
}

var random = jsf32(0xF1AE533D, seed, seed, seed);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(random() * (max - min)) + min;
}

function fullPath(el){
    var names = [];
    while (el.parentNode){
      if (el.id){
        names.unshift('#'+el.id);
        break;
      }else{
        if (el==el.ownerDocument.documentElement) names.unshift(el.tagName);
        else{
          for (var c=1,e=el;e.previousElementSibling;e=e.previousElementSibling,c++);
          names.unshift(el.tagName+":nth-child("+c+")");
        }
        el=el.parentNode;
      }
    }
    return names.join(" > ");
  }


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Start of random monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var curX = 0;
var curY = 0;
var focused = false;

function randClick(){
    let viewportHeight = Cypress.config("viewportHeight");
    let viewportWidth = Cypress.config("viewportWidth");
    let randX = getRandomInt(curX, viewportWidth);
    let randY = getRandomInt(curY, viewportHeight);
    
    cy.window().then((win)=>{
        let element = win.document.elementFromPoint(randX, randY);
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).click();
            }
            /*
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".");
                cy.get(`.${className}`).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).click({force:true});
                            break;
                        }
                    }
                });
            }*/
            else{
                cy.get(fullPath(element)).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            break;
                        }
                    }
                });
            }
        }
        else{
            cy.get('body').click(randX, randY, {force:true});
        }
        focused = !!win.document.activeElement;
    })
}

function randDClick(){
    let viewportHeight = Cypress.config("viewportHeight");
    let viewportWidth = Cypress.config("viewportWidth");
    let randX = getRandomInt(curX, viewportWidth);
    let randY = getRandomInt(curY, viewportHeight);
    
    cy.window().then((win)=>{
        console.log(win.document)
        let element = win.document.elementFromPoint(randX, randY);
        console.log(element)
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).dblclick();
            }
            /*
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".");
                cy.get(`.${className}`).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).dblclick({force:true});
                            break;
                        }
                    }
                });
            }*/
            else{
                cy.get(fullPath(element)).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            break;
                        }
                    }
                });
            }
        }
        else{
            cy.get('body').dblclick(randX, randY, {force:true});
        }
        focused = !!win.document.activeElement;
    })
}

function randRClick(){
    let viewportHeight = Cypress.config("viewportHeight");
    let viewportWidth = Cypress.config("viewportWidth");
    let randX = getRandomInt(curX, viewportWidth);
    let randY = getRandomInt(curY, viewportHeight);
    
    cy.window().then((win)=>{
        console.log(win.document)
        let element = win.document.elementFromPoint(randX, randY);
        console.log(element)
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).rightclick();
            }
            /*else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".");
                cy.get(`.${className}`).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            break;
                        }
                    }
                });
            }*/
            else{
                cy.get(fullPath(element)).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            break;
                        }
                    }
                });
            }
        }
        else{
            cy.get('body').rightclick(randX, randY, {force:true});
        }
        focused = !!win.document.activeElement;
    })
}

function randHover(){
    let viewportHeight = Cypress.config("viewportHeight");
    let viewportWidth = Cypress.config("viewportWidth");
    let randX = getRandomInt(curX, viewportWidth);
    let randY = getRandomInt(curY, viewportHeight);

    cy.window().then((win)=>{
        let element = win.document.elementFromPoint(randX, randY);
        if(!!element){
            if(element.hasAttribute('onmouseover')){
                //Use cypress selector if any fits
                if(!!element.id){ //boolean that indicates if the element has a non-empty id
                    cy.get(`#${element.id}`).trigger('mouseover');
                }
                /*else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                    cy.get(`.${element.className}`).then($candidates => {
                        //rightclick the first visible candidate
                        for(let i = 0; i < $candidates.length; i++){
                            let candidate = $candidates.get(i);
                            if(!Cypress.dom.isHidden(candidate)){
                                cy.wrap(candidate).trigger('mouseover');
                                break;
                            }
                        }
                    })
                }*/
                else{
                    cy.get(fullPath(element)).then($candidates => {
                        //hover the first visible candidate
                        for(let i = 0; i < $candidates.length; i++){
                            let candidate = $candidates.get(i);
                            if(!Cypress.dom.isHidden(candidate)){
                                cy.wrap(candidate).trigger('mouseover');
                                break;
                            }
                        }
                    });
                }
            }
        }
        focused = !!win.document.activeElement;
    })
}

function avPag(){
    let viewportHeight = Cypress.config("viewportHeight");
    curY = curY + viewportHeight;
    cy.scrollTo(curX, curY);
}

function rePag(){
    let viewportHeight = Cypress.config("viewportHeight");
    curY = (viewportHeight > curY)? 0 : curY - viewportHeight;
    cy.scrollTo(curX, curY);
}

function horizontalScrollFw(){
    let viewportWidth = Cypress.config("viewportWidth");
    curX = curX + viewportWidth;
    cy.scrollTo(curX, curY);    
}

function horizontalScrollBk(){
    let viewportWidth = Cypress.config("viewportWidth");
    curX = (viewportWidth > curX)? 0: curX - viewportWidth;
    cy.scrollTo(curX, curY);    
}

function reload(){
    cy.reload();
    focused = false;
}

function enter(){
   if(focused){
       cy.focused().type("{enter}");
   }
   else{
       cy.get('body').type("{enter}")
   }
}

function typeCharKey(){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let type = chars.charAt(getRandomInt(0, chars.length-1));
    if(focused){
        cy.focused().type(type);
    }
    else{
        cy.get('body').type(type);
    }
}

function spkeypress(){
    const specialKeys = ["{{}","{backspace}", "{del}","{downarrow}", "{end}", "{esc}","{home}",  "{leftarrow}", "{pagedown}", "{pageup}", "{rightarrow}", "{selectall}", "{uparrow}"];
    const modifiers = ["{alt}", "{ctrl}", "{meta}", "{shift}", ""];
    let modIndex = getRandomInt(0, modifiers.length-1);
    let spkIndex = getRandomInt(0, specialKeys.length-1);
    let type = modifiers[modIndex] + specialKeys[spkIndex];
    if(focused){
        cy.focused().type(type);
    }
    else{
        cy.get('body').type(type);
    }
}

function changeViewport(){
    const viewports = ["ipad-2", "ipad-mini", "iphone-3", "iphone-4", "iphone-5", "iphone-6", "iphone-6+", "iphone-x", "iphone-xr", "macbook-11", "macbook-13", "macbook-15", "samsung-note9", "samsung-s10"];
    let index = getRandomInt(0, viewports.length-1);
    const orientations = ["portrait", "landscape"];
    let oindex = getRandomInt(0, orientations.length-1);
    cy.viewport(viewports[index], orientations[oindex]);
}

function navBack(){
    cy.url().then((path)=>{
        if(url!==path){
            cy.go(-1)
        }
    });
}

function navForward(){
    cy.go(1)
}

function tab(){
    if(focused)
        cy.focused().tab().focus()
    else
        cy.get('body').tab().focus()
    focused = true
}

function getEvtType(i){
    if(i===0) return "Random click"
    else if (i===1) return "Scroll event"
    else if (i===2) return "Selector focus"
    else if (i===3) return "Keypress"
    else if (i===4) return "Special Keypress"
    else if (i===5) return "Page Navigation"
}

//Aggregate in a matrix-like constant
const functions = [
    [randClick, randDClick, randRClick], 
    [horizontalScrollBk, horizontalScrollFw, avPag, rePag], 
    [randHover, tab], 
    [typeCharKey], 
    [spkeypress, enter], 
    [reload, navBack, navForward, changeViewport]
];

var screenshotIndex = 0;

function randomEvent(){
    let typeIndex = getRandomInt(0, pending_events.length);
    if(pending_events[typeIndex] > 0){
        screenshotIndex +=1;
        //cy.screenshot('smart/'+screenshotIndex+"-"+ getEvtType(typeIndex)+"-before")
        let fIndex = getRandomInt(0, functions[typeIndex].length-1);
        functions[typeIndex][fIndex]();
        pending_events[typeIndex] --;
        cy.wait(delay);
        //cy.screenshot('smart/'+screenshotIndex+"-"+ getEvtType(typeIndex)+"-after")
    }
    else{
        functions.splice(typeIndex, 1);
        pending_events.splice(typeIndex, 1);
        //randomEvent();
    }
}

var pending_events = [,,,,,]; 

describe( `${appName} under monkeys`, function() {
    it(`visits ${appName} and survives monkeys`, function() {
        if(pct_clicks+pct_scrolls+pct_keys+pct_pgnav+pct_selectors+pct_spkeys === 100){
            
            pending_events[0] = events*pct_clicks/100;
            pending_events[1] = events*pct_scrolls/100;
            pending_events[2] = events*pct_selectors/100;
            pending_events[3] = events*pct_keys/100;
            pending_events[4] = events*pct_spkeys/100;
            pending_events[5] = events*pct_pgnav/100;
            
            cy.visit(url);
            cy.wait(1000);
            //Add an event for each type of event in order to enter the else statement of randomEvent method
            for(let i = 0; i < events + 5; i++){
                randomEvent();
            }
        }
    })
})


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//End of random monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
