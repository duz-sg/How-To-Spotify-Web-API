function bindNewReleaseButton() {
    var access_token = localStorage.getItem('access_token');
    console.log(access_token);
    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/browse/new-releases',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {
                country: 'US',
                limit: 1
            },
            success: function(response) {
                console.log(response);
                var album = response.albums.items[0];
                var artist = album.artists[0].name;
                var imgUrl = album.images[0].url;
                $('#new-album').show();
                $('#new-album-name').text(album.name);
                $('#new-album-artist').text(artist);
                $('#new-album-picture').attr('src', imgUrl);
                localStorage.setItem("album_id", album.id);
            },
            complete: function(xhr, textStatus) {
                if (xhr.status == 401) {
                    alert(xhr.statusText + ", please log in.");
                }
            }
        });
    } else {
        $('#new-album').hide();
        alert("Need to login first!");
    }
}

document.getElementById('new-release-button').addEventListener('click', bindNewReleaseButton);

function bindGetTracks() {
    var access_token = localStorage.getItem('access_token');
    var album_id = localStorage.getItem('album_id');
    var api_url = "https://api.spotify.com/v1/albums/" + album_id + "/tracks";
    if (access_token && album_id) {
        $.ajax({
            url: api_url,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            data: {},
            success: function(response) {
                console.log(response);
                $('#new-tracks').show();
                response.items.forEach(function(track) {
                    $('#new-tracks ul').append(
                        $('<li>').append(
                            $('<video>').attr('controls', '').attr('height', '100').append(
                                $('<source>').attr('src', track.preview_url).attr('type', 'audio/mpeg')
                            )
                        ).append(
                            $('<br>')
                        ).append(
                            $('<span>').append(
                                track.name  + " (" + msToTime(track.duration_ms)  + ")"
                            )
                        )
                    );
                });
            },
            complete: function(xhr, textStatus) {
                if (xhr.status == 401) {
                    alert(xhr.statusText + ", please log in.");
                }
            }
        });
    } else {
        $('#new-tracks').hide();
        alert("Need to login and get a new album first!");
    }
}

document.getElementById('get-tracks-button').addEventListener('click', bindGetTracks);

// Code from https://coderwall.com/p/wkdefg/converting-milliseconds-to-hh-mm-ss-mmm
function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}
