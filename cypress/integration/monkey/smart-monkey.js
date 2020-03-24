//Imports
require('cypress-plugin-tab');
var fs = require('fs');
var faker = require('faker');

const url = Cypress.config('baseUrl') || "https://uniandes.edu.co/";
const appName = Cypress.env('appName')|| "your app";
const events = Cypress.env('events')|| 100;
const delay = Cypress.env('delay') || 100;
const seed = Cypress.env('seed') || 12;

const num_categories = 7;

const pct_clicks = Cypress.env('pctClicks') || 12;
const pct_scrolls = Cypress.env('pctScroll') || 12;
const pct_selectors = Cypress.env('pctSelectors') || 12;
const pct_keys = Cypress.env('pctKeys') || 12;
const pct_spkeys = Cypress.env('pctSpKeys') || 12;
const pct_pgnav = Cypress.env('pctPgNav') || 12; 
const pct_browserChaos = Cypress.env('pctBwChaos') || 12;
const pct_actions = Cypress.env('pctActions') || 16;

const LOG_FILENAME = "../../../results/smart-monkey-execution.html";

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

function logCommand(index, funtype, info){
    let html = `<h2>(${index}.) ${funtype} event</h2>`
    if(!!info) html+=`<p><strong>Details: </strong> ${info}</p>`
    fs.appendFile(LOG_FILENAME, html, (err) => {
        if (err) throw err;
        console.log(`Logged #${index}`);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Start of smart monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var viewportHeight = Cypress.config("viewportHeight")
var viewportWidth = Cypress.config("viewportWidth")
var curX = 0
var curY = 0
var curPageMaxX = viewportWidth
var curPageMaxY = viewportHeight
var evtIndex = 1
var focused = false

function randClick(){
    
    let randX = getRandomInt(curX, viewportWidth)
    let randY = getRandomInt(curY, viewportHeight)
    
    cy.window().then((win)=>{
        let info = ""
        let element = win.document.elementFromPoint(randX, randY)
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).click()
                info = `${element.tagName} with id: ${element.id}`
            }
            /*
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".")
                cy.get(`.${className}`).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0 i < $candidates.length i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).click({force:true})
                            break
                        }
                    }
                })
            }*/
            else{
                let jsPath = fullPath(element)
                cy.get(jsPath).then($candidates => {
                    //click the first visible candidate
                    for(let i = 0 ;i < $candidates.length; i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).click({force:true})
                            break
                        }
                    }
                })
                info = `DOM element with path: ${jsPath}`
            }
        }
        else{
            cy.get('body').click(randX, randY, {force:true})
            info = `Position: (${randX}, ${randY}). INVALID, no selectable element`
        }
        cy.task("logCommand", { funtype: "Random click", info: info})
        focused = !!win.document.activeElement
    })
}

function randDClick(){

    let randX = getRandomInt(curX, viewportWidth)
    let randY = getRandomInt(curY, viewportHeight)
    
    cy.window().then((win)=>{
        let info = ""
        console.log(win.document)
        let element = win.document.elementFromPoint(randX, randY)
        console.log(element)
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).dblclick()
                info = `${element.tagName} with id: ${element.id}`
            }
            /*
            else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".")
                cy.get(`.${className}`).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0 i < $candidates.length i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).dblclick({force:true})
                            break
                        }
                    }
                })
            }*/
            else{
                let jsPath = fullPath(element)
                cy.get(jsPath).then($candidates => {
                    //dblclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).dblclick({force:true})
                            break
                        }
                    }
                })
                info = `DOM element with path: ${jsPath}`
            }
        }
        else{
            cy.get('body').dblclick(randX, randY, {force:true})
            info = `Position: (${randX}, ${randY}). INVALID, no selectable element`
        }
        cy.task("logCommand", { funtype: "Random double click", info: info})
        focused = !!win.document.activeElement
    })
}

