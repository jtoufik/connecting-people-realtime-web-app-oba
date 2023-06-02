# Connecting People - Realtime Web App

Om de klantrelatie te bestendigen ontwikkel je bij wijze van relatiegeschenk een realtime toepassing voor een bestaande opdrachtgever. Je kiest een opdrachtgever waar je het afgelopen jaar met plezier mee hebt samengewerkt. Verbaas ze met jouw eigen initiatief en jouw capaciteiten en versterk daarmee de relatie.

## Context

Deze leertaak hoort bij sprint 11 "Connecting People". Dit is een leertaak die je in een team uitvoert voor een opdrachtgever.

In het college S11W1-01-Sprintplanning-Connecting-People en de workshop S11W1-02-My-first-chatroom wordt de opdracht en de werkwijze uitgelegd.

## Doel van deze opdracht

Je maakt in deze leertaak een real-time applicatie waarmee mensen direct met elkaar in verbinding staan om te chatten, berichten te sturen, vragen te stellen, een chatbot te gebruiken, of iets anders.

## Werkwijze

Je werkt in een team van max. 3 frontenders aan een website voor een opdrachtgever. Zorg er voor dat je duidelijk afspraken maakt en elkaar dagelijks op de hoogte houdt van vorderingen. Samen met jouw team ben je verantwoordelijk voor de planning, het samenwerkingsproces én het eindresultaat.

