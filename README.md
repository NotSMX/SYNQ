# SYNQ

## Overview

SYNQ is a Flask-based scheduling and game session coordination app designed to help groups create event sessions, share availability, vote on games, and auto-select a final time. It also includes session metrics and support for participant email notifications.

## What it does

- Creates collaborative sessions where a host and participants can join.
- Collects availability blocks from participants.
- Computes the best overlapping times for the group and finalizes a session time.
- Supports game voting and Steam integration for game suggestions.
- Sends email notifications when personal links are created and when a final time is confirmed.
- Provides a dashboard of usage metrics and public session listings.

## How it works

The application is built with the Flask ecosystem and uses a modular app factory pattern in `website/__init__.py`.

Key libraries:

- `Flask` for the web application.
- `flask_sqlalchemy` and `SQLAlchemy` for ORM database models.
- `flask_migrate` for schema migrations.
- `Flask-Mail` to send email notifications.
- `flask_login` for optional authentication support.
- `flask_socketio` with `gevent`/`gevent-websocket` for real-time session updates.
- `requests` to call the Steam Web API.
- `python-dotenv` to load environment variables from a `.env` file.
- `gunicorn` as a production WSGI server with `geventwebsocket` worker support.

## Repository structure

- `app.py` - application entry point and Socket.IO runner.
- `website/__init__.py` - Flask app factory, configuration, and extension initialization.
- `website/views.py` - routes for session creation, joining, availability, auto-pick, confirmation, feedback, and metrics.
- `website/models.py` - SQLAlchemy models for sessions, participants, availability, confirmations, game votes, experiments, and feedback.
- `website/utils.py` - helper functions for sending email notifications.
- `website/steam.py` - Steam user and games lookup logic.
- `website/metrics.py` - dashboard metric calculations.
- `website/static/` - static CSS, JS, and image assets.
- `website/templates/` - HTML templates for pages and flows.
- `tests/` - automated tests covering views, models, utilities, and app behavior.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/NotSMX/SYNQ synq
cd synq
```

2. Create and activate a Python virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Environment configuration

Create a `.env` file in the project root or set these environment variables directly.

Required / recommended variables:

- `DATABASE_URL` - database connection URI. Defaults to `sqlite:///dev.db` if unset.
- `SECRET_KEY` - Flask secret key. Defaults to `dev` in development.
- `EMAIL_USER` - SMTP email username for notification emails.
- `EMAIL_PASSWORD` - SMTP email password.
- `RAWG_API_KEY` - optional API key for the RAWG game service.
- `HUGGINGFACE_API_KEY` - optional Hugging Face API key.
- `STEAM_API_KEY` - Steam Web API key for Steam profile and library lookups.
- `PORT` - port to use when running locally. Defaults to `5000`.

Example `.env`:

```ini
DATABASE_URL=sqlite:///dev.db
SECRET_KEY=your-secret-key
EMAIL_USER=you@example.com
EMAIL_PASSWORD=your-email-password
RAWG_API_KEY=your-rawg-key
HUGGINGFACE_API_KEY=your-huggingface-key
STEAM_API_KEY=your-steam-key
```

## Running locally

Start the app directly with Python:

```bash
python app.py
```

Then browse to `http://localhost:5000`.

## Production deployment

The repository includes a `Procfile` for Heroku-style deployment:

```text
web: gunicorn --pythonpath . --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --workers 1 --timeout 120 app:app
```

Start with Gunicorn locally:

```bash
gunicorn --pythonpath . --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker --workers 1 --timeout 120 app:app
```

## Database

By default, SYNQ uses SQLite for development (`dev.db`). To use PostgreSQL or another SQLAlchemy-compatible backend, set `DATABASE_URL` and ensure the database is reachable.

## Features

- Session creation and join flow
- Availability submission and scheduling
- Automatic overlap detection and final time selection
- Manual final time override by the host
- Participant confirmation of scheduled events
- Steam integration for game suggestions
- Feedback collection and experiment tracking
- Metrics dashboard showing adoption, completion, and engagement statistics

## Testing

If tests are present in `tests/`, run them with:

```bash
pytest
```

## Notes

- Email features require valid SMTP credentials.
- Real-time session updates use Socket.IO and WebSocket support.
- Game and Steam-related features depend on API keys.
- The app supports public session discovery via `/sessions` and session-specific personal links.