function randRClick(){
    
    let randX = getRandomInt(curX, viewportWidth)
    let randY = getRandomInt(curY, viewportHeight)
    
    cy.window().then((win)=>{
        let info = ""
        console.log(win.document)
        let element = win.document.elementFromPoint(randX, randY)
        console.log(element)
        if(!!element){
            //Use cypress selector if any fits
            if(!!element.id){ //boolean that indicates if the element has a non-empty id
                cy.get(`#${element.id}`).rightclick()
                info = `${element.tagName} with id: ${element.id}`
            }
            /*else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                let className = element.tagName.splice(0,1)+'.'+element.className.replace(/\s/g, ".")
                cy.get(`.${className}`).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0 i < $candidates.length i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true})
                            break
                        }
                    }
                })
            }*/
            else{
                let jsPath = fullPath(element)
                cy.get(jsPath).then($candidates => {
                    //rightclick the first visible candidate
                    for(let i = 0; i < $candidates.length; i++){
                        let candidate = $candidates.get(i)
                        if(!Cypress.dom.isHidden(candidate)){
                            cy.wrap(candidate).rightclick({force:true})
                            break
                        }
                    }
                })
                info = `DOM element with path: ${jsPath}`
            }
        }
        else{
            cy.get('body').rightclick(randX, randY, {force:true})
            info = `Position: (${randX}, ${randY}). INVALID, no selectable element`
        }        
        cy.task("logCommand", { funtype: "Random right click", info: info})
        focused = !!win.document.activeElement
    })
}

function randHover(){
    
    let randX = getRandomInt(curX, viewportWidth)
    let randY = getRandomInt(curY, viewportHeight)

    cy.window().then((win)=>{
        let info = ""
        let element = win.document.elementFromPoint(randX, randY)
        if(!!element){
            if(element.hasAttribute('onmouseover')){
                //Use cypress selector if any fits
                if(!!element.id){ //boolean that indicates if the element has a non-empty id
                    cy.get(`#${element.id}`).trigger('mouseover')
                    info = `${element.tagName} with id: ${element.id}`
                }
                /*else if(!!element.className){ //boolean that indicates if the element has a non-empty className
                    cy.get(`.${element.className}`).then($candidates => {
                        //rightclick the first visible candidate
                        for(let i = 0 i < $candidates.length i++){
                            let candidate = $candidates.get(i)
                            if(!Cypress.dom.isHidden(candidate)){
                                cy.wrap(candidate).trigger('mouseover')
                                break
                            }
                        }
                    })
                }*/
                else{
                    let jsPath = fullPath(element)
                    cy.get(fullPath(element)).then($candidates => {
                        //hover the first visible candidate
                        for(let i = 0; i < $candidates.length; i++){
                            let candidate = $candidates.get(i)
                            if(!Cypress.dom.isHidden(candidate)){
                                cy.wrap(candidate).trigger('mouseover')
                                break
                            }
                        }
                    })
                    info = `DOM element with path: ${jsPath}`
                }
            }
            else info = `Position: (${randX}, ${randY}). INVALID, element has no attribute onmouseover`
        }
        else info = `Position: (${randX}, ${randY}). INVALID, no selectable element`
        cy.task("logCommand", { funtype: "Selector focus (hover)", info: info})
        focused = !!win.document.activeElement
    })
}

function avPag(){
    let info = ""
    let prev = curY.valueOf()
    if(curPageMaxY - curY >= viewportHeight){ 
        if(curPageMaxY - (curY + viewportHeight) >= viewportHeight){
            curY = curY + viewportHeight
            cy.scrollTo(curX, curY)
        } 
        else{
            curY = curPageMaxY - viewportHeight
            cy.scrollTo(curX, curY)
            info += "Page limit reached! "
        }
        info += `Successfully scrolled down from y=${prev} to y=${curY}`
    }
    else{
        info = "INVALID. Not able to scroll down anymore"
    }
    cy.task("logCommand", { funtype: "Scroll event (pg down)", info: info})
}

function rePag(){
    let info = ""
    let prev = curY.valueOf()
    if(curY === 0){
        info = "INVALID. Not able to scroll up anymore"
    }
    else{
        if(viewportHeight > curY){
            curY =  0
            cy.scrollTo(curX, curY)
            info += "Page limit reached! "
        }
        else{
            curY = curY - viewportHeight
            cy.scrollTo(curX, curY)
        }
        info += `Successfully scrolled up from y=${prev} to y=${curY}`
    }
    cy.task("logCommand", { funtype: "Scroll event (pg up)", info: info})
}

