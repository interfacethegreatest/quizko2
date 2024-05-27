from django import forms
from .models import Quiz,Question,Answer
from django.contrib.auth.models import User

from django import forms
from .models import Quiz

from django import forms
from .models import Question

class QuestionCreationForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text', 'quiz']
        labels = {
            'text': 'Question Text',
            'quiz': 'Associated Quiz'
        }
        widgets = {
            'text': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Enter your question here', 'class': 'form-control'}),
            'quiz': forms.Select(attrs={'class': 'form-select'})
        }



class QuizCreationForm(forms.ModelForm):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    difficulty = forms.ChoiceField(choices=DIFFICULTY_CHOICES, widget=forms.Select(attrs={
        'class': 'form-select',
        'placeholder': 'Select difficulty'
    }))

    class Meta:
        model = Quiz
        fields = ['title', 'description', 'difficulty', 'time', 'number_of_questions', 'required_score_to_pass', 'subject']
        labels = {
            'title': 'Title',
            'description': 'Description',
            'time': 'Time (in minutes)',
            'number_of_questions': 'Number of Questions',
            'required_score_to_pass': 'Required Score to Pass',
            'subject': 'Subject'
        }
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'Title of your quiz',
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'placeholder': 'Your test is about...',
                'class': 'form-control'
            }),
            'time': forms.NumberInput(attrs={
                'min': 1,
                'placeholder': 'Timed duration of your test',
                'class': 'form-control'
            }),
            'number_of_questions': forms.NumberInput(attrs={
                'min': 1,
                'placeholder': 'Total questions',
                'class': 'form-control'
            }),
            'required_score_to_pass': forms.NumberInput(attrs={
                'min': 1,
                'placeholder': 'Enter required score to pass',
                'class': 'form-control'
            }),
            'subject': forms.TextInput(attrs={
                'placeholder': 'Subject of your quiz',
                'class': 'form-control'
            })
        }
