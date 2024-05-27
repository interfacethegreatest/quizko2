from django import forms
from .models import ConversationMessage

class conversationMessageForm(forms.ModelForm):
    class Meta:
        model = ConversationMessage
        fields = ('content',)
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'placegolder' : 'Leave a comment here',
                'style' : 'height:100px;width: 60%;background:grey;'
            })
        }