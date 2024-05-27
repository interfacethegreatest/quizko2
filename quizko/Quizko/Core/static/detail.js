const url = window.location.href
let questionNumber = 0;
let formNumber = 1;
let questionDict ={}
const questionsText = []
const quizBox = document.getElementById('quiz-box')
const scrollBox = document.getElementById('scrollbox-inner')
const quizForm = document.getElementById('quiz-form')
const modalTitle = document.getElementById('exampleModalLabel')
const detailTitle = document.getElementsByClassName('detailTitle')[0]
const timerBox = document.getElementById('timer-box')
function activateTimer(time){
    if (time.toString().length < 2){
        timerBox.innerHTML=`<h1 class="detailTitleText" style="padding-top: 5px;">0${time}:00</h1>`
    } else{
        timerBox.innerHTML=`<h1 class="detailTitleText" style="padding-top: 5px;">0${time}:00</h1>`
    }
    let minutes = time -1
    let seconds = 60
    let displaySeconds
    let displayMinutes

    const timer = setInterval(()=>{
        seconds--
        if(seconds < 0){
            seconds = 59,
            minutes--
        }
        if (minutes.toString().length<2){
            displayMinutes = '0'+minutes
        } else {
            displayMinutes = minutes
        }
        if(seconds.toString().length < 2){
            displaySeconds = '0'+seconds
        }else{
            displaySeconds = seconds
        }
        if(minutes ===0 && seconds===0){
            timerBox.innerHTML = `<h1 class="detailTitleText" style="padding-top: 5px;">00:00</h1>`
            setTimeout(()=>{
                clearInterval(timer)
            alert('Time Over')
            sendData()
            var exampleModal = document.getElementById('exampleModal')
            if (exampleModal) {
                var buttons = exampleModal.getElementsByTagName('button')
                buttons[0].parentNode.removeChild(buttons[0])
                buttons[0].parentNode.removeChild(buttons[0])
                exampleModal.setAttribute("data-bs-backdrop", "static");
                exampleModal.setAttribute("data-bs-keyboard", "false");
            }
            const modal = new bootstrap.Modal(exampleModal);
            modal.show();
            }, 500)
        }

        timerBox.innerHTML = `<h1 class="detailTitleText" style="padding-top: 5px;">${displayMinutes}:${displaySeconds}</h1>`
    }, 1000)
    detailTitle.appendChild(timerBox)
}
$.ajax({
    type:'GET',
    url:`${url}data`,
    success: function(response){
        const data = response.data
        detailTitle.innerHTML+=`
        <p class= "detailTitleText"> Score to pass: ${response.scorePass}</p>`
        data.forEach(el => {
            for (const[question, answers] of Object.entries(el)){
                questionNumber++
                questionDict[question] = answers
                questionsText.push(question)
                quizBox.innerHTML+=`
                <div id="${question}" name="${questionNumber}"></div>`
                const container = document.getElementById(question)
                container.innerHTML += `
                <hr>
                <div class ="mb-2">
                  <h1><b>${question}</b></h1>
                </div>
            `
           
            scrollBox.innerHTML+=`
             <div class ="detailQuestion ${questionNumber}" onclick="detailQuestionClick(this)">
                    <h2 value="${question}">Question ${questionNumber}</h2>
                    <h3 id="questionIsAnswered">Unanswered</h>
             </div>
             <br>

            `
            answers.forEach(answer=>{
              container.innerHTML+=`
              <div>
               <input type="radio" class="ans" id="${question}-${answer}" name="${question}" value="${answer}">
               <label for="${question}">${answer}</label>
              </div>`  
            })
            container.innerHTML+=`
             <button type="submit" id="${questionNumber}" class="btn btn-success" onclick="questionIsAnswered(this)">Save</button>`
           
             container.style.display="none"
            if (questionNumber ==1){
                container.style.display = "block"
            }
            }
        });
       
     activateTimer(response.time)
    },
    error: function(error){
        console.log(error)
    }
})

