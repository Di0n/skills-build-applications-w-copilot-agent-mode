from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from django.conf import settings

from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect direct to MongoDB for index creation
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Collections
        users_col = db['users']
        teams_col = db['teams']
        activities_col = db['activities']
        leaderboard_col = db['leaderboard']
        workouts_col = db['workouts']

        # Clean collections
        users_col.delete_many({})
        teams_col.delete_many({})
        activities_col.delete_many({})
        leaderboard_col.delete_many({})
        workouts_col.delete_many({})

        # Unieke index op email
        users_col.create_index([('email', 1)], unique=True)

        # Teams
        marvel = {'name': 'Team Marvel'}
        dc = {'name': 'Team DC'}
        marvel_id = teams_col.insert_one(marvel).inserted_id
        dc_id = teams_col.insert_one(dc).inserted_id

        # Users
        users = [
            {'name': 'Spider-Man', 'email': 'spiderman@marvel.com', 'team_id': marvel_id},
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'team_id': marvel_id},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'team_id': dc_id},
            {'name': 'Batman', 'email': 'batman@dc.com', 'team_id': dc_id},
        ]
        user_ids = users_col.insert_many(users).inserted_ids

        # Activities
        activities = [
            {'user_id': user_ids[0], 'activity': 'Running', 'duration': 30},
            {'user_id': user_ids[1], 'activity': 'Cycling', 'duration': 45},
            {'user_id': user_ids[2], 'activity': 'Swimming', 'duration': 60},
            {'user_id': user_ids[3], 'activity': 'Yoga', 'duration': 40},
        ]
        activities_col.insert_many(activities)

        # Workouts
        workouts = [
            {'name': 'Morning Cardio', 'suggestion': 'Run 5km'},
            {'name': 'Strength', 'suggestion': 'Push-ups and squats'},
        ]
        workouts_col.insert_many(workouts)

        # Leaderboard
        leaderboard = [
            {'user_id': user_ids[0], 'points': 100},
            {'user_id': user_ids[1], 'points': 90},
            {'user_id': user_ids[2], 'points': 110},
            {'user_id': user_ids[3], 'points': 95},
        ]
        leaderboard_col.insert_many(leaderboard)

        self.stdout.write(self.style.SUCCESS('octofit_db succesvol gevuld met testdata!'))
