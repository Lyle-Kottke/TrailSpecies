# TrailSpecies
CS520 Semester Project
TrailSpecies is a trail web app that allows the user to identify potential species around a specific trail
## Running Instructions ##
1. ```npm install```
2. ```npm run dev```
3. Open http://localhost:3000/
4. Sign in with a Non-Umass email, due to Supabase Auth's SMTP restrictions.

**IMPORTANT NOTE**: There will be a **50 second delay** when fetching initially, due to Render Hosting Services "waking up" the hosted backend service, as it sleeps when not in use. 
After this delay, the fetches work at normal speed. We hoped to improve this, but this is a feature of Render Hosting Service's free tier. 

Contributions:  
Lyle-Kottke: Frontend and presentation  
CharlesLiu-Umass: Data acquisition, iNaturalist script  
Natkai2040: Backend, API endpoints, presentation  
tanishkapasarad: Planning, quality assurance, use-case diagram, presentation
