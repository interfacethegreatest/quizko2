
//28/03/2024
//validate that all fields are completed,
//if uncomplete highlight in red,
//once complete, show a title,
//handle backened, creating forms,

const url = window.location.href
console.log(url+'generateQuestions/')

const mainPage = document.getElementsByClassName('form-container')[0]

const csrf = document.getElementsByName('csrfmiddlewaretoken')

const expandButton = document.getElementById('expandButton');
//get expand question div
const questionDiv = document.getElementById('questionDiv');
// let inputQuestions = 0 for now,
let inputQuestions = 0
// Get the button field
var questionButton = document.getElementById('expandButtonQuestion');
console.log(questionButton)
//get the input field
var questionInputField = document.getElementsByName('number_of_questions')[1]
//get submit button - make it hidden
const submitButton = document.getElementById('submitButton')
submitButton.disabled=true;
//get question form
//retreive question box input text,
function questionButtonAction() {
  console.log('123')
  const questionDiv = document.getElementById('questionDiv');
  // Clear existing content
  questionDiv.innerHTML = '';

  // get form data
  inputQuestions = parseInt(document.getElementsByName('number_of_questions')[1].value)
  
  
  const pagination = document.createElement('nav');
  pagination.setAttribute('aria-label', 'Page navigation example');
  pagination.innerHTML = `<ul style="display:flex;flex-wrap:wrap; justify-content:center;" class="pagination"></ul>`;
  const paginationList = pagination.querySelector('.pagination');

  for (let i = 0; i < inputQuestions; i++) {
      paginationList.innerHTML += `
      <li class="page-item">
          <a class="page-link" data-bs-toggle="collapse" href="#collapseExample${i+1}" role="button" aria-expanded="false" aria-controls="collapseExample">
              <b>Q${i+1}</b>
          </a>
      </li>`;
  }

  questionDiv.appendChild(pagination);

  for (let i = 0; i < inputQuestions; i++) {
      const questionCollapse = document.createElement('div');
      questionCollapse.classList.add('collapse');
      questionCollapse.id = `collapseExample${i+1}`;
      questionCollapse.innerHTML = `
      <div class="card card-body Question">
          <h4 style="color:black;">Question ${i+1}</h4>
          <br>
          <div class="mb-3">
              <label for="InputQuestionText" class="form-label"><b>Question Title</b></label>
              <input type="text" class="form-control" id="exampleInputQuestionText" aria-describedby="questionTextHelp" name="question-title ${i+1}">
              <div id="questionTextHelp" class="form-text"><b>Enter your question here. i.e. 'What is nine plus ten?'</b></div>
              <br>
              <br>
              <div style="margin-left:60px;" class="card card-body">
               <h6 style="color:black;">Answers</h6>
               <br>
               <div class = "mb-3">
                 <label for="InputAnswerText" class="form-label"><b>Correct answer text:</b></label>
                 <input type="text" class="form-control" id="question${i+1}CorrectAnswer" aria-describedby="questionCorrectAnswer" name="question ${i+1}'s correct answer">
                 <div id="correctAnswerHelp" class="form-text"><b>Here is where the CORRECT answer should be. i.e.'19'.</b></div>
               </div>
               <div class = "mb-3">
                 <label for="InputAnswerText" class="form-label"><b>Incorrect answer 1:</b></label>
                 <input type="text" class="form-control" id="question${i+1}IncorrectAnswer1" aria-describedby="questionIncorrectAnswer1" name="question ${i+1}'s incorrect answer 1">
                 <div id="incorrectAnswerHelp" class="form-text"><b>Provide an INCORRECT answer to provide the user options where a correct answer should be. i.e.'21'.</b></div>
               </div>
               <div class = "mb-3">
                 <label for="InputAnswerText" class="form-label"><b>Incorrect answer 2:</b></label>
                 <input type="text" class="form-control" id="question${i+1}IncorrectAnswer2" aria-describedby="questionIncorrectAnswer2" name="question ${i+1}'s incorrect answer 2">
                 <div id="incorrectAnswerHelp" class="form-text"><b>Here is where the second INCORRECT answer should be. i.e.'21'.</b></div>
               </div>
               <div class = "mb-3">
                 <label for="InputAnswerText" class="form-label"><b>Incorrect answer 3:<b></label>
                 <input type="text" class="form-control" id="question${i+1}IncorrectAnswer3" aria-describedby="questionIncorrectAnswer3" name="question ${i+1}'s incorrect answer 3">
                 <div id="incorrectAnswerHelp" class="form-text"><b>Here is where the third INCORRECT answer should be. i.e.'21'.</b></div>
               </div>
              </div>
          </div>
      </div>`;
      questionDiv.appendChild(questionCollapse);
      
  }
  
  
  questionDiv.innerHTML+=`<button id = "validateButton" style="margin-top:10px;margin-bottom:10px;" onclick="validateQuestions()" type="button" class="btn btn-warning">Validate</button>`
  
  
}

