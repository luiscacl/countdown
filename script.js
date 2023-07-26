/* PROBLEMAS SOLUCIONADOS EN EL EJERCICIO
1° La forma en que funciona el código asíncrono. Tuve un problema al usar el DOM para obtener los elementos html, ya que como vemos, al 
principio la página web no tiene nada de contenido hasta que carga completamente (Esto lo hicimos con el evento load), y lo que estabammos
haciendo era obtener los elementos html antes de que se mostraran en la página con algún evento. Se tiene que diferenciar el código ejecutado
de forma sincrona y asincrona 

Pude hacer todo hasta la parte donde el contador se tiene que actualizar cada vez que pase un segundo. Lo que tuve más difícil fue hacer la
resta de la fecha seleccionada a la fecha actual, para sacar los días, minutos y segundos */

/* NOTES
HTMLTemplateElement has a standard content property, which contains the DOM subtree which the template represents. */

// DOM ELEMENTS synchronous --------------
let renderSections = document.getElementById('render-sections');
const firstSectionTemplate = document.querySelector('#counter-creation');
const secondSectionTemplate = document.querySelector('#counter');
const thirdSectionTemplate = document.querySelector('#countdown-completed');

function  getCurrentDate(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const completeDate = `${currentYear}/${currentMonth}/${currentDay}`;

    return completeDate;
}

function milisecondsConvertion (differenceBtwnInputAndCurrentDate_Miliseconds) {
    const currentDateMiliseconds = new Date().getTime();
    const countdownDate = new Date(currentDateMiliseconds + differenceBtwnInputAndCurrentDate_Miliseconds);

    
    const days = Math.floor(differenceBtwnInputAndCurrentDate_Miliseconds / (24*60*60*1000));
    const hours = Math.abs(countdownDate.getHours() - 24); //Se usa Math.abs() para convertir el numero a positivo
    const minutes = Math.abs(countdownDate.getMinutes() - 60);
    const sec = Math.abs(countdownDate.getSeconds() - 60);
    return [days, hours, minutes, sec];
}

function checkInputValues(){
    if(!countDateInput.value || !countReasonInput.value){
        window.alert('Fill all the inputs');
        console.log('nfalkn')
    }
}

// RENDER FIRST SECTION
function renderFirstSection(){
    renderSections.innerHTML = "";
    const firstSectionTemplateCopy = firstSectionTemplate.content.cloneNode(true);
    renderSections.append(firstSectionTemplateCopy);

    // DOM ELEMENTS asynchronous -------------
    const countReasonInput = document.getElementById('count-reason');
    const countDateInput = document.getElementById('count-date');
    const submitButton = document.querySelector('.create-countdown-container .submit-button');

    // Set Date Input Min & Value with Today's Date
    const today = new Date().toISOString().split('T')[0];
    countDateInput.setAttribute('min', today);
    
    // EVENTS
    submitButton.addEventListener('click', () => {
        // Lo siguiente es solo para hacer que el usuario no coloque una fecha menor a la que se encuentra ahora
        const getInputDate = new Date(countDateInput.value.split('-').join('/'));
        const currentDate = new Date();

        if(!countDateInput.value || !countReasonInput.value){
            window.alert('Fill all the inputs');
            return;
        } else if(getInputDate < currentDate){
            console.log(getInputDate, currentDate);
            alert('Elige una fecha más grande que la actual');
            return;
        }
        
        renderSecondSection(countDateInput.value, countReasonInput.value);
    });
}


// RENDER SECOND SECTION
function renderSecondSection(date, reason){
    renderSections.innerHTML = "";
    const secondSectionTemplateCopy = secondSectionTemplate.content.cloneNode(true);
    renderSections.append(secondSectionTemplateCopy);

    // DOM ELEMENTS asynchronous -------------
    const reasonForCounting = document.querySelector('.reason-for-counting');
    const restButton = document.querySelector('.counter-container .rest-button');
    const dayCountdown = document.querySelector('.days .number');
    const hourCountdown = document.querySelector('.hours .number');
    const minuteCountdown = document.querySelector('.minutes .number');
    const secondContdown = document.querySelector('.seconds .number');

    reasonForCounting.textContent = reason;

    // RENDER COUNDOWN EACH SECOND
    const countdownActive = setInterval(() => {
        // Get user input date
        /* Se obtiene la fecha del día de hoy y del input en string, (ejemplo: 2022/11/18) y para convertirlo en una fecha con todos los detalles
        lo ponemos dentro de un objteto Date (new Date(fecha en string). De esta forma con Math.abs podremos sacar la diferencia de fecha entre
        la del día de hoy y la que se puso en el input */
        const getInputDate = new Date(date.split('-').join('/'));
        const currentDate = new Date(new Date().toISOString().split('T')[0].split('-').join('/'));
    
        const differenceBtwnInputAndCurrentDate_Miliseconds = (Math.abs(getInputDate - currentDate));
        let countdownDateArray = milisecondsConvertion(differenceBtwnInputAndCurrentDate_Miliseconds);
        console.log(countdownDateArray);
        // -------------------------------------------------------------------------------------------
        // Check if countdown is completed
        if(countdownDateArray[0] === 0 && countdownDateArray[1] === 0 && countdownDateArray[2] === 0 && countdownDateArray[3] === 1){
            console.log('COMPLETADO');
            clearInterval(countdownActive);
            renderThirdSection(date, reason);
            return;
        }
        // Update DOM
        dayCountdown.innerHTML = countdownDateArray[0];
        hourCountdown.innerHTML = countdownDateArray[1];
        minuteCountdown.innerHTML = countdownDateArray[2];
        secondContdown.innerHTML = countdownDateArray[3];
        
    }, 1000);

    // EVENTS
    restButton.addEventListener('click', renderFirstSection);
    restButton.addEventListener('click', () => {
        clearInterval(countdownActive);
    });
}


// RENDER THIRD SECTION
function renderThirdSection(date, reason){
    renderSections.innerHTML = "";
    const thirdSectionTemplateCopy = thirdSectionTemplate.content.cloneNode(true);
    renderSections.append(thirdSectionTemplateCopy);

    // DOM ELEMENTS asynchronous -------------
    const countdownResults = document.querySelector('.results');
    const newCountdownButton = document.querySelector('.new-countdown-button');

    countdownResults.textContent = `${reason} finished on ${date}`;

    // EVENTS
    newCountdownButton.addEventListener('click', renderFirstSection);
}


// EVENTS
// submitButton.addEventListener('click', renderSecondSection);
window.addEventListener('load', renderFirstSection);
