----------------------------------------------------------------------------------


# StudySync

StudySync helps students find compatible study partners in seconds using course, schedule, and goal-based matching.

Built during the Laurier Hackathon, this platform turns studying into a structured and social experience instead of a solo task.

----------------------------------------------------------------------------------


## Demo

Demo Video: [Add YouTube Link]
Live App: [Add Deployment Link]

----------------------------------------------------------------------------------


## Problem

Students struggle to find reliable study partners.

* Classmates have different schedules
* Group chats are unorganized
* It is hard to find people with similar goals
* Students end up studying alone

This leads to low accountability and inconsistent study habits.

----------------------------------------------------------------------------------


## Solution

StudySync matches students based on real academic data.

Instead of random connections, users are matched using:

* Courses
* Availability
* Study goals
* Preferences

Users can discover, match, and start studying together quickly.

----------------------------------------------------------------------------------


## Key Features

### Smart Matching System

* Matches users based on shared courses and schedule overlap
* Considers study goals and preferences
* Generates a compatibility score

### Profile-Based Discovery

Users create structured profiles including:

* Program and year
* Courses
* Availability
* Study goals
* Meeting preference

### Swipe-Style Matching

* Browse potential matches
* View compatibility score
* Match or skip

### Real-Time Notifications

* Match requests
* Accept or decline updates

### Messaging System

* Chat with matched users
* Coordinate study sessions

### Guided Onboarding

* Ensures complete profiles
* Improves match accuracy

----------------------------------------------------------------------------------


## What Makes StudySync Different

* Uses academic data instead of generic profiles
* Compatibility scoring replaces manual searching
* Designed specifically for university students
* Focuses on productivity and accountability, not social distraction

----------------------------------------------------------------------------------


## Impact

* Reduces time to find study partners from days to seconds
* Improves accountability through structured matching
* Helps students stay consistent and motivated
* Encourages collaborative learning

----------------------------------------------------------------------------------


## Tech Stack

Frontend

* Next.js (React)
* Tailwind CSS

Backend

* Supabase (Authentication, Database, Realtime)

Other

* Custom matching algorithm
* Real-time updates using subscriptions

----------------------------------------------------------------------------------

## How It Works

1. User signs up
2. User completes profile (courses, schedule, goals)
3. System calculates compatibility scores
4. User browses matches
5. User sends match request
6. Once accepted, users can chat

----------------------------------------------------------------------------------


## Matching Algorithm

The system evaluates compatibility based on:

* Course overlap
* Availability overlap
* Study goals
* Meeting preferences
* Program and year

Each factor contributes to a final score out of 100.

----------------------------------------------------------------------------------


## Architecture

Frontend (Next.js) connects to Supabase for authentication, database storage, and real-time updates.

----------------------------------------------------------------------------------


## Screenshots

(Add screenshots here)

* Onboarding flow
* Match discovery screen
* Messaging interface

----------------------------------------------------------------------------------


## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/YOUR-REPO-LINK
cd YOUR-REPO
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run the app:

```bash
npm run dev
----------------------------------------------------------------------------------


Open in browser:

[http://localhost:3000](http://localhost:3000)

----------------------------------------------------------------------------------


## Challenges

* Designed a matching algorithm under time constraints
* Implemented real-time updates using Supabase
* Built full authentication and matching system within a hackathon timeframe
* Maintained consistent UI across multiple pages

----------------------------------------------------------------------------------


## Future Improvements

* AI-powered match recommendations
* Calendar integration
* Group study sessions
* Mobile version
* Advanced filtering

----------------------------------------------------------------------------------


## Team Contributions

Each team member contributed to:

* Frontend UI and UX
* Backend integration
* Matching logic
* Testing and debugging

(Add names and roles if needed)

----------------------------------------------------------------------------------


## Built For

Laurier Hackathon
Built in a limited timeframe to deliver a complete working solution.

----------------------------------------------------------------------------------