function validateQuestions() {
  const questions = [...document.getElementsByClassName('Question')]
  let labelBoxes = []
  questions.forEach(question => {
    const inputer = Array.from(question.querySelectorAll('input'))
    labelBoxes.push(...inputer)
  })

  const validationResult = validateInputs(labelBoxes)
  const previousErrorMessages = questionDiv.querySelectorAll('p')
  previousErrorMessages.forEach(p => p.remove())

  // Create a new paragraph element for the message
  const paragraph = document.createElement('p');
  // Create a text node with the error message
  const messageNode = document.createTextNode(validationResult.message);
  // Append the text node to the paragraph element
  paragraph.appendChild(messageNode);
  // Apply styling to the paragraph element
  paragraph.style.color = 'black';
  paragraph.style.fontWeight = 'bold'; // Set font weight to bold
  paragraph.style.marginTop = '10px';
  // Append the paragraph element to questionDiv
  questionDiv.appendChild(paragraph);

  // Highlight erroneous labels in red
  validationResult.labels.forEach(label => {
    label.classList.add('flash', 'border', 'border-danger', 'is-invalid');
    setTimeout(() => {
      label.classList.remove('flash');
    }, 1000); // Remove flash effect after 1 second (adjust timing as needed)
  });

  // Highlight correctly validated labels in green
  labelBoxes.forEach(label => {
    if (!validationResult.labels.includes(label)) {
      label.classList.add('border', 'border-success', 'is-valid');
    }
  });

  if (validationResult.labels.length === 0){
    submitButton.disabled = false;
    const validateButton = document.getElementById('validateButton')
    validateButton.style.visibility = 'hidden'

  }
}

function validateInputs(labelBoxes) {
  console.log(labelBoxes);
  const errorLabels = [];

  // Process the labelBoxes in chunks of five
  for (let i = 0; i < labelBoxes.length; i += 5) {
    const values = new Set();
    const group = labelBoxes.slice(i, i + 5); // Get a group of five elements

    for (const label of group) {
      const trimmed = label.value.trim();

      // Check for empty value
      if (trimmed === "") {
        errorLabels.push(label);
      } else if (values.has(trimmed)) {
        errorLabels.push(label);
      } else {
        values.add(trimmed);
      }
    }
  }

  if (errorLabels.length > 0) {
    return { labels: errorLabels, message: 'Error: Empty or duplicate values found within each group of five' };
  } else {
    return { labels: [], message: 'validated' };
  }
}


function submitQuiz() {

  const data = {}
  data['csrfmiddlewaretoken'] = csrf[0].value
  // Log form data for debugging
  const questionForm = document.getElementById('quiz-form');
  console.log(questionForm)
  var formData = new FormData(questionForm);
  var formDataDictionary = Object.fromEntries(Array.from(formData.entries()))
  data['formDictionary'] = formDataDictionary  
  $.ajax({
      type: 'POST',
      url: `${url}generateQuestions`,
      data: data,
      success: function (response) {
          console.log(response.text)
      },
      error: function (error) {
          console.log(error)
      }
  })
  // Remove all children elements from the mainPage
  while (mainPage.firstChild) {
    mainPage.removeChild(mainPage.firstChild);
  }

  // Create a Bootstrap card element
  const card = document.createElement('div');
  card.classList.add('card', 'm-4');

  // Create card body
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Create card title
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = 'Quiz Submitted!';

  // Create card text
  const cardText = document.createElement('p');
  cardText.classList.add('card-text');
  cardText.textContent = 'Thank you for submitting your quiz.';
  cardText.fontWeight = 'bold'

  // Create buttons for dashboard and browse page
  const dashboardButton = document.createElement('button');
  dashboardButton.classList.add('btn', 'btn-primary', 'mr-2');
  dashboardButton.textContent = 'Go to Dashboard!';
  dashboardButton.addEventListener('click', () => {
    // Redirect to dashboard page
    window.location.href = 'dashboard.html';
  });


  // Append elements to card body
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(dashboardButton);

  // Append card body to card
  card.appendChild(cardBody);

  // Append card to mainPage
  mainPage.appendChild(card);
}



//switch button icon on click
expandButton.addEventListener('click', event=>{
  const formContainer = document.getElementsByClassName('form-container')[0]
  console.log(formContainer)
    if (expandButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"/>
  </svg>`){
        expandButton.innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-collapse" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z"/>
      </svg>`
    }else{
        expandButton.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-expand" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"/>
      </svg>`
    }
})