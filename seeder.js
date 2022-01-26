const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.create({
  //     data: {
  //       name: 'Zain',
  //       email: 'zain@gaming-events.com',
  //       password: '123456',
  //       isVerified: true
  //     },
  //   })

//   await prisma.event.create({
//     data: {
//       name: "CSGO Tournament",
//       slug: "csgo-tournament",
//       venue: "Horizon Club",
//       address: "919 3rd Ave New York, New York(NY), 10022",
//       date: new Date("2022-06-09"),
//       time: "10:00 PM EST",
//       description: "CSGO Tournament featuring 2 5-a side teams",
//       image: "/images/events-1.jpg",
//       userId: 2
//     },
//   });

  const allUsers = await prisma.user.findMany();
  console.dir(allUsers, { depth: null });

  const allEvents = await prisma.event.findMany();
  console.dir(allEvents, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