function detailQuestionClick(divElement) {
    // Get the question text and its corresponding container
    let questionText = divElement.querySelector('h2');
    const button = document.getElementsByClassName('btn btn-succes')[0];

    // Hide all question containers first
    for (var question of questionsText) {
        const container = document.getElementById(question);
        if (container) {
            container.style.display="none"
        }
    }

    // Get the container based on the value attribute of questionText
    const container = document.getElementById(questionText.getAttribute('value'));
    formNumber = parseInt(container.getAttribute('name'))
    if (formNumber ==1) {
        const leftButton = document.getElementsByClassName('arrow-button left')[0]
        leftButton.style.display = "none"
        const secondEnd = document.getElementById('secondEndExam')
        secondEnd.style.visibility = 'hidden'
        const submitButton = document.getElementById('submitQuiz')
        submitButton.style.visibility = 'hidden'
    } else if (formNumber > 1) {
        const leftButton = document.getElementsByClassName('arrow-button left')[0]
        leftButton.style.display = "block"
        const rightArrow = document.getElementsByClassName('arrow-button right')[0]
        rightArrow.style.display="block"
        const secondEnd = document.getElementById('secondEndExam')
        secondEnd.style.visibility = 'hidden'
        const submitButton = document.getElementById('submitQuiz')
        submitButton.style.visibility = 'hidden'
    }
    if (formNumber == document.getElementsByClassName('btn btn-success').length) {
        const rightArrow = document.getElementsByClassName('arrow-button right')[0]
        rightArrow.style.display="none"
        const secondEnd = document.getElementById('secondEndExam')
        secondEnd.style.visibility = 'visible'
        const submitButton = document.getElementById('submitQuiz')
        submitButton.style.visibility = 'visible'
    }
    
     
    // Apply style changes only if necessary
    if (container) {
        container.style.display="block"
    }


    /*
    Uncomment the following code if you need to render additional content
    using quizBox.innerHTML
    */
    /*
    quizBox.innerHTML = "";
    quizBox.innerHTML += `
        <hr>
        <div class="mb-2">
            <h1><b>${questionText}</b></h1>
        </div>
    `;
    answerText.forEach(answer => {
        quizBox.innerHTML += `
            <div>
                <input type="radio" class="ans" id="${questionText}-${answer}" name="${questionText}" value="${answer}">
                <label for="${questionText}">${answer}</label>
            </div>`;
    });
    */
}



const csrf = document.getElementsByName('csrfmiddlewaretoken')


function sendData() {
 const data = {}
  data['csrfmiddlewaretoken'] = csrf[0].value
  const elements = [...document.getElementsByClassName('ans')]
  elements.forEach(el=>{
    if(el.checked){
        data[el.name] = el.value
    } else{
        if(!data[el.name]) {
            data[el.name] = null
        }
    }
  })

  $.ajax({
    type: 'POST',
    url: `${url}save/`,
    data: data,
    success: function(response){
        console.log(response +'123')
        const modalBody = document.getElementsByClassName('modal-body')[0]
        while (modalBody.firstChild) {
            modalBody.removeChild(modalBody.firstChild);
        }
        const results = response.results
        results.forEach(res=>{
            const resDiv = document.createElement("div")
            for (const [question, resp] of Object.entries(res)){
                resDiv.innerHTML+=`
                Question: ${question}`
                const cls = ['p-3', 'text-light', 'h3']
                resDiv.classList.add(...cls)

                if (resp=='not answered'){
                    resDiv.innerHTML+='- not answered'
                    resDiv.classList.add('bg-danger')
                }
                else{
                    const answer = resp['answered']
                    const correct = resp['correct_answer']

                    if (answer == correct) {
                        resDiv.classList.add('bg-success')
                        resDiv.innerHTML+=` answered: ${answer}`
                    } else{
                        resDiv.classList.add('bg-danger')
                        resDiv.innerHTML+=` | correct answer: ${correct}`
                        resDiv.innerHTML+=` | answered: ${answer}`
                    }
                }
            }
            
            
            modalBody.append(resDiv)
        })

        if (response.passed){
            modalTitle.innerText= ""
            modalTitle.innerText+='Thanks, You Passed!\n Your score was ' + response.score+'%.'
        }else{
            modalTitle.innerText= ""
            modalTitle.innerText+='Sadly, you did not pass.\nYour score was ' +response.score +'%.'
        }
    },
    error: function(error){
        console.log(error)
    }
  })
}

document.getElementById('submitQuiz').addEventListener('click', event=>{
    sendData()

}
)

window.addEventListener('load', function() {
    console.log('312')
    nextButtons(); // Call the function when the window is resized
});


quizForm.addEventListener('submit', event=>{
    event.preventDefault()
    //questionIsAnswered(this)
    //sendData()
})


