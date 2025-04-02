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
