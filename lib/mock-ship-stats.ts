export type ShipStats = {
    id: string;
    manufacturer: string;
    focus: string;
    description: string;
    specs: {
        length: string;
        beam: string;
        height: string;
        mass: string;
        scm: string;
        max_speed: string;
    };
    crew: {
        min: string;
        max: string;
    };
};

export const shipStats: Record<string, ShipStats> = {
    f8c: {
        id: 'f8c',
        manufacturer: 'ANVIL AEROSPACE',
        focus: 'HEAVY FIGHTER',
        description: "Few vehicles inspire the same awe as the legendary F8 Lightning. A force to be reckoned with, it has protected Humanity countless times from countless threats at home and far from civilization.",
        specs: {
            length: "25 m",
            beam: "24 m",
            height: "6.5 m",
            mass: "158.78 t",
            scm: "207 m/s",
            max_speed: "N/A"
        },
        crew: {
            min: "1",
            max: "1"
        }
    },
    '300i': {
        id: '300i',
        manufacturer: 'ORIGIN JUMPWORKS',
        focus: 'TOURING / LIGHT FIGHTER',
        description: "If you're going to travel the stars... why not do it in style? The 300i is Origin Jumpworks' premiere luxury spacecraft. It is a sleek, silver killer that sends as much of a message with its silhouette as it does with its weaponry.",
        specs: {
            length: "27 m",
            beam: "17 m",
            height: "8 m",
            mass: "66.5 t",
            scm: "155 m/s",
            max_speed: "1185 m/s"
        },
        crew: {
            min: "1",
            max: "1"
        }
    }
};
