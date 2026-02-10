export const mockUsers = (count: number) => {
    const users = [];
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const genders = ['Male', 'Female'];

    for (let i = 0; i < count; i++) {
        users.push({
            id: i + 1,
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            company: `Company ${i + 1}`,
            city: cities[Math.floor(Math.random() * cities.length)],
            street: `Street ${i + 1}`,
            gender: genders[Math.floor(Math.random() * genders.length)],
            age: Math.floor(Math.random() * 60) + 18,
            postcode: Math.floor(Math.random() * 90000) + 10000,
            email: `user${i + 1}@example.com`,
            phone: `555-01${i.toString().padStart(2, '0')}`
        });
    }
    return users;
};