function horizontalScrollFw(){
    let info = ""
    let prev = curX.valueOf()
    if(curPageMaxX - curX >= viewportWidth){ 
        if(curPageMaxX - (curX + viewportWidth) >= viewportWidth){
            curX = curX + viewportWidth
            cy.scrollTo(curX, curY)
        } 
        else{
            curX = curPageMaxX - viewportWidth
            cy.scrollTo(curX, curY)
            info += "Page limit reached! "
        }
        info += `Successfully scrolled to the right from x=${prev} to x=${curX}`
    }
    else{
        info = "INVALID. Not able to scroll to the right anymore"
    }
    cy.task("logCommand", { funtype: "Scroll event (horizontal fw)", info: info})
}

function horizontalScrollBk(){
    let info = ""
    let prev = curX.valueOf()
    if(curX === 0){
        info = "INVALID. Not able to scroll to the left anymore"
    }
    else{
        if(viewportWidth > curX){
            curX =  0
            cy.scrollTo(curX, curY)
            info += "Page limit reached! "
        }
        else{
            curX = curX - viewportWidth
            cy.scrollTo(curX, curY)
        }
        info += `Successfully scrolled to the left from x=${prev} to x=${curX}`
    }
    cy.task("logCommand", { funtype: "Scroll event (horizontal bk)", info: info})
}

function reload(){
    cy.reload()
    focused = false
    cy.task("logCommand", { funtype: "Page navigation (Reload)", info: "Successfully reloaded the page"})
}

function enter(){
    let info = ""
    if(focused){
        cy.focused().type("{enter}")
        info = "Pressed enter on the element in focus"
    }
    else{
        cy.get('body').type("{enter}")
        info = "INVALID. No element is in focus"
    }
    cy.task("logCommand", { funtype: "Special key press (enter)", info: info})
}

function typeCharKey(){
    let info = ""
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let type = chars.charAt(getRandomInt(0, chars.length-1))
    if(focused){
        cy.focused().type(type)
        info = `Pressed the ${type} key on the element in focus`
    }
    else{
        cy.get('body').type(type)
        info = "INVALID. No element is in focus"
    }
    cy.task("logCommand", { funtype: "Key press", info: info})
}

function spkeypress(){
    let info = ""
    const specialKeys = ["{{}","{backspace}", "{del}","{downarrow}", "{end}", "{esc}","{home}",  "{leftarrow}", "{pagedown}", "{pageup}", "{rightarrow}", "{selectall}", "{uparrow}"]
    const modifiers = ["{alt}", "{ctrl}", "{meta}", "{shift}", ""]
    let modIndex = getRandomInt(0, modifiers.length-1)
    let spkIndex = getRandomInt(0, specialKeys.length-1)
    let type = modifiers[modIndex] + specialKeys[spkIndex]
    if(focused){
        cy.focused().type(type)
        info = `Pressed the ${type} combination of special keys on the element in focus`
    }
    else{
        cy.get('body').type(type)
        info = `No element is in focus. Pressed the ${type} combination of special keys on the page body`
    }
    cy.task("logCommand", { funtype: "Special key press", info: info})
}

function changeViewport(){
    const viewports = ["ipad-2", "ipad-mini", "iphone-3", "iphone-4", "iphone-5", "iphone-6", "iphone-6+", "iphone-x", "iphone-xr", "macbook-11", "macbook-13", "macbook-15", "samsung-note9", "samsung-s10"]
    let index = getRandomInt(0, viewports.length-1)
    const orientations = ["portrait", "landscape"]
    let oindex = getRandomInt(0, orientations.length-1)
    cy.viewport(viewports[index], orientations[oindex])
    viewportHeight = Cypress.config("viewportHeight")
    viewportWidth = Cypress.config("viewportWidth")
    cy.window().then((win)=>{
        let d = win.document
        /**
         * fragment taken from https://stackoverflow.com/a/17698713
         */
        curPageMaxY = Math.max( d.body.scrollHeight, d.body.offsetHeight, d.documentElement.clientHeight, d.documentElement.scrollHeight, d.documentElement.offsetHeight) - win.innerHeight
        curPageMaxX = Math.max( d.body.scrollWidth, d.body.offsetWidth, d.documentElement.clientWidth, d.documentElement.scrollWidth, d.documentElement.offsetWidth) - win.innerWidth
    })
    cy.task("logCommand", { funtype: "Viewport change", info: `Changed the viewport to ${viewports[index]} with ${orientations[index]} orientation`})
}

