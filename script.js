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
    const filteredSongs = songs.filter(song =>
        decades.includes(song.decade) && genres.includes(song.genre)
    );
    if (filteredSongs.length > 0) {
        return filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
    }
    return null;
}

function getSongs() {
    // Replace with your actual song data.
    return [
        { title: 'Hound Dog', artist: 'Elvis Presley', decade: '1950s', genre: 'Rock' },
        { title: 'Like a Rolling Stone', artist: 'Bob Dylan', decade: '1960s', genre: 'Rock' },
        { title: 'Hotel California', artist: 'Eagles', decade: '1970s', genre: 'Rock' },
        { title: 'Billie Jean', artist: 'Michael Jackson', decade: '1980s', genre: 'Pop' },
        { title: 'Smells Like Teen Spirit', artist: 'Nirvana', decade: '1990s', genre: 'Rock' },
        { title: 'Crazy in Love', artist: 'Beyoncé', decade: '2000s', genre: 'R&B' },
        { title: 'Rolling in the Deep', artist: 'Adele', decade: '2010s', genre: 'Pop' },
        { title: 'As It Was', artist: 'Harry Styles', decade: '2020s', genre: 'Pop' },
        // Add more songs...
    ];
}
