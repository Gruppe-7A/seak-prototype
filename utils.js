export function getRandomImage() {
    // En dårlig løsning for å hente ut bilder. Dette er bare for demoprosjekt.
    // I virkeligheten ville vi hatt bildeopplastning. <input type="file"> ville nok vært det vi hadde brukt
    const images = [
        'assets/bbq.jpg',
        'assets/bowling.jpg',
        'assets/coding.png',
        'assets/debate.jpg',
        'assets/event1.png',
        'assets/event2.jpg',
        'assets/event3.jpg',
        'assets/event4.jpg',
        'assets/picnic.jpg',
        'assets/quiz.jpg',
        'assets/volley.jpg'
    ]
    return images[Math.floor(Math.random() * images.length - 1)]
}

// Generer en random id mellom 1 og 1 million
export function generateId () {
    return Math.floor(Math.random() * 1_000_000)
}