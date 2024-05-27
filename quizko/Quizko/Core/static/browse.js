console.log('hello world')

const modalBtns = [...document.getElementsByClassName('modal_clickable')]
console.log('modalbtns')
const modalBody = document.getElementById('modal-body-confirm')
const starBtn = document.getElementById('start-button')
const url = window.location.href
modalBtns.forEach(modalBtn=> modalBtn.addEventListener('click', ()=>{
    const pk = modalBtn.getAttribute('data-pk')
    const name = modalBtn.getAttribute('data-quiz')
    const numQuestions = modalBtn.getAttribute('data-questions')
    const difficulty = modalBtn.getAttribute('data-difficulty')
    const scoreToPass = modalBtn.getAttribute('data-pass')
    const time = modalBtn.getAttribute('data-time')
    modalBody.innerHTML = `
    <div><h5 class ="modalBody" style="color: black;">Are you sure you want to begin "<b>${name}</b>"?</h5></div>
    <div class="text-muted">
            <li><h6>Difficulty: <b>${difficulty}</b></h6></li>
            <li><h6>Number of questions: <b>${numQuestions}</b></h6></li>
            <li><h6>Score to pass: <b>${scoreToPass}</b></h6></li>
            <li><h6>Time: <b>${time} min</b></h6></li>
    </div>
`;
starBtn.addEventListener('click', ()=>{
    window.location.href = 'quiz/'+pk
})
}))


