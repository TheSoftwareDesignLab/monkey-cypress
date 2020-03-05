//Imports
require('cypress-plugin-tab');
var faker = require('faker');


//TODO: Read these properties from a json file
const url = Cypress.config('baseUrl') || "https://uniandes.edu.co/";
const appName = Cypress.config('hostName')|| "your app";
const events = Cypress.config('numEvents')|| 100;
const delay = Cypress.config('eventDelay') || 100;

const pct_clicks = Cypress.config('pctClicks') || 17;
const pct_scrolls = Cypress.config('pctKeys') || 16;
const pct_selectors = Cypress.config('pct') || 16;
const pct_keys = Cypress.config('pctKeys') || 16;
const pct_spkeys = Cypress.config('pctClicks') || 16;
const pct_pgnav = Cypress.config('pctKeys') || 16; 


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//cur of random monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var curX = 0;
var curY = 0;
var focused = false;
var pending_events = [,,,,,];  //TODO: Calculate the pending events of each type according to the total number of events and the percentage of each type of event

function randClick(){
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
                cy.get(`#${element.id}`).click();
            }
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.className.split(" ")[0];
                cy.get(`.${className}`).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).click({force:true});
                            i = $candidates.length; // Break out of iteration
                        }
                    }
                });
            }
            else{
                cy.get(element.tagName).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).click({force:true});
                            i = $candidates.length; // Break out of iteration
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
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.className.split(" ")[0];
                cy.get(`.${className}`).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).dblclick({force:true});
                            i = $candidates.length; // Break out of iteration
                        }
                    }
                });
            }
            else{
                cy.get(element.tagName).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).dblclick({force:true});
                            i = $candidates.length; // Break out of iteration
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
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.className.split(" ")[0];
                cy.get(`.${className}`).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            i = $candidates.length; // Break out of iteration
                        }
                    }
                });
            }
            else{
                cy.get(element.tagName).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i);
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true});
                            i = $candidates.length; // Break out of iteration
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
                else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                    cy.get(`.${element.className}`).trigger('mouseover');
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
    const specialKeys = ["{{}","{backspace}", "{del}","{downarrow}", "{end}", "{enter}", "{esc}","{home}",  "{leftarrow}", "{pagedown}", "{pageup}", "{rightarrow}", "{selectall}", "{uparrow}"];
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

function randomEvent(){
    //TODO: Include all functions
    //TODO: Differentiate different types of functions and document them
    //TODO: Choose the function if there are pending events of the corresponding types
    const functions = [randClick, randDClick, randRClick, avPag, rePag, horizontalScrollBk, horizontalScrollFw, reload, enter, spkeypress, changeViewport, typeCharKey, randHover, tab];//navBack, navForward];
    let fIndex = getRandomInt(0, functions.length-1);
    functions[fIndex]();
    cy.wait(delay);
}


describe( `${appName} under monkeys`, function() {
    it(`visits ${appName} and survives monkeys`, function() {
        cy.visit(url);
        cy.wait(1000);
        //TODO: Change the conditions to control the iteration
        for(let i = 0; i< events; i++){
            randomEvent();
            //randClick();
            cy.wait(delay);
        }
    })
})



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//End of random monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//cur of smart monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function clickRandAnchor(){
    cy.get('a').then($links => {
        var randomLink = $links.get(getRandomInt(0, $links.length));
        if(!Cypress.dom.isHidden(randomLink)) {
            cy.wrap(randomLink).click({force: true});
        }
    });
}

function clickRandButton(){
    cy.get('button').then($links => {
        var randomLink = $links.get(getRandomInt(0, $links.length));
        if(!Cypress.dom.isHidden(randomLink)) {
            cy.wrap(randomLink).click({force: true});
        }
    });
}

function fillInput(){ //Or fill form
    //TODO: Validate function
    cy.get("input").then($inputs => {
        window.document.getElementById().attr
        var inp = $inputs.get(getRandomInt(0, $inputs.length));
        if(!Cypress.dom.isHidden(inp)) {
            if(inp.getAttribute("type") == "email"){
                cy.wrap(inp).type(faker.internet.email);
            }
            else if(inp.getAttribute("type") == "button" || inp.getAttribute("type") == "submit" || inp.getAttribute("type") == "radio" || inp.getAttribute("type") == "checkbox"){
                cy.wrap(inp).click();
            }
            else if(inp.getAttribute("type") == "date"){
                cy.wrap(inp).type(faker.date);
            }
            else if(inp.getAttribute("type") == "tel"){
                cy.wrap(inp).type(faker.phone);
            }
            else if(inp.getAttribute("type") == "url"){
                cy.wrap(inp).type(faker.internet.url);
            }
            else if(inp.getAttribute("type") == "number"){
                cy.wrap(inp).type(faker.random.number);
            }
            else if(inp.getAttribute("type") == "text" || inp.getAttribute("type") == "password"){
                cy.wrap(inp).type(faker.random.alphaNumeric);
            }
        }
    });
}
function clearInput(){
    cy.get("input").then($inputs => {
        window.document.getElementById().attr
        var inp = $inputs.get(getRandomInt(0, $inputs.length));
        if(!Cypress.dom.isHidden(inp)) {
            cy.wrap(inp).clear();
        }
    });
}
function clearLocalStorage(){
    cy.clearLocalStorage();
}
function clearCookies(){
    cy.clearCookies();
}


function randomSEvent(){
    const functions = []; 
    let fIndex = getRandomInt(0, functions.length-1);
    functions[fIndex]();
    cy.wait(delay);
}

//TODO: Include all functions
//TODO: Define percentages for each type of function
//TODO: Control the iterations with other criteria that include the pending events
describe( `${appName} under smarter monkeys`, function() {
    it(`visits ${appName} and survives smarter monkeys`, function() {
        cy.visit(url);
        cy.wait(1000);
        for(let i = 0; i< events; i++){
            randomSEvent();
            cy.wait(delay);
        }
    })
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//End of smart monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------