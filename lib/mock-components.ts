export interface ShipComponent {
    id: string;
    name: string;
    type: 'weapon' | 'missile' | 'turret' | 'utility';
    subType?: 'repeater' | 'cannon' | 'scattergun';
    size: number;
    manufacturer: string;
    damage: number;
    fireRate: number; // rpm
    price: number;
    description: string;
}

export const MOCK_COMPONENTS: ShipComponent[] = [
    // --- WEAPONS SIZE 1 ---
    {
        id: 'cf-117-bulldog',
        name: 'CF-117 Bulldog',
        type: 'weapon',
        subType: 'repeater',
        size: 1,
        manufacturer: 'Klaus & Werner',
        damage: 38,
        fireRate: 500,
        price: 950,
        description: 'Reliable laser repeater, standard issue for light fighters.'
    },
    {
        id: 'm3a-laser-cannon',
        name: 'M3A Laser Cannon',
        type: 'weapon',
        subType: 'cannon',
        size: 1,
        manufacturer: 'Behring',
        damage: 65,
        fireRate: 150,
        price: 1100,
        description: 'High alpha damage energy cannon.'
    },

    // --- WEAPONS SIZE 2 ---
    {
        id: 'cf-227-badger',
        name: 'CF-227 Badger',
        type: 'weapon',
        subType: 'repeater',
        size: 2,
        manufacturer: 'Klaus & Werner',
        damage: 55,
        fireRate: 480,
        price: 1800,
        description: 'Balanced laser repeater with sustained output.'
    },
    {
        id: 'sledge-ii-mass-driver',
        name: 'Sledge II Mass Driver',
        type: 'weapon',
        subType: 'cannon',
        size: 2,
        manufacturer: 'Knightsbridge Arms',
        damage: 120,
        fireRate: 80,
        price: 2200,
        description: 'Ballistic specialized driver. Shield penetration enabled.'
    },

    // --- WEAPONS SIZE 3 ---
    {
        id: 'cf-337-panther',
        name: 'CF-337 Panther',
        type: 'weapon',
        subType: 'repeater',
        size: 3,
        manufacturer: 'Klaus & Werner',
        damage: 82,
        fireRate: 450,
        price: 3400,
        description: 'Heavy laser repeater. The gold standard for space superiority.'
    },
    {
        id: 'mantis-gt-220',
        name: 'Mantis GT-220',
        type: 'weapon',
        subType: 'repeater', // gatling
        size: 3,
        manufacturer: 'Gallenson Tactical',
        damage: 45,
        fireRate: 800,
        price: 4500,
        description: 'Ballistic Gatling. Shreds hull armor once shields are down.'
    },

    // --- WEAPONS SIZE 4 ---
    {
        id: 'cf-447-rhino',
        name: 'CF-447 Rhino',
        type: 'weapon',
        subType: 'repeater',
        size: 4,
        manufacturer: 'Klaus & Werner',
        damage: 130,
        fireRate: 400,
        price: 8500,
        description: 'Capital-grade repeater for heavy mounts.'
    },

    // --- WEAPONS SIZE 5 ---
    {
        id: 'ad5b-gatling',
        name: 'AD5B Gatling',
        type: 'weapon',
        subType: 'repeater',
        size: 5,
        manufacturer: 'Behring',
        damage: 90,
        fireRate: 1200,
        price: 15000,
        description: 'Massive ballistic gatling. Standard on the Vanguard series.'
    },

    // --- MISSILES ---
    {
        id: 'ignite-ii',
        name: 'Ignite II',
        type: 'missile',
        size: 2,
        manufacturer: 'Firestorm Kinetics',
        damage: 2800,
        fireRate: 0,
        price: 120,
        description: 'Infrared tracking missile.'
    },
    {
        id: 'dominator-ii',
        name: 'Dominator II',
        type: 'missile',
        size: 2,
        manufacturer: 'Talos',
        damage: 3100,
        fireRate: 0,
        price: 140,
        description: 'Electromagnetic (EM) tracking missile.'
    }
];