function navBack(){
    cy.url().then((path)=>{
        let info = ""
        if(url!==path){
            cy.go(-1)
            info = "Navigated 1 page back"
        }
        else info = "INVALID. Navigation stack empty"
        cy.task("logCommand", { funtype: "Page navigation (back)", info: info})
    })
}

function navForward(){
    cy.go(1)
    cy.task("logCommand", { funtype: "Page navigation (forward)", info: "Attempted to navigate 1 page forward"})
}

function tab(){
    let info = ""
    if(focused){
        cy.focused().tab().focus()
        info = "Tabbed to the next element after the one in focus"
    }
    else{
        cy.get('body').tab().focus()
        info = "Tabbed into the first focusable element of the document"
    }
    focused = true
    cy.task("logCommand", { funtype: "Selector focus (tab)", info: info})
}


function clickRandAnchor(){
    cy.window().then((win)=>{
        let $links = win.document.getElementsByTagName("a");
        let info = ""
        if($links.length > 0){
            let randomLink = $links.item(getRandomInt(0, $links.length));
            if(!Cypress.dom.isHidden(randomLink)) {
                cy.wrap(randomLink).click({force: true});
                info = `Clicked link to: ${randomLink.href}`
            } else info = `Link to ${randomLink.href} is hidden`
        } else info = "INVALID. There are no anchor elements in the current page"
        cy.task("logCommand", {funtype: "Action: click anchor", info: info})
    })
}

function clickRandButton(){
    cy.window().then((win)=>{
        let $buttons = win.document.getElementsByTagName("button");
        let info = ""
        if($buttons.length > 0){
            let randomButton = $buttons.item(getRandomInt(0, $buttons.length));
            if(!Cypress.dom.isHidden(randomButton)) {
                cy.wrap(randomButton).click({force: true});
                info = `Clicked button ${randomButton.textContent} with jsPath ${fullPath(randomButton)}`
            } else info = `Button ${randomButton.textContent} is hidden`
        } else info = "INVALID. There are no buttons in the current page" 
        cy.task("logCommand", {funtype: "Action: click button", info: info})
    })
}

