from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.
from item2.models import Quiz,Question,Answer,Result
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
import pdb
from django.utils import timezone
from datetime import date
from django.db import models
import datetime

@login_required
def index(request):
 quizzes = Quiz.objects.filter(creator=request.user)
 return render(request, 'dashboard/index.html', {
    'quizzes': quizzes
 })


@login_required
def editForm(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = request.POST
        data_ = dict(data.lists())
        primaryKey = data_.pop('primaryKey')
        data_.pop('csrfmiddlewaretoken')
        cleaned_data = {}
        # Loop through each key-value pair in data_
        for key, value in data_.items():
            # Remove bracketing from key
            cleaned_key = key.split('[')[-1][:-1] if '[' in key else key
            cleaned_data[cleaned_key] = value[0]  # Use the first element of the value list
        cleaned_list = list(cleaned_data.values())
        quiz = get_object_or_404(Quiz, pk=primaryKey[0])
        newQuiz = Quiz(title = cleaned_list[0], description = cleaned_list[4], difficulty=cleaned_list[1],
                        time=int(cleaned_list[2]), number_of_questions=quiz.number_of_questions, 
                        creator=request.user, required_score_to_pass=int(cleaned_list[3]), subject=quiz.subject)
        
        newQuiz.save()
        quiz.delete()
        del cleaned_list[0:5]
        while len(cleaned_list) > 0:
            questionCreation = Question(text = cleaned_list[0], quiz=newQuiz)
            questionCreation.save()
            answer1 = Answer(text = cleaned_list[1], is_correct = True, question= questionCreation)
            answer1.save()
            answer2 = Answer(text = cleaned_list[2], is_correct = False, question= questionCreation)
            answer2.save()
            answer3 = Answer(text = cleaned_list[3], is_correct = False, question= questionCreation)
            answer3.save()
            answer4 = Answer(text = cleaned_list[4], is_correct = False, question= questionCreation)
            answer4.save()
            del cleaned_list[0:5]
       

        quizzes = Quiz.objects.filter(creator=request.user)
        return render(request, 'dashboard/index.html', {
        'quizzes': quizzes
        })
    else:
        return JsonResponse({'text': 'not Working'})


@login_required
def deleteForm(request):
 if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            data = request.POST
            data_ = dict(data.lists())
            primaryKey = data_.pop('primaryKey')
            data_.pop('csrfmiddlewaretoken')
            print(primaryKey[0])
            quiz = get_object_or_404(Quiz, pk=primaryKey[0])
            quiz.delete()
            return JsonResponse({'text': 'Works'})
 else:
        return JsonResponse({'text': 'not Working'})
 

@login_required
def getLoadData(request):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
     userQuizzes = Quiz.objects.filter(creator=request.user)
     averageQuestions = userQuizzes.aggregate(averageQuestions=models.Avg('number_of_questions'))['averageQuestions'] or 0
     todaysQuizzes = userQuizzes.filter(created_at__date=datetime.date.today())
     averageQuestionsToday = todaysQuizzes.aggregate(averageQuestionsToday=models.Avg('number_of_questions'))['averageQuestionsToday'] or 0
     if averageQuestions:
         averageQuestionsDifference = ((averageQuestionsToday or 0) - averageQuestions) / averageQuestions * 100
     userResults = Result.objects.filter(user=request.user)
     if userResults.exists():
      todayResults = Result.objects.filter(user=request.user, created_at__date=datetime.date.today())
      overallResultsCount=len(userResults)
      averageScore = userResults.aggregate(averageScore=models.Avg('score'))['averageScore']
      totalScoreToday = todayResults.aggregate(totalScoreToday = models.Sum('score'))['totalScoreToday']
      overallTotalScore = userResults.aggregate(overallTotalScore = models.Sum('score'))['overallTotalScore']
      if overallTotalScore:
          percentageDifference = ((totalScoreToday or 0)- overallTotalScore) / overallTotalScore * 100
      else:
          percentageDifference = 0
     else:
         todayResults =0
         overallResultsCount = 0
         averageScore = 0
         percentageDifference = 0

     return JsonResponse({'text': 'Works',
                          'userResults': len(userResults),
                          'todayResults': len(todayResults),
                          'overallResultsCount': overallResultsCount,
                          'averageScore': averageScore,
                          'percentageDifference': percentageDifference,
                          'averageQuestions' : averageQuestions,
                          'averageQuestionsDifference': averageQuestionsDifference})
    else:
        return JsonResponse({'text': 'not Working'})
