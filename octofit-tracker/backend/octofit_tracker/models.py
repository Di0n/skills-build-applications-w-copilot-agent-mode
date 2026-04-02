from djongo import models

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')

    def __str__(self):
        return self.name

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity = models.CharField(max_length=100)
    duration = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.name} - {self.activity}"

class Workout(models.Model):
    name = models.CharField(max_length=100)
    suggestion = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    points = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.name} - {self.points}"
