document.addEventListener('DOMContentLoaded', () => {

import { sdk } from 'https://esm.sh/@farcaster/frame-sdk';

document.addEventListener('DOMContentLoaded', () => {
    const decades = [];
    const genres = [];
    let selectedSong = null;

    document.querySelectorAll('.decade-button').forEach(button => {
        button.addEventListener('click', () => {
            const decade = button.dataset.decade;
            if (decades.includes(decade)) {
                decades.splice(decades.indexOf(decade), 1);
                button.style.backgroundColor = '';
            } else {
                decades.push(decade);
                button.style.backgroundColor = 'lightblue';
            }
        });
    });

    document.querySelectorAll('.genre-button').forEach(button => {
        button.addEventListener('click', () => {
            const genre = button.dataset.genre;
            if (genres.includes(genre)) {
                genres.splice(genres.indexOf(genre), 1);
                button.style.backgroundColor = '';
            } else {
                genres.push(genre);
                button.style.backgroundColor = 'lightgreen';
            }
        });
    });

    document.getElementById('randomize-button').addEventListener('click', () => {
        if (decades.length === 0 || genres.length === 0) {
            alert('Please select at least one decade and one genre.');
            return;
        }

        selectedSong = getRandomSong(decades, genres);
        if (selectedSong) {
            document.getElementById('result').textContent = `${selectedSong.title} by ${selectedSong.artist} (${selectedSong.decade})`;
            document.getElementById('share-button').style.display = 'block';
        } else {
            document.getElementById('result').textContent = 'No matching songs found.';
            document.getElementById('share-button').style.display = 'none';
        }
    });

    document.getElementById('share-button').addEventListener('click', async () => {
        if (selectedSong) {
            const context = await sdk.context();
            const username = context.user.username || 'User';
            const castText = `${username}'s Throwback Tune of the Day is: ${selectedSong.title} by ${selectedSong.artist} (${selectedSong.decade})`;
            await sdk.actions.openUrl({ url: `farcaster://cast/${encodeURIComponent(castText)}` });
        }
    });
});

function getRandomSong(decades, genres) {
    const songs = getSongs();
    const availableSongs = [];

    decades.forEach(decade => {
        genres.forEach(genre => {
            if (songs[decade] && songs[decade][genre]) {
                availableSongs.push(...songs[decade][genre].map(song => ({ ...song, decade, genre })));
            }
        });
    });

    if (availableSongs.length > 0) {
        return availableSongs[Math.floor(Math.random() * availableSongs.length)];
    }
    return null;
}

function getSongs() {
    return {
        '1950s': {
            'Rock': [
                { title: 'Johnny B. Goode', artist: 'Chuck Berry', year: 1958 },
                { title: 'Great Balls of Fire', artist: 'Jerry Lee Lewis', year: 1957 },
                { title: 'Hound Dog', artist: 'Elvis Presley', year: 1956 }
            ],
            'Jazz': [
                { title: 'Take Five', artist: 'Dave Brubeck', year: 1959 },
                { title: 'So What', artist: 'Miles Davis', year: 1959 },
                { title: 'Moanin\'', artist: 'Art Blakey', year: 1958 }
            ],
            'Pop': [
                { title: 'Peggy Sue', artist: 'Buddy Holly', year: 1957 },
                { title: 'Come Fly With Me', artist: 'Frank Sinatra', year: 1958 },
                { title: 'Diana', artist: 'Paul Anka', year: 1957 }
            ]
        },
        '1960s': {
            // ... (add other decades and genres) ...
        },
        '1970s': {
            // ... (add other decades and genres) ...
        },
        '1980s': {
            // ... (add other decades and genres) ...
        },
        '1990s': {
            // ... (add other decades and genres) ...
        },
        '2000s': {
             // ... (add other decades and genres) ...
        },
        '2010s': {
             // ... (add other decades and genres) ...
        },
        '2020s': {
             // ... (add other decades and genres) ...
        }
    };
}
    
   // Admin Controls
    document.getElementById('show-add-form').addEventListener('click', () => {
        document.getElementById('add-song-form').style.display = 'block';
        document.getElementById('import-sheets-section').style.display = 'none';
    });

    document.getElementById('show-import-sheets').addEventListener('click', () => {
        document.getElementById('add-song-form').style.display = 'none';
        document.getElementById('import-sheets-section').style.display = 'block';
    });

    // Form Submission
    document.getElementById('add-song-button').addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const year = parseInt(document.getElementById('year').value);
        const decade = document.getElementById('decade').value;
        const genre = document.getElementById('genre').value;

        if (title && artist && year && decade && genre) {
            const newSong = { title, artist, year, decade, genre };
            const songs = getSongs();
            songs.push(newSong);
            window.getSongs = () => songs;
            document.getElementById('title').value = '';
            document.getElementById('artist').value = '';
            document.getElementById('year').value = '';
            alert('Song added!');
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Google Sheets Import
    document.getElementById('import-songs-button').addEventListener('click', () => {
        const googleSheetUrl = document.getElementById('google-sheets-url').value;

        if (googleSheetUrl) {
            fetch(googleSheetUrl)
                .then(response => response.text())
                .then(csvData => {
                    const songs = parseCsv(csvData);
                    const currentSongs = getSongs();
                    const allSongs = currentSongs.concat(songs);
                    window.getSongs = () => allSongs;
                    alert('Songs imported!');
                });
        } else {
            alert('Please enter a Google Sheets CSV URL.');
        }
    });

    function parseCsv(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const songs = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const song = {};
                for (let j = 0; j < headers.length; j++) {
                    song[headers[j].trim().toLowerCase()] = values[j].trim();
                }
                if(song.title){
                    songs.push(song);
                }
            }
        }
        return songs;
    }
});
