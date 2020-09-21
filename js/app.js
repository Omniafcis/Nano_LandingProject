/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
//get the list of sections exists on the page html and put it in array
const sectionsArr = [...document.getElementsByTagName('section')];


/**
 * End Global Variables
 * Start Helper Functions
 * 
*/


// Set sections as active

//to set the active class to the selected section to change it's style and appear
//selected
function activateSelectedSec(selectedSection) {
    //**Change the style of the section itself
    //remove the class 'your-active-class' from all the sections
    sectionsArr.forEach(section => section.classList.remove('your-active-class'));
    
    //add the class 'your-active-class' to the selected section
    selectedSection.classList.add('your-active-class');

    //**Change the style of the Navigation selected section in the menu
    //get all the links
    const linksList = [...document.getElementsByTagName('a')];
    
    //loop over all the links and remove the active class from all and add it to the selected section only
    
    linksList.forEach(link => {
        link.classList.remove('active');
        
        if(link.getAttribute('href').split('#')[1] === selectedSection.getAttribute('id')) {
            link.classList.add('active');
        }
    });
    //document.removeEventListener('scroll',pageScrollListener);
}

//function to check if the section appears now in the Viewport and activate it 
//Also activate the menu item that appears in the Viewport
function sectionInViewport() {
    //use the Intersection Observer to detect if the section appears in the viewport
    //only if it's supported
    
    if(!! window.IntersectionObserver) {
        
        //define the observer object and send the intersecting section to 
        //function activateSelectedSec to apply the 'your-active-class' to 
        //highlight the section appears in the viewport
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    activateSelectedSec(entry.target);
                }
            })
        }, {threshold: 1});
        sectionsArr.forEach(section => {
            observer.observe(section);
        });
    } else { 
        
        //in case the observer is not supported, this is another way I have learned to 
        //detect if the section appears in the viewport
        
        //loop on every section and get it's viewable dimensions to compare
        //it with the space the page has been scrolled till now related to the
        //top left corner of the window to know if it appears now in the 
        //viewport or not
        sectionsArr.forEach(section => {
            let rectView = section.getBoundingClientRect();
            if(rectView.top >= 0 && rectView.left >= 0 && 
               rectView.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
               rectView.right <= (window.innerWidth || document.documentElement.clientWidth)) {
                activateSelectedSec(section);
            }
        });
    }
}

//function to scroll to the selected section smoothly
function scrollSmooth(event,selectedSection) {
    
    //to scroll to the selected section smoothly
    //first we have to stop the default action of the click event to go directly to the 
    //selected section
    event.preventDefault();
    
    //In this step we find the position of the selected section to use in the scrollTo //function 
    let secPostion = 0;
    
    if(selectedSection.offsetParent != null) {
        do {
            secPostion += selectedSection.offsetTop;
        } while (selectedSection == selectedSection.offsetParent);
    }
    
    //After calculating the selected section position we pass it to scrollTo() with 
    //selecting the behavior option to 'smooth'
    window.scrollTo({top: secPostion, behavior: 'smooth'});
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
function buildNavMenu() {
    //get the navigation bar unordered list element already exists on the page but empty 
    const navBar = document.getElementById('navbar__list');
    
    //create a document fragment to inhance the performance by adding
    //all the list items to it and then add it to the ul at one time
    const docFragment = document.createDocumentFragment();
    
    //index to count the section and help us label them
    let index = 1;

    //walk through the sections and add them to the unordered list defined in the navigation bar
    for(let section of sectionsArr) {
        //create a list element
        const listItem = document.createElement('li');

        //create a link element to help us link the list item with the section on the page
        const linkSection = document.createElement('a');
        
        //set the href attribute of the link with the address of the section by giving it it's unique id
        linkSection.setAttribute('href','#'+section.getAttribute('id'));

        //set the class attribute of the link to style it by the class already defined in the css file
        linkSection.setAttribute('class','menu__link');

        //add the text that will appear in the navigation bar from the value of the 
        //attribute 'data-nav' if found so that we don't use to add fixed content
        let secDataNavAtt = section.getAttribute('data-nav');
        if(secDataNavAtt !== undefined) {
            //data nav attribute 
            linkSection.textContent = secDataNavAtt;
        } else {
            linkSection.textContent = 'Section'+ index;   
        }

        //append this link to the list item we have created for this section
        listItem.appendChild(linkSection);
        
        //append this list item to the document fragment
        docFragment.appendChild(listItem);

        //increment the index to deine the next section
        index++;
    }
    //at the end append the constructed document fragment to the navigation bar
    navBar.appendChild(docFragment);
}
// Listener function to help scroll smoothly to the selected section
// and then set the active class for the selected section
function activateSecListener(event) {
    
    //get the selected section by using the text content of the link after removing any spaces in it and make it lower case
    const selectedSection = document.getElementById(event.target.getAttribute('href').split('#')[1]);    
    
    //scroll in smooth behavior to the selected section
    scrollSmooth(event,selectedSection);
    
    //call activateSelectedSec which will remove the class 'your-active-class' from 
    //all the sections and add it only to the selected section to change it's style    
    activateSelectedSec(selectedSection); 
    
    //document.addEventListener('scroll',pageScrollListener);
}


//Listener function to call Viewinport function which activate the section appears in viewport after scrolling
function pageScrollListener() {
    
    //activate section in viewport
    sectionInViewport();
}


/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 
//add an event listener to build the navigation menu bar once the page is loaded to be
//sure that all sections are exist
document.addEventListener('DOMContentLoaded', buildNavMenu);

//add an event listener to activate the selected section from the navigation bar
document.getElementById('navbar__list').addEventListener('click', activateSecListener);
       
//add an event listener to activate sections appear in viewport on scroll
document.addEventListener('scroll',pageScrollListener,true);

//on Refreshing the page scroll the page to the top
window.onbeforeunload = () => { window.scrollTo(0,0); };
