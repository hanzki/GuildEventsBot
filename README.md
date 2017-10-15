# GuildEventsBot

A chatbot for displaying information about [Tietokilta](http://tietokilta.fi/) events. The purpose of this project is to
test out [Dialogflow](https://dialogflow.com/) chatbot platform and in the process make something useful for my fellow students.

## Architecture

This bot has been built on top of the [Dialogflow](https://dialogflow.com/) platform. 

This repository includes code for the webhook implementation for providing users with information about the guild events.
The webhook is implemented using Google Firebase functions. Function code resides in `/functions` folder. The event data
is scraped from the Tietokilta website periodically and uploaded to the Firebase database. The chatbot webhook queries data
from the database.

The `/appengine` folder includes a google cloud app engine app for posting periodical pubsub events for triggering the data
scraping functions. The app engine wouldn't be needed if Firebase functions would support cron triggers.
