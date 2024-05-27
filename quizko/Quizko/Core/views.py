from django.shortcuts import render, redirect
from item2.models import Answer,Question,Quiz,Result
from item2.forms import QuizCreationForm, QuestionCreationForm
from django.views.generic import ListView
from .forms import SignupForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
import pdb
from  django.db.models import Q

# Create your views here.
def index(request):
    return render(request, 'core/index.html')

def contact(request):
    return render(request, 'core/contact.html')


def aboutus(request):
    return render(request, 'core/aboutus.html')


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('/login/')
    else:
        form = SignupForm()
        
    return render(request, 'core/signup.html', {
        'form':form
    })

@login_required
def generate(request):
    form = QuizCreationForm()
    return render(request, 'core/generate.html', {'quiz_form': form})

@login_required
def generateQuestions(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = request.POST
        data_ = dict(data.lists())
        data_.pop('csrfmiddlewaretoken')
        # Iterate through the items and remove the prefix
        cleaned_data = {}
        for key, value in data_.items():
            cleaned_key = key.split('[')[-1][:-1]  # Extract what's inside the brackets
            cleaned_data[cleaned_key] = value

        # Now iterate over the cleaned data
        #for k, value in cleaned_data.items():
            #print('key: ', k)
            #print('OBJECT: ', value)

        cleaned_list = list(cleaned_data.items())

        quiz_list = []
        quiz_list.extend(cleaned_list[1:6])
        quiz_list.extend(cleaned_list[-2:])
        del cleaned_list[1:6]
        del cleaned_list[-2:]
        quizCreated = Quiz(title = quiz_list[0][1][0], description=quiz_list[1][1][0],
         difficulty=quiz_list[2][1][0], time=int(quiz_list[3][1][0]), number_of_questions=int(quiz_list[4][1][0]),
         creator=request.user, required_score_to_pass=int(quiz_list[5][1][0]), subject=quiz_list[6][1][0])
        quizCreated.save()
        del cleaned_list[0]
        while len(cleaned_list) > 0:
            questionCreation = Question(text = cleaned_list[0][1][0], quiz=quizCreated)
            questionCreation.save()
            answer1 = Answer(text = cleaned_list[1][1][0], is_correct = True, question= questionCreation)
            answer1.save()
            answer2 = Answer(text = cleaned_list[2][1][0], is_correct = False, question= questionCreation)
            answer2.save()
            answer3 = Answer(text = cleaned_list[3][1][0], is_correct = False, question= questionCreation)
            answer3.save()
            answer4 = Answer(text = cleaned_list[4][1][0], is_correct = False, question= questionCreation)
            answer4.save()
            del cleaned_list[0:5]

        return JsonResponse({'text':'works'})
    return JsonResponse({'text':'not Working'})


#class QuizListView(ListView):
#    model = Quiz
#    template_name ='core/browse.html'

def browse(request):
 query = request.GET.get('query', '')
 quizzes = Quiz.objects.all()
 
 if query:
     quizzes = quizzes.filter(Q(title__icontains=query) | Q(description__icontains=query))

 return render(request, 'core/browse.html', {
  'quizzes': quizzes
 })

