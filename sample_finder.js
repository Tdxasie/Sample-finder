window.addEventListener("load", () => {
  let form = document.getElementById('my-form')
  form.addEventListener("submit", evt => {
    evt.preventDefault(); // before the code
    let artist = form.elements[0].value;
    let track = form.elements[1].value;

    getSample(artist, track)
      .then(res => console.log(document.getElementById("sample").innerHTML=res));

  });
});

async function getSample(artist, track) {
  let corsEscape = "https://paye-ton-corse.herokuapp.com/";
  let requestUrl = "https://www.whosampled.com/" + artist.replace(' ', '-') + "/" + track.replace(' ', '-') + "/";
  let url = corsEscape + requestUrl;
  let samples = [];

  try {
    let res = await fetch(url);
    let html = await res.text();

    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(html, 'text/html');
    let trackStats = htmlDoc.getElementsByClassName('section-header-title');
    if (trackStats[0].innerHTML.includes("Contains samples")){
      let a = htmlDoc.getElementsByClassName('list bordered-list')[0];
      for (let sampleHtml of a.getElementsByClassName('listEntry sampleEntry')) {
        let artist = sampleHtml.getElementsByClassName('trackArtist')[0].firstElementChild.innerHTML;
        let track = sampleHtml.getElementsByClassName('trackName playIcon')[0].innerHTML;
        samples.push([track, artist]);
      }
    } else {
      samples.push('no samples found');
    }
  }
  catch(err){
    console.log(err);
    samples.push('404 not found');
  }
  return samples;
}