function rightButtonClick(thiSDiv){
  formNumber++
  if (formNumber >= document.getElementsByClassName('btn btn-success').length){
    thiSDiv.style.display = 'none'
    const secondEnd = document.getElementById('secondEndExam')
    secondEnd.style.visibility = 'visible'
    const submitButton = document.getElementById('submitQuiz')
    submitButton.style.visibility = 'visible'

  }
  if (formNumber>1){
    const leftButton = document.getElementsByClassName('arrow-button left')[0]
    leftButton.style.display = 'block'
  }

  for (i = 1; i <= formNumber; i++){
    const nextQuestion = document.getElementsByName(String(i))[0]
    if (nextQuestion.style.display == 'block'){
        nextQuestion.style.display = 'none'
    }
  }
  const nextQuestion = document.getElementsByName(formNumber)[0]
  nextQuestion.style.display = 'block'
}

function questionIsAnswered(divElement){
 const sideDiv = document.getElementsByClassName(divElement.id)
 sideDiv[0].querySelector('h3').innerHTML = "Answered"
 if (formNumber <= document.getElementsByClassName('btn btn-success').length-1){
 formNumber++
 if(formNumber >=document.getElementsByClassName('btn btn-success').length){
    const rightButton = document.getElementsByClassName('arrow-button right')[0]
    const secondEnd = document.getElementById('secondEndExam')
    secondEnd.style.visibility = 'visible'
    rightButton.style.display = 'none'
    const submitButton = document.getElementById('submitQuiz')
    submitButton.style.visibility = 'visible'
 }
 if (formNumber>1){
    const leftButton = document.getElementsByClassName('arrow-button left')[0]
    leftButton.style.display = 'block'
 }
 for (i = 1; i <= formNumber; i++){
    const nextQuestion = document.getElementsByName(String(i))[0]
    if (nextQuestion.style.display == 'block'){
        nextQuestion.style.display = 'none'
    }
 }
 const nextQuestion = document.getElementsByName(formNumber)[0]
 nextQuestion.style.display = 'block'
}
}

function leftButtonClick(thiSDiv){
 formNumber--
 if (formNumber <=1){
    thiSDiv.style.display= 'none'
 }

 if (formNumber >=document.getElementsByClassName('btn btn-success').length-1){
    const rightButton = document.getElementsByClassName('arrow-button right')[0]
    rightButton.style.display = 'block'
    const secondEnd = document.getElementById('secondEndExam')
    secondEnd.style.visibility = 'hidden'
    const submitButton = document.getElementById('submitQuiz')
    submitButton.style.visibility = 'hidden'
 }

 for (i = 1; i <= document.getElementsByClassName('btn btn-success').length; i++){
    const nextQuestion = document.getElementsByName(String(i))[0]
    if (nextQuestion.style.display == 'block'){
        nextQuestion.style.display = 'none'
    }
  }
  const nextQuestion = document.getElementsByName(formNumber)[0]
  nextQuestion.style.display = 'block'
}


function nextButtons(){
    if (window.matchMedia('(max-width: 1920px)').matches) {
        console.log('432')
        const parentDiv = document.getElementsByClassName('detailContent')[0];
        const h2ChildElement = document.getElementsByClassName('detailContentTextDefault')[0];
        parentDiv.removeChild(h2ChildElement);
        const divElement = document.createElement('div');
        divElement.id = 'container';
        divElement.classList.add('flex-container');
    
        // Create left arrow button
        const leftButton = document.createElement('button');
        leftButton.classList.add('arrow-button', 'left');
        leftButton.innerHTML = `<h1>←</h1>`;
        leftButton.style.color = "white";
        leftButton.style.display = 'none';
        leftButton.addEventListener('click', event => {
            event.preventDefault();
            leftButtonClick(leftButton);
        });
    
        // Create end exam button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'End Exam';
        submitButton.classList.add("btn", "btn-danger", "btn-lg");
        submitButton.type = "button";
        submitButton.setAttribute("data-toggle", "modal");
        submitButton.setAttribute("data-target", "#exampleModalCenter");
        submitButton.id = "secondEndExam";
        submitButton.style.visibility = "hidden";

        submitButton.addEventListener('click', event => {
            // Add your event handling logic here if needed
            sendData()
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        });
    
        // Create right arrow button
        const rightButton = document.createElement('button');
        rightButton.classList.add('arrow-button', 'right');
        rightButton.innerHTML = `<h1>→</h1>`;
        rightButton.style.color = "white";
        rightButton.addEventListener('click', event => {
            event.preventDefault();
            rightButtonClick(rightButton);
        });
    
        // Create h2 element
        const h2Element = document.createElement('h2');
        h2Element.textContent = 'Content';
        
        // Append elements to the div
        divElement.appendChild(leftButton);
        divElement.appendChild(submitButton);
        divElement.appendChild(rightButton);
        
        // Append the div to the document body or any other parent element
        parentDiv.prepend(divElement);
        console.log(parentDiv)
    }
}