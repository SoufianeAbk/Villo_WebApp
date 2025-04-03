🚴 Villo-fietsstations in Brussel
Een interactieve webapplicatie waarmee gebruikers Villo-fietsstations in Brussel kunnen bekijken, filteren, sorteren, opslaan als favorieten én feedback geven — met ondersteuning voor dark mode en geolocatie.

📌 Projectbeschrijving
Deze webapp toont een lijst van Villo-fietsstations in Brussel, op basis van open data van het Brussels Gewest. Gebruikers kunnen:

- Fietsstations filteren op gemeente
- Sorteren op naam of afstand
- Favoriete stations opslaan
- Feedback achterlaten over hun ervaring
- Overschakelen naar dark mode, met onthouden voorkeur via localStorage
- De app is volledig client-side en maakt gebruik van moderne webtechnologieën zoals fetch, localStorage, Geolocation API en DOM-manipulatie.

⚙️ Functionaliteiten
Functie	Beschrijving
🔎 Filteren op gemeente	kies een specifieke gemeente om alleen stations in die regio te zien.
↕️ Sorteren	 op naam (A-Z) of op afstand tot jouw locatie.
❤️ Favorieten	worden opgeslagen in een lijst.
✏️ Feedbackformulier	laat opmerkingen of suggesties achter, lokaal opgeslagen.
🌙 Dark mode	wissel tussen licht/donker thema; voorkeur wordt onthouden.
📍 Geolocatie-integratie	als de gebruiker toestemming geeft, wordt afstand tot stations berekend.
✅ Responsieve interface	werkt goed op zowel desktop als mobiel.
🔌 Gebruikte API's
Stations Villo - Bruxelles RBC

Beschrijving: Dataset met actuele informatie over Villo-fietsstations in het Brussels Hoofdstedelijk Gewest.
Endpoint (OpenData Brussels):
https://bruxellesdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/stations-villo-bruxelles-rbc/records?limit=20

Bevat volgende velden:
name_nl: naam van het station
address_nl: adres
mu_nl: gemeente
geo_point_2d: coördinaten
status: beschikbaarheid
google_maps: link naar Google Maps

🧪 Technische stack
HTML & CSS – voor markup en styling
JavaScript – geen externe libraries
localStorage API – voor het onthouden van thema, favorieten en feedback
Geolocation API – voor afstandsberekening tot stations
OpenData API – voor dynamische data van Villo-stations
![image](https://github.com/user-attachments/assets/6fde9a4e-68e7-4265-a1ad-3513a0a81441)
