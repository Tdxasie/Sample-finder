import bs4
import re
import urllib.request

def find_samples(artist, track):
    samples = []
    url = "https://www.whosampled.com/" + artist + "/" + track + "/"
    try:
        with urllib.request.urlopen(url) as f:
            html_dump = f.read().decode('utf-8')
            html = bs4.BeautifulSoup(html_dump, 'html.parser')
            track_stats = [a.get_text() for a in html.find_all(class_='section-header-title')]
            if "samples" in track_stats[0]:
                a = html.find(class_='list bordered-list')
                for sample_html in a.find_all(class_='listEntry sampleEntry'):
                    artist = sample_html.find(class_='trackArtist').a.get_text()
                    track = sample_html.find(class_='trackName playIcon').get_text()
                    samples.append((track, artist))
            else:
                samples.append("No samples found")
    except:
        samples.append("404 not found")
    print(samples)

def sample_finder_console():
    while True:
        artist = re.sub(' ', '-', input("Artist name: "))
        track = re.sub(' ', '-', input("Track name: "))
        find_samples(artist, track)

sample_finder_console()
# find_samples(import_track_page("Die-Antwoord", "Ugly-Boy"))
