from django.db import models
from django.contrib.auth.models import User
import random
from django.utils import timezone


class Quiz(models.Model):
    STATUS_CHOICES = [
        ('ready', 'Ready to use'),
        ('testing', 'Needs testing'),
        ('draft', 'Draft'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=20)
    time = models.IntegerField(default=0, help_text = "Duration of the quiz in minutes.")
    number_of_questions = models.IntegerField(default=1)
    required_score_to_pass = models.IntegerField(help_text = "required score to pass", default = 0)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    subject = models.CharField(max_length=100, default='')  # New field for subject
    
    class Meta:
        verbose_name_plural = 'Quizzes'

    
    def get_questions(self):
        return self.question_set.all()[:self.number_of_questions]
    
    def __str__(self):
        return self.title
    
class Result(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:
        return str(self.score)

class Question(models.Model):
    text = models.TextField()
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def get_answers(self):
        return self.answer_set.all()

    def __str__(self):
        return self.text

# Create your models here.
class Answer(models.Model):
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return f'question: {self.question.text}, answer: {self.text}, correct: {self.is_correct}'
    