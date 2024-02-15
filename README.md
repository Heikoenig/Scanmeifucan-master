Dies ist ein Gruppenprojekt von Heiko König, Felix Kopp, Moritz Michael Völkner, Sebastian Ludwig, Jendrik Weiss im Rahmen des Studiengangs Onlinemedien 
im Jahrgang ON21 (2021) an der DHBW in Mosbach. 

Im folgenden finden Sie eine detaillierte Installationsanleitung, um die Anwendung auf Windows lokal (localhost) lauffähig zu bekommen. Da das Projekt u.a. aus
Datenschutzgründen nicht gehostet wird, sind einige lokale Installationen erforderlich, damit die Anwendung genutzt werden kann. 

Sollten Sie sich lediglich einen Überblick über den Aufbau und die Funktionsweise unserer App verschaffen wollen, können Sie sich das detaillierte Showcase-Screenvideo
ansehen. Ansonsten fahren Sie mit der Installation fort. 

INSTALLATIONSANLEITUNG: 

1. Laden Sie sich das Git-Repository unter: https://github.com/Heikoenig/Scanmeifucan-master.git

2. Python 3.9 installieren (z.B. aus dem Microsoft App Store) --> andere Python Releases wurden nicht getestet, sollten aber auch funktionieren. 

3. Tesseract OCR installieren --> gehen Sie beispielsweise auf folgende Website und laden Sie sich Tesseract OCR für Ihr entsprechendes Betriebssystem herunter und 
installieren Sie Tesseract anschließend:
https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.3.20231005.exe

Anschließend aktualisieren Sie in der Datei api.py im Backend-Verzeichnis den folgenden Link durch den Pfad zu Ihrer Lokalen tesseract-Installationsdatei
(nachdem es installiert wurde):

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe' (hier ersetzen Sie lediglich den Pfad)

3. Öffnen Sie das Projekt SCANMEIFUCAN-master in Visual Studio Code oder einer vergleichbaren IDE. Öffnen Sie ein Terminal und bewegen Sie sich in das Frontend-Verzeichnis mit

cd .\SCANMEIFUCAN_Backend\ 

anschließend geben Sie folgenden Befehl in Ihr Terminal ein: pip install -r requirements.txt
Sollte sich der Befehl nicht ausführen lassen öffnen Sie Python in Ihrem Windows-Terminal, bewegen Sie sich in das selbe Verzeichnis und führen den Befehl in Ihrem 
Terminal aus.

4. Im nächsten Schritt muss im selben Verzeichnis 

cd .\SCANMEIFUCAN_Backend\ 

der folgenden Befehl ausgeführt werden: python run-once.py
Hiermit laden sie das nltk (Natural Language Processing Library) und die notwendigen Pakete herunter.

5. Installieren Sie die Postgres-Datenbank, erstellen Sie eine Datenbank mit dem Namen (nur Datenbank erstellen, Spalten und Zellen definieren, wird automatisch
erstellt) scan-me und aktualisieren Sie den folgenden Pfad in "apy.py" auf der Grundlage 
Ihres Benutzernamens und Passworts:

# Configure the PostgreSQL database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/ScanMeIfYouCan_DB_Alpha'

Setzten Sie bei root Ihr bei der Installation von Postgresql festgelegtes Superuser-Passwort ein. Dies wird benötigt um auf die Datenbank zugreifen und diese schreiben
zu können. 

Als Unterstützung bei der Installation von Postgresql kann das folgende Tutorial genutzt werden: https://youtu.be/WxBfnGH3FsU?si=i783Yy9cmaGss65i

6. Bewegen Sie sich im Terminal in das Backend: 

cd .\SCANMEIFUCAN_Backend\ 

und geben Sie folgenden Befehl in das Terminal ein: 

python api.py 

Das Backend ist nun aktiv. 

7. Öffnen Sie anschließend ein neues Terminal (übersichtlicher) und gehen Sie anschließend in das Frontend-Verzeichnis: 

cd .\SCANMEIFUCAN_Frontend\projects\lottie-anim

und geben Sie folgenden Befehl ins Terminal ein: 

npm install 

Gehen Sie in Ihrem Verzeichnis anschließen wieder eine Ebene höher, indem Sie folgenden Befehl ins Terminal eingeben: 

cd ..

und geben im Anschluss folgende Befehle ein: 

npm install
npm run build (nur beim ersten Mal, um Angular-Projekt zu builden)

npm run start "oder" ng serve


Nachdem der Prozess im Terminal abgeschlossen wurde öffnen Sie anschließend Localhost und haben Sie mit SCANMEIFUCAN Spaß!! 







