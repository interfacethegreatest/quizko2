// Window url
const url = window.location.href.slice(0,-1)

//obtain csrftoken
const csrf = document.getElementsByName('csrfmiddlewaretoken')

//obtain form
//var form = document.getElementById('quiz-form')
// obtain h3 text divs
const buttonTitle = document.getElementsByName('quizIdentifier')[0]
//obtain questionDropdown div
const questionDropdown = document.getElementById('questionDropdown')
//obtain questions selector 'All' text div,
const dropDown = document.getElementsByName('answerDiv')
const questionDiv2 = document.getElementsByName('questionDiv2')[0]
const answerH3Text = document.getElementsByName('answerAllText')[0]
//obtain scroll text box
const textBox = document.getElementsByClassName('scroll-object')[0]
var questionDiv = document.createElement('div');
//obtain edit and delete buttons
//edit
var questionEditButton = document.getElementById('questionEdit')
//delete
var questionDeleteButton = document.getElementsByName('deleteButton')[0]
//obtain all infographics buttons,
var infographics = document.getElementsByClassName('btn btn-light')

document.addEventListener("DOMContentLoaded", function() {
  const data = {};
  data['csrfmiddlewaretoken'] = csrf[0].value;
  $.ajax({
    type: 'POST',
    url: `${url}/getLoadData`,
    data: data,
    success: function (response) {
        console.log(response);
        var infographics = document.getElementsByClassName('btn btn-light')
        console.log(infographics)
        infographics[2].childNodes[3].innerText=response.userResults
        infographics[2].childNodes[5].innerHTML+=`<b>↑${response.todayResults}</b>`
        infographics[3].childNodes[3].innerHTML+=`<b>${response.averageScore}%</b>`
        if (response.percentageDifference > 0){
          infographics[3].childNodes[5].innerHTML+=`<b>↑${response.percentageDifference}%</b>`
        }else{
          infographics[3].childNodes[5].innerHTML+=`<b>↓${response.percentageDifference}%</b>`
        }
        infographics[4].childNodes[3].innerHTML+=`<b>${response.averageQuestions}</b>`
        if (response.averageQuestionsDifference > 0){
          infographics[4].childNodes[5].innerHTML+=`<b>↑${response.averageQuestionsDifference}%</b>`
        }else{
          infographics[4].childNodes[5].innerHTML+=`<b>↓${response.averageQuestionsDifference}%</b>`
        }
    },
    error: function (error) {
        console.log(error);
    }
});
});


function populateListQuiz(thisDiv) {
  const quizForms = document.getElementsByTagName('form')
  console.log(quizForms)
  Array.from(quizForms).forEach(function(form){
   if(form.name === thisDiv.innerText){
    form.style.display=""
   }
   else{
    form.style.display = "none"
   }
  })
  
  // Update button title if it's different from current div's text
  if (buttonTitle.innerHTML !== thisDiv.innerText) {
    buttonTitle.innerHTML = '';
    buttonTitle.innerHTML = thisDiv.innerText;
  }

  // Obtain the list of spans containing the answer text
  
  // For each question, create a new dropdown entry
  questionDeleteButton.disabled = false;
  questionEditButton.disabled = false;
}




function setDivAllText(textString, DropDown){
  console.log(textString)
  const dropDownButton = DropDown.querySelector("button");
  const h3Text = DropDown.querySelector("h3:nth-child(2)");
  h3Text.innerHTML = `<b>${textString}</b>`;
  h3Text.style.textAlign = "left"; 
}

function allowEdit(){
  var editable = document.getElementsByTagName('input')
  Array.from(editable).forEach(function(input) {
    // Enable the input element
    if(input.disabled === true && input.type === "text"){
      input.disabled = false
    }else{
      input.disabled = true
    }
  });
  //enable submitButton to be clickable
  const innerText = document.getElementsByName('quizIdentifier')[0].innerText
  var submitButton = document.getElementById('submitButton_'+innerText)
  submitButton.disabled = false;
}

function submitExam(thisDiv){
  const data = {};
  data['primaryKey'] = thisDiv.attributes[1].value; 
  data['csrfmiddlewaretoken'] = csrf[0].value;
  var formData = new FormData(thisDiv.parentNode);
  var formDataDictionary = Object.fromEntries(Array.from(formData.entries()));
  data['formDictionary'] = formDataDictionary;
  console.log(thisDiv)
  $.ajax({
      type: 'POST',
      url: `${url}editForm`,
      data: data,
      success: function (response) {
          console.log(response.text);
          textBox.innerHTML=``
          textBox.innerHTML+=`
          <h1 style="color:green;">You have successfully edited a quiz!</h1>`
      },
      error: function (error) {
          console.log(error);
      }
  });
}

function deleteModel(){
 //get the model title text,
 const modelForm = document.getElementsByName(buttonTitle.innerText);
 //send to server side,
 
 const data = {};
  data['primaryKey'] = modelForm[0].attributes[1].value; 
  data['csrfmiddlewaretoken'] = csrf[0].value;
 // make server delete
 $.ajax({
  type: 'POST',
  url: `${url}deleteForm`,
  data: data,
  success: function (response) {
      console.log(response.text);
      textBox.innerHTML=``
      textBox.innerHTML+=`
      <h1 style="color:red;">You have successfully edited a quiz!</h1>`
      aTag = document.getElementsByTagName('a')
      Array.from(aTag).forEach(function(a){
        if (a.innerText === buttonTitle.innerText) {
          // Delete the parent HTML element
          console.log('234')
          var parentElement = a.parentNode;
          // return completed screen text,
          parentElement.parentNode.removeChild(parentElement);
      }
      })
  },
  error: function (error) {
      console.log(error);
  }
});
 

}