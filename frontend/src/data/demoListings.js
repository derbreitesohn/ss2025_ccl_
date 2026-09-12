import fee from '../images/fee_ccl.png';

// Opt-in presentation data only. Never used as a fallback for failed live requests.
export const demoListings = [
    { id: 'demo-fee', user_id: 'demo-owner-1', pet_name: 'Fee', animal: 'dog', breed: 'Labrador Retriever', age: '5 years', gender: 'Female', weight: '28 kg', color: 'Black', location: 'St. Pölten', listing_type: 'playdate', photo_url: fee, about: 'An easygoing walking buddy who loves a good sniff, a game of fetch, and making new friends. Looking for a companion for relaxed afternoon walks.' },
    { id: 'demo-milo', user_id: 'demo-owner-2', pet_name: 'Milo', animal: 'cat', breed: 'Domestic Shorthair', age: '2 years', gender: 'Male', weight: '4 kg', color: 'Black and white', location: 'Vienna', listing_type: 'adoption', photo_url: '/images/demo-cat.jpg', about: 'Curious, affectionate, and happiest in a sunny spot. Milo would love a quiet home with someone who has time for play and a little company.' },
    { id: 'demo-bailey', user_id: 'demo-owner-3', pet_name: 'Bailey', animal: 'dog', breed: 'Golden Retriever', age: '3 years', gender: 'Male', weight: '30 kg', color: 'Golden', location: 'Krems', listing_type: 'playdate', photo_url: '/images/demo-dog.jpg', about: 'A friendly ball of energy with a love for the outdoors. Bailey is looking for a playful pal to join him on weekend adventures.' },
    { id: 'demo-luna', user_id: 'demo-owner-4', pet_name: 'Luna', animal: 'cat', breed: 'Domestic Shorthair', age: '1 year', gender: 'Female', weight: '3 kg', color: 'Ginger', location: 'Vienna', listing_type: 'adoption', photo_url: '/images/demo-kitten.jpg', about: 'A sweet, playful little cat who enjoys exploring and curling up beside you. Luna is looking for a patient, loving home to settle into.' },
];