function fillInput(){ //Or fill form
    cy.window().then((win)=>{
        let $inputs = win.document.getElementsByTagName("input");
        let info = ""
        if($inputs.length > 0){
            var inp = $inputs.item(getRandomInt(0, $inputs.length));
            //console.log(inp);
            //console.log(inp.getAttribute("type"));
            if(!Cypress.dom.isHidden(inp)) {
                focused = true;
                if(inp.getAttribute("type") == "email"){
                    let type = faker.internet.email;
                    cy.wrap(inp).type(faker.internet.email);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else if(inp.getAttribute("type") == "button" || inp.getAttribute("type") == "submit" || inp.getAttribute("type") == "radio" || inp.getAttribute("type") == "checkbox"){
                    cy.wrap(inp).click();
                    info = `Input ${inp.id} of type ${inp.getAttribute()} was clicked`
                }
                else if(inp.getAttribute("type") == "date"){
                    let type = faker.date;
                    cy.wrap(inp).type(faker.date);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else if(inp.getAttribute("type") == "tel"){
                    let type = faker.phone;
                    cy.wrap(inp).type(type);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else if(inp.getAttribute("type") == "url"){
                    let type = faker.internet.url
                    cy.wrap(inp).type(type);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else if(inp.getAttribute("type") == "number"){
                    let type = faker.random.number
                    cy.wrap(inp).type(type);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else if(inp.getAttribute("type") == "text" || inp.getAttribute("type") == "password"){
                    let type = faker.random.alphaNumeric
                    cy.wrap(inp).type(type);
                    info = `Input ${inp.id} was filled with ${type}`
                }
                else {
                    focused = false;
                    info = `Input ${inp.id} is of type ${inp.getAttribute("type")}`
                }
            }
            else info = `Input ${inp.id} is hidden`
        }
        else info = "INVALID. There are no input elements in the current page"        
        
        cy.task("logCommand", {funtype: "Action: click anchor", info: info})
    })
}
function clearInput(){
    cy.window().then((win)=>{
        let info = ""
        let inputs = win.document.getElementsByTagName("input")
        if(inputs.length > 0){
             var inp = inputs.item(getRandomInt(0, inputs.length));
            if(!Cypress.dom.isHidden(inp)) {
                cy.wrap(inp).clear();
                focused = true;
                info = `Cleared input ${inp.id}`
            }
            else info = `Input ${inp.id} is hidden`
        }
        else info = "INVALID. There are no input elements in the current page"
        cy.task("logCommand", {funtype: "Action: click anchor", info: info})
    })
}
function clearLocalStorage(){
    cy.clearLocalStorage();
    cy.task("logCommand", {funtype: "Chaos: Clear local storage", info: "Local storage is clear"})
}
function clearCookies(){
    cy.clearCookies();
    cy.task("logCommand", {funtype: "Chaos: Clear cookies", info: "Cookies are clear"})
}

//var screenshotIndex = 0;

function randomEvent(){
    let typeIndex = getRandomInt(0, pending_events.length);
    if(pending_events[typeIndex] > 0){
        //screenshotIndex += 1;
        //cy.screenshot('smart/'+screenshotIndex+"-"+ getEvtType(typeIndex)+"-before");
        let fIndex = getRandomInt(0, functions[typeIndex].length-1);
        functions[typeIndex][fIndex]();
        pending_events[typeIndex] --;
        cy.wait(delay);
        //cy.screenshot('smart/'+screenshotIndex+"-"+ getEvtType(typeIndex)+"-after");
    }
    else{
        functions.splice(typeIndex, 1);
        pending_events.splice(typeIndex, 1);
    }
}

function getEvtType(i){
    if(i===0) return "Random click"
    else if (i===1) return "Scroll event"
    else if (i===2) return "Selector focus"
    else if (i===3) return "Keypress"
    else if (i===4) return "Special Keypress"
    else if (i===5) return "Page Navigation"
    else if (i===6) return "Browser Chaos"
    else if (i===7) return "Action/Click"
}

var pending_events = [,,,,,,,]; 

//Aggregate in a matrix-like constant
const functions = [
    [randClick, randDClick, randRClick], 
    [horizontalScrollBk, horizontalScrollFw, avPag, rePag], 
    [randHover, tab], 
    [typeCharKey], 
    [spkeypress, enter], 
    [reload, navBack, navForward],
    [changeViewport, clearCookies, clearLocalStorage],
    [fillInput, clearInput, clickRandAnchor, clickRandButton]
];

describe( `${appName} under smarter monkeys`, function() {
    it(`visits ${appName} and survives smarter monkeys`, function() {
        beforeEach(()=>{
            cy.task('logStart')
        })

        let pcg = pct_clicks+pct_scrolls+pct_keys+pct_pgnav+pct_selectors+pct_spkeys+pct_actions+pct_browserChaos;
        if(pcg === 100){

            pending_events[0] = events*pct_clicks/100;
            pending_events[1] = events*pct_scrolls/100;
            pending_events[2] = events*pct_selectors/100;
            pending_events[3] = events*pct_keys/100;
            pending_events[4] = events*pct_spkeys/100;
            pending_events[5] = events*pct_pgnav/100;
            pending_events[6] = events*pct_browserChaos/100;
            pending_events[7] = events*pct_actions/100;
            
            cy.visit(url).then((win)=>{   
                let d = win.document
                curPageMaxY = Math.max( d.body.scrollHeight, d.body.offsetHeight, d.documentElement.clientHeight, d.documentElement.scrollHeight, d.documentElement.offsetHeight) - win.innerHeight
                curPageMaxX = Math.max( d.body.scrollWidth, d.body.offsetWidth, d.documentElement.clientWidth, d.documentElement.scrollWidth, d.documentElement.offsetWidth) - win.innerWidth
            })
            cy.wait(1000)
            //Add an event for each type of event in order to enter the else statement of randomEvent method
            for(let i = 0; i < events + 7; i++){
                evtIndex++
                randomEvent()
            }
        }
        else cy.task('logPctNo100')
        
        afterEach(()=>{
            cy.task('logEnd')
        })
    })
})

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//End of smart monkey
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------