const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser() {
  await prisma.user.create({
    data: {
      name: "Hamza",
      email: "hamza@gaming-events.com",
      password: "123456",
      isVerified: true,
    },
  });

  const allUsers = await prisma.user.findMany();
  console.dir(allUsers, { depth: null });
}

async function createEvent() {
  await prisma.event.create({
    data: {
      name: "Fortnite Tournament",
      slug: "fortnite-tournament",
      venue: "Jackson Club",
      address: "902 3rd Ave Pasadena, California(CA), 10022",
      date: new Date("2022-03-09"),
      time: "08:00 PM EST",
      description: "Fortnite Tournament featuring 2 5-a side teams",
      image: "/images/events-3.jpg",
      userId: 3,
    },
  });

  const allEvents = await prisma.event.findMany();
  console.dir(allEvents, { depth: null });
}

if (process.argv[2] === "-cu") {
  createUser()
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else if (process.argv[2] === "-ce") {
    createEvent()
        .catch((e)=> {
            throw e;
        })
        .finally(async () => {
            await prisma.$disconnect();
        })
}
else {
  console.log("Command not recognized");
  process.exit();
}