Deze opdracht gaat over alle fases van de DLC [analyseren](#analyseren), [ontwerpen](#ontwerpen), [bouwen](#bouwen), [integreren](#integreren) en [testen](#testen).

### Analyseren
In de analysefase ga je na of wat jullie vorige sprint hebben vastgelegd over  hoe jullie [samenwerken](#samenwerken) nog klopt. Je houdt een [brainstom](#brainstorm) over het te realiseren real-time product. Ook onderzoek je wat jullie gaan maken en maak je een [planning](#planning). 

#### Samenwerken
In de analysefase herzie je als team afspraken over hoe je gaat samenwerken.

1. Fork deze leertaak en zet de _repository_ klaar voor het team zodat iedereen met dezelfde codebase kan werken. Kopieer de bestanden uit de vorige sprint en koppel Adaptable of Railway aan deze nieuwe omgeving. (Dit is handig omdat je de bewijslast uit vorige sprint intact laat.)
3. Bekijk het Teamcanvas en vul het aan met eventuele inzichten uit de retrospect van vorige sprint, bespreek bijgestelde persoonlijke doelen met je teamgenoten. Loop als team de andere vlakken van het Teamcanvas na.
5. Ga na welke afspraken jullie hadden over hoe jullie samenwerken, vul aan met nieuwe inzichten en leg de afspraken vast in de _wiki_.

#### Materiaal voor samenwerken

- [Adaptable.io](https://adaptable.io/)
- [Railway](https://railway.app/)
- [How to Collaborate on GitHub](https://code.tutsplus.com/tutorials/how-to-collaborate-on-github--net-34267)
- [download het Team Canvas](https://github.com/fdnd-task/performance-matters-fast-website/blob/main/docs/Teamcanvas.pdf)
- [Lees instructies over het gebruik van het Teamcanvas in de deeltaak uit sprint 1](https://github.com/fdnd-task/your-tribe-team-canvas)

#### Brainstorm

In deze sprint maak je als team een real-time toepassing om je opdrachtgever te verassen. We beginnen met een brainstorm om vast te stellen wat je gaat opleveren. Tip: Houd het klein en behapbaar.

1. Houdt een brainstorm over het te realiseren realtime product
2. Maak een morphological chart om systematisch ideeën te genereren
3. Zorg dat je tenminste 10 ideeën hebt verzameld voor je verder gaat.

##### Materiaal voor de brainstorm

De twee onderstaande video’s helpen je bij het gebruiken van de Morphological chart als design thinking tool voor het genereren van ideeën:re

- [Design Thinking for Education, Ep. 3: Morphological Charts](https://www.youtube.com/watch?v=sO4R8yCF2iw)
- [Initial ideas Morphological analysis](https://www.youtube.com/watch?v=ijsQgOUt9s8)

#### Planning
In de analysefase bespreek je als team welke werkzaamheden er zijn, wie wat gaat doen en maak je een planning.

1. Koppel het _project board_ aan de nieuwe gezamenlijke _repository_ om bij te kunnen houden wie wat doet.
2. Plan voor de aankomende weken alle standups en reviews en noteer de planning in jullie _project board_.
3. Bekijk álle _User Stories_ die bij het project horen. Bespreek met elkaar of er een user story bij zit die past bij de ideeën.
4. Stel vervolgens samen een *real-time user story* op afgestemd op jullie ideeën. Maak zonnodig meerdere user stories.
5. Maak voor de *real-time user story* meerdere taken aan in het *project board*, geef ze een prioriteit en voeg de namen toe van de mensen die eraan gaan werken. ProTip: Als taken te groot zijn (langer dan een dag duren) is het zinvol ze op te splitsen in meerdere kleinere taken.

#### Materiaal planning

- [About Githhub Projects, quickstart en best practices](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
- [Wat is een User Story?](https://agilescrumgroup.nl/wat-is-een-user-story/)
- [What's Microproductivity?](https://blog.trello.com/microproductivity-break-tasks-into-smaller-steps)

### Ontwerpen
In de ontwerpfase neem je ontwerpbeslissingen en zorg je dat je precies weet wat je moet gaan bouwen

1. Kies onderbouwd, een van de ideeën en maak daar een ontwerp voor
2. Begin met het schetsen van wireframes, check die bij medestudenten en docenten en verbeter ze met de nieuwe inzichten.
3. Werk jouw wireframes uit in Figma en link ze aan elkaar zodat een digitale wireflow ontstaat.
4. Maak de schematische weergave van de state van jouw applicatie in een process-flow.
5. Laat zien welke socket verbindingen gelegd worden in een data-lifecycle diagram.

### Bouwen
In de bouwfase realiseer je de beslissingen uit de ontwerpfase.

1. Voeg socket.io toe aan aan je project met behulp van npm install.
2. Zorg dat er serverside en client-side naar basis events geluisterd wordt.
3. Implementeer in kleine stapjes de functionaliteit voor jouw toepassing. Deel als het nodig is de stapjes in met behulp van een docent.

ProTip: Je kunt je functionaliteit het beste op een losse branch uitwerken, deze branch kan je als dev-project in Adaptable of Railway live brengen zodat je live kunt testen.

#### Materiaal bouwfase

- [socket.io](https://socket.io/)
- [socket.io documentatie](https://socket.io/docs/v4/)
- [Barebonechat voorbeeld van ju5tu5@github](https://github.com/ju5tu5/barebonechat)

### Integreren
In de integratiefase voer je de aanpassingen door zodat iedereen ze kan zien en er op verder kan bouwen. 

1. Integreer jouw real-time web app in de bestaande website van de opdrachtgever.
2. Maak een *pull-request* voor de real-time functionaliteit.
3. Handel het *pull-request* af, zorg voor een helder gedocumenteerd *pull-request* door bij de afhandeling relevante berichten te typen. Neem een screenshot van *pull-requests* op in je wiki!
4. Publiceer jouw project via bijv. Adaptable of Railway (nb. cyclic ondersteund helaas geen sockets!)


#### Materiaal integratiefase

- [Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [GitHub, Aan een project bijdragen](https://git-scm.com/book/nl/v2/GitHub-Aan-een-project-bijdragen) (laat je niet afschrikken door de command line code, jij kunt daar prima GitHub Desktop voor gebruiken!)
- [Adaptable.io](https://adaptable.io/)
- [Railway](https://railway.app/)

### Testen
In de testfase controleer je of jouw aanpassingen werken zoals bedoeld. Zoals je weet gaat de testfase over jouw eindgebruikers.

1. Doe een user-test met medestudenten of familieleden. Bereid de test voor met een testplan en noteer je plan én je bevindingen in de wiki.
2. Doe een accessibility test met lighthouse - vergeet niet de handmatige tests uit te voeren - en noteer je bevindingen in de wiki.
3. Doe een performance test met lighthouse en noteer je bevindingen in de wiki.
4. Doe tenslotte een acceptatietest door jouw relatiegeschenk te presenteren aan de opdrachtgever en noteer je bevindingen in de wiki.

## Criteria
*Definitions of done*

Focus sprint 11 - De focus van deze sprint ligt op het maken van multi-user omgeving door het opzetten van een real-time verbinding tussen client en server. 

### Deze leertaak hoort bij de gedragscriteria:

M: Je houdt in beginnende mate rekening met de belangen van de eindgebruiker bij het realiseren van een oplossing voor een opdrachtgever.

C: Je documenteert op professionele wijze en houdt voortgang bij.

P: Je combineert aangeboden principes en conventies op het gebied van frontend, interface design en vormgeving om een passende oplossing voor een opdrachtgever te realiseren.

P: Je schetst om gedachten en processen te verkennen en abstracte begrippen over te brengen.

L: Je maakt aangeboden en zelf gevonden materie eigen en gebruikt dit bij leertaken, deelt ervaring binnen de squad.

Deze opdracht is done als:

- [ ] Er staat een werkende real-time web app online en deze is door meerdere gebruikers tegelijk te gebruiken
- [ ] Er is een nieuwe user story opgesteld voor de real-time functionaliteit
- [ ] De functionaliteit werkt zoals verwacht
- [ ] De app is gedocumenteerd in de Readme van het project
- [ ] Alle beslissingen zijn navolgbaar in de wiki van het project
- [ ] De opdrachtgever is blij verrast met het resultaat
